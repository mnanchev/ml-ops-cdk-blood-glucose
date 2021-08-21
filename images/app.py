"""
AWS Lambda function to
predict blood glucose for next 30 minutes
"""
from json import loads, dumps
from os import environ
from datetime import datetime
from decimal import Decimal
from boto3 import client, resource
from gspread import authorize
from joblib import load
from numpy import NaN, array
from pandas import DataFrame, to_datetime, concat
from oauth2client.service_account import ServiceAccountCredentials
from codeguru_profiler_agent import with_lambda_profiler
# Boto3 Clients

SSM_CLIENT = client("ssm")
SNS_CLIENT = client("sns")
DYNAMO_DB_CLIENT = resource('dynamodb')
# Topic arn and profilingGroup

TOPIC_ARN = environ["SNS"]
PROFILING_GROUP = environ["CODE_GURU_PROFILING_GROUP"]
TABLE = environ["DYNAMO_DB"]
DYNAMO_DB_CLIENT = DYNAMO_DB_CLIENT.Table(TABLE)
# Google credentials

PARAM_NAME = environ['CREDENTIALS']
SCOPE = [
    "https://spreadsheets.google.com/feeds",
    "https://www.googleapis.com/auth/drive"
]
GOOGLE_TOKEN = loads(
    SSM_CLIENT.get_parameters(Names=[
        PARAM_NAME,
    ], WithDecryption=True)['Parameters'][0]['Value'])

GOOGLE_CREDENTIALS = ServiceAccountCredentials.from_json_keyfile_dict(
    GOOGLE_TOKEN)
GOOGLE_CLOUD_SPREADSHEETS = authorize(GOOGLE_CREDENTIALS)

# Cleaning Data constants

COLUMNS = ["DATETIME", "BLOOD_GLUCOSE"]
COLUMNS_DROPPED = [1, 3, 4]
COLUMN_BLOOD_GLUCOSE_TYPE = "float64"
COLUMN_DATE_TIME_REPLACE_CHARACTER = 'at'
LOW = "LOW"
HIGH = "HIGH"
FILE_PREFIX = "IFTTT_Maker_Webhooks_Events"

# ML Models
ML_MODELS = [load(model) for model in ['models/linear', 'models/rf']]
PREDICTION_PERIOD = "30min"
"""
series_to_supervised - Transforms time series to supervised learning problem
"""


def series_to_supervised(data, n_in=1, n_out=1):
    """
    Frame a time series as a supervised learning dataset.
    Arguments:
        data: Sequence of observations as a list or NumPy array.
        n_in: Number of lag observations as input (X).
        n_out: Number of observations as output (y).
        drop nan: Boolean whether or not to drop rows with NaN values.
    Returns:
        Pandas DataFrame of series framed for supervised learning.
        :param data:
        :param n_in:
        :param n_out:
        :return agg:
    """
    n_vars = 1 if isinstance(data, list) else data.shape[1]
    data_frame = DataFrame(data)
    cols, names = list(), list()
    # input sequence (t-n, ... t-1)
    for i in range(n_in, 0, -1):
        cols.append(data_frame.shift(i))
        names += [('var%d(t-%d)' % (j + 1, i)) for j in range(n_vars)]
    # forecast sequence (t, t+1, ... t+n)
    for i in range(0, n_out):
        cols.append(data_frame.shift(-i))
        if i == 0:
            names += [('var%d(t)' % (j + 1)) for j in range(n_vars)]
        else:
            names += [('var%d(t+%d)' % (j + 1, i)) for j in range(n_vars)]
    # put it all together
    agg = concat(cols, axis=1)
    agg.columns = names
    # drop rows with NaN values
    agg.dropna(inplace=True)
    return agg


def get_latest_google_spreadsheet(google_cloud_spreadsheets):
    """
    Frame a time series as a supervised learning dataset.
    Arguments:
        google_cloud_spreadsheets: Opens all spreadsheets containing blood glucose in GCP
    Returns:
        The latest spreadsheet containing blood glucose data
        :param google_cloud_spreadsheets:
        :return data_frame:
    """
    list_of_spreadsheets = {
        spreadsheet.title: spreadsheet
        for spreadsheet in google_cloud_spreadsheets.openall()
        if FILE_PREFIX in spreadsheet.title
    }
    data_frame = DataFrame(list_of_spreadsheets[sorted(
        list_of_spreadsheets.keys())[-1]].sheet1.get_all_values())
    return data_frame


def clean_data(blood_glucose_dataset):
    """
    Cleans the dataset using sequential operations
    Arguments:
        blood_glucose_dataset: Dataset with blood glucose values in mmol/dL
    Returns:
        cleaned dataset as time series
        :param blood_glucose_dataset:
        :return: blood_glucose_time_series:
    """
    blood_glucose_dataset.drop(columns=COLUMNS_DROPPED, axis=1, inplace=True)
    blood_glucose_dataset.columns = COLUMNS
    blood_glucose_dataset[COLUMNS[1]] = blood_glucose_dataset[
        COLUMNS[1]].replace([LOW], 2.2)
    blood_glucose_dataset[COLUMNS[1]] = blood_glucose_dataset[
        COLUMNS[1]].replace([HIGH], 20)
    blood_glucose_dataset[
        COLUMNS[1]] = blood_glucose_dataset.BLOOD_GLUCOSE.astype(
            COLUMN_BLOOD_GLUCOSE_TYPE)
    blood_glucose_dataset[COLUMNS[0]] = blood_glucose_dataset[
        COLUMNS[0]].str.replace(COLUMN_DATE_TIME_REPLACE_CHARACTER, '')
    blood_glucose_dataset[COLUMNS[0]] = to_datetime(
        blood_glucose_dataset[COLUMNS[0]], infer_datetime_format=True)
    blood_glucose_dataset.replace(r'', NaN, inplace=True)
    blood_glucose_dataset.fillna(0, inplace=True)
    blood_glucose_time_series = down_sample(dataset=blood_glucose_dataset,
                                            column=COLUMNS[1],
                                            index=COLUMNS[0])
    return blood_glucose_time_series


def down_sample(dataset, index, column):
    """
    Down samples the data based on period
    Arguments:
        dataset: Time series with blood glucose values in mmol/dL
        index:
        column:
    Returns:
        The down sampled data
        :param dataset:
        :param index:
        :param column:
        :return:time_series:
    """
    dataset.set_index(index, inplace=True)
    time_series = dataset[column].resample(PREDICTION_PERIOD).mean()
    return time_series


@with_lambda_profiler(profiling_group_name=PROFILING_GROUP)
def handler(event, context):
    """
    Entrypoint for the lambda function, which returns the prediction of blood glucose
    for the next 30 minutes
    Arguments:
        event:
        context:
    Returns:
        The predicted values
        :param event:
        :param context:
        :return: predicted_value:
    """
    # pylint: disable=unused-argument
    concatenated_data_frame = get_latest_google_spreadsheet(
        GOOGLE_CLOUD_SPREADSHEETS)
    data = clean_data(concatenated_data_frame).reset_index()
    data = array(data.BLOOD_GLUCOSE)
    print(data)
    cleaned_dataset = series_to_supervised(data.tolist(), n_out=3)
    last_prediction_data = cleaned_dataset.drop(["var1(t-1)"], axis=1).tail(1)
    print("LAST_PREDICTION_DATA", last_prediction_data)
    rcf_pred = ML_MODELS[1].predict(last_prediction_data)[0]
    lr_pred = ML_MODELS[0].predict(last_prediction_data)[0][0]
    current_blood_glucose = last_prediction_data["var1(t+2)"].values[0]
    message = {
        "bloodGlucose": current_blood_glucose,
        "random_cut_forest_prediction": rcf_pred,
        "linear_prediction": lr_pred,
    }
    SNS_CLIENT.publish(TopicArn=TOPIC_ARN, Message=dumps(message))
    db_current = Decimal(str(round(current_blood_glucose, 2)))
    db_pred_lr = Decimal(str(round(lr_pred, 2)))
    db_pred_rcf = Decimal(str(round(rcf_pred, 2)))
    db_ave = Decimal(str(round(((rcf_pred + lr_pred) / 2), 2)))
    response = DYNAMO_DB_CLIENT.put_item(
        Item={
            'dateTime': datetime.now().strftime("%Y%m%d%H%M%S"),
            'bloodGlucose': db_current,
            'prediction': {
                "linear_prediction": db_pred_lr,
                "random_cut_forest_prediction": db_pred_rcf,
                "average_prediction": db_ave
            }
        })
    return response
