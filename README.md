# Welcome to MLOpsPipeline project with CDK for TypeScript!

### 0. Prerequisite, the google service account should be created, the token saved in SSM parameter store as /google/admin/credentials
### 1. The infrastructure consist of pipeline which tests the infrastructure code and deploys a lambda function. The pipeline will mutate itself on each commit.
### 2. Freestyle libre sensor writes the data to google spreadsheet.
### 3. The lambda function is in Python 3.8. The function connects to google spreadsheet using service account, reads the latest values and predicts the coming blood glucose value using random cut forest and linear learning model.
### 4. A Code Guru profiling group checks the lambda code for possible performance issues


# ML Ops pipeline for predicting blood glucose from google spreadsheet
ML solution to predict blood glucose based on AWS Lambda
![Diagram of Architecture](./diagram.png)

The `cdk.json` file tells the CDK Toolkit how to execute MLOpsPipeline

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
