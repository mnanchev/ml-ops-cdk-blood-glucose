import {
  expect as expectCDK,
  haveResource,
  haveResourceLike,
} from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as Iac from "../lib/backend-stack";
import { StrictBuilder } from "builder-pattern";
import { BackendConfigDecorator } from "../lib/1_backend/LambdaBackendConstruct";
import { Backend, emails, mobileNumbers } from "../lib/StackConfigs";

const backendStackConfig = StrictBuilder<BackendConfigDecorator>()
  .solution(Backend.solution)
  .parameterStoreCredentialsGoogle(Backend.parameterStoreCredentialsGoogle)
  .timeout(Backend.timeout)
  .codeLocation(Backend.codeLocation)
  .memorySize(Backend.memory)
  .environment(Backend.environment)
  .predictingLambdaExportName(Backend.predictingLambdaExportName)
  .mobileNumbers(mobileNumbers)
  .emails(emails)
  .build();

test("λ has environment variables", () => {
  const stack = new Iac.BackendStack(
    new cdk.App(),
    "MyTestStack",
    backendStackConfig
  );
  expectCDK(stack).to(
    haveResource("AWS::Lambda::Function", {
      Environment: {
        Variables: {
          CREDENTIALS: "/google/admin/credentials",
          CODE_GURU_PROFILING_GROUP: {
            Ref: "MyTestStackbackendpredictinglambdaprofilinggroupProfilingGroupBD913E17",
          },
          SNS: { Ref: "MyTestStackbackendpredictinglambdasnstopic52F11C32" },
          DYNAMO_DB: {
            Ref: "MyTestStackbackendpredictinglambdabloodglucoseE08A7884",
          },
        },
      },
    })
  );
});

test("λ has permission to post code guru profile", () => {
  const stack = new Iac.BackendStack(
    new cdk.App(),
    "MyTestCodeGuruStack",
    backendStackConfig
  );
  expectCDK(stack).to(
    haveResourceLike("AWS::IAM::Policy", {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              "dynamodb:BatchWriteItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem",
              "dynamodb:DeleteItem",
            ],
            Effect: "Allow",
            Resource: [
              {
                "Fn::GetAtt": [
                  "MyTestCodeGuruStackbackendpredictinglambdabloodglucoseF148083A",
                  "Arn",
                ],
              },
              {
                Ref: "AWS::NoValue",
              },
            ],
          },
          {
            Action: [
              "codeguru-profiler:ConfigureAgent",
              "codeguru-profiler:PostAgentProfile",
            ],
            Effect: "Allow",
            Resource: {
              "Fn::GetAtt": [
                "MyTestCodeGuruStackbackendpredictinglambdaprofilinggroupProfilingGroupBE5BDDF2",
                "Arn",
              ],
            },
          },
        ],
        Version: "2012-10-17",
      },
    })
  );
});

test("λ has permission to publish to sns ", () => {
  const stack = new Iac.BackendStack(
    new cdk.App(),
    "MyTestStack",
    backendStackConfig
  );
  expectCDK(stack).to(
    haveResourceLike("AWS::IAM::Policy", {
      PolicyDocument: {
        Statement: [
          {
            Action: "sns:Publish",
            Effect: "Allow",
            Resource: {
              Ref: "MyTestStackbackendpredictinglambdasnstopic52F11C32",
            },
          },
        ],
        Version: "2012-10-17",
      },
    })
  );
});

test("λ has permission to read ssm parameter ", () => {
  const stack = new Iac.BackendStack(
    new cdk.App(),
    "TestSSM",
    backendStackConfig
  );
  expectCDK(stack).to(
    haveResourceLike("AWS::IAM::Policy", {
      PolicyDocument: {
        Statement: [
          {
            Action: "ssm:GetParameter*",
            Effect: "Allow",
            Resource:
              "arn:aws:ssm:undefined:undefined:parameter/google/admin/credentials",
          },
        ],
        Version: "2012-10-17",
      },
    })
  );
});

test("λ has permission to write to dynamoDB ", () => {
  const stack = new Iac.BackendStack(
    new cdk.App(),
    "MyTestDynamoDBStack",
    backendStackConfig
  );
  expectCDK(stack).to(
    haveResourceLike("AWS::IAM::Policy", {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              "dynamodb:BatchWriteItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem",
              "dynamodb:DeleteItem",
            ],
            Effect: "Allow",
            Resource: [
              {
                "Fn::GetAtt": [
                  "MyTestDynamoDBStackbackendpredictinglambdabloodglucose11E3B269",
                  "Arn",
                ],
              },
              {
                Ref: "AWS::NoValue",
              },
            ],
          },
          {
            Action: [
              "codeguru-profiler:ConfigureAgent",
              "codeguru-profiler:PostAgentProfile",
            ],
            Effect: "Allow",
            Resource: {
              "Fn::GetAtt": [
                "MyTestDynamoDBStackbackendpredictinglambdaprofilinggroupProfilingGroup79C080E4",
                "Arn",
              ],
            },
          },
        ],
      },
    })
  );
});

test("Stack has cloudwatch event rule", () => {
  const stack = new Iac.BackendStack(
    new cdk.App(),
    "TestEvents",
    backendStackConfig
  );
  expectCDK(stack).to(haveResource("AWS::Events::Rule"));
});
