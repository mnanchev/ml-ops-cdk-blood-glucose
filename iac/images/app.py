from json import loads
from warnings import filterwarnings
from os import environ
from boto3 import client
from gspread import authorize
from joblib import load
from numpy import NaN, array
from pandas import DataFrame, to_datetime, concat
from oauth2client.service_account import ServiceAccountCredentials
from codeguru_profiler_agent import with_lambda_profiler

filterwarnings("ignore")
SSM_CLIENT = client("ssm")
concatenated_data_frame = DataFrame()
PARAM_NAME = environ['CREDENTIALS']
CODE_GURU_PROFILING_GROUP = environ['CODE_GURU_PROFILING_GROUP']
SCOPE = [
    "https://spreadsheets.google.com/feeds",
    "https://www.googleapis.com/auth/drive"
]
GOOGLE_CREDENTIALS = loads(
    SSM_CLIENT.get_parameters(Names=[
        PARAM_NAME,
    ], WithDecryption=True)['Parameters'][0]['Value'])


def series_to_supervised(data, n_in=1, n_out=1, drop_nan=True):
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
        :param drop_nan:
    """
    n_vars = 1 if type(data) is list else data.shape[1]
    df = DataFrame(data)
    cols, names = list(), list()
    # input sequence (t-n, ... t-1)
    for i in range(n_in, 0, -1):
        cols.append(df.shift(i))
        names += [('var%d(t-%d)' % (j + 1, i)) for j in range(n_vars)]
    # forecast sequence (t, t+1, ... t+n)
    for i in range(0, n_out):
        cols.append(df.shift(-i))
        if i == 0:
            names += [('var%d(t)' % (j + 1)) for j in range(n_vars)]
        else:
            names += [('var%d(t+%d)' % (j + 1, i)) for j in range(n_vars)]
    # put it all together
    agg = concat(cols, axis=1)
    agg.columns = names
    # drop rows with NaN values
    if drop_nan:
        agg.dropna(inplace=True)
    return agg


# noinspection PyBroadException
def concatenate_google_spreadsheets(google_cloud_spreadsheets):
    index = 0
    flag = True
    while flag:
        try:
            if index:
                worksheet = google_cloud_spreadsheets.open(
                    f"IFTTT_Maker_Webhooks_Events ({index})").sheet1
            else:
                worksheet = google_cloud_spreadsheets.open(
                    "IFTTT_Maker_Webhooks_Events").sheet1
        except Exception:
            flag = False
        else:
            data = DataFrame(worksheet.get_all_values())
            global concatenated_data_frame
            concatenated_data_frame = concat([concatenated_data_frame, data])
            index = index + 1


def clean_data():
    blood_glucose_dataset = concatenated_data_frame.copy()
    blood_glucose_dataset.drop(columns=[1, 3, 4, 5, 6], axis=1, inplace=True)
    blood_glucose_dataset.columns = ["DATETIME", "BLOOD_GLUCOSE"]
    blood_glucose_dataset["BLOOD_GLUCOSE"] = blood_glucose_dataset[
        "BLOOD_GLUCOSE"].replace(["LOW"], 2.2)
    blood_glucose_dataset["BLOOD_GLUCOSE"] = blood_glucose_dataset[
        "BLOOD_GLUCOSE"].replace(["HIGH"], 20)
    blood_glucose_dataset[
        "BLOOD_GLUCOSE"] = blood_glucose_dataset.BLOOD_GLUCOSE.astype(
            "float64")
    blood_glucose_dataset["DATETIME"] = blood_glucose_dataset[
        "DATETIME"].str.replace('at', '')
    blood_glucose_dataset["DATETIME"] = to_datetime(
        blood_glucose_dataset["DATETIME"], infer_datetime_format=True)
    blood_glucose_dataset.replace(r'', NaN, inplace=True)
    blood_glucose_dataset.fillna(0, inplace=True)
    blood_glucose_time_series = down_sample(dataset=blood_glucose_dataset,
                                            column="BLOOD_GLUCOSE",
                                            index="DATETIME")
    return blood_glucose_time_series


def down_sample(dataset, index, column, period="30min"):
    dataset.set_index(index, inplace=True)
    time_series = dataset[column].resample(period).mean()
    return time_series


def predict(model_name, x, return_dict):
    model = load(model_name)
    return_dict[model_name] = model.predict(x)


@with_lambda_profiler(profiling_group_name=CODE_GURU_PROFILING_GROUP)
def handler(_, __):

    credentials = ServiceAccountCredentials.from_json_keyfile_dict(
        GOOGLE_CREDENTIALS)
    google_cloud_spreadsheets = authorize(credentials)
    concatenate_google_spreadsheets(google_cloud_spreadsheets)
    data = clean_data().reset_index()
    data = array(data.BLOOD_GLUCOSE)
    cleaned_dataset = series_to_supervised(data.tolist(), n_out=3)
    x_t_minus_1 = cleaned_dataset[["var1(t-1)"]].tail(1)
    x = cleaned_dataset.drop(["var1(t-1)"], axis=1)
    random_forest_pipeline = load('models/rf')
    linear_regression_pipeline = load('models/linear')
    last_x = x.tail(1)
    rcf_pred = random_forest_pipeline.predict(last_x)[0]
    lr_pred = linear_regression_pipeline.predict(last_x)[0][0]
    trend = (x_t_minus_1["var1(t-1)"].values[0] -
             last_x["var1(t+2)"].values[0])
    current_blood_glucose = last_x["var1(t+2)"].values[0]
    average = (rcf_pred + lr_pred) / 2
    if trend < 0:
        trend_words = "increasing"
    elif trend > 0:
        trend_words = "decreasing"
    else:
        trend_words = "continuing"

    return {
        "current": current_blood_glucose,
        "linear_prediction": lr_pred,
        "random_cut_forest_prediction": rcf_pred,
        "trend": trend_words,
        "average_prediction": average
    }
