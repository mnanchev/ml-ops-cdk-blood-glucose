import {
  expect as expectCDK,
  haveResource,
  haveResourceLike,
} from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as Iac from "../lib/backend-stack";
import { StrictBuilder } from "builder-pattern";
import { BackendConfigDecorator } from "../lib/1_backend/LambdaBackendConstruct";
import { Backend, mobileNumbers } from "../lib/StackConfigs";

test("λ has environment variables", () => {
  const app = new cdk.App();
  const backendStackConfig = StrictBuilder<BackendConfigDecorator>()
    .solution(Backend.solution)
    .parameterStoreCredentialsGoogle(Backend.parameterStoreCredentialsGoogle)
    .timeout(Backend.timeout)
    .codeLocation(Backend.codeLocation)
    .memorySize(Backend.memory)
    .environment(Backend.environment)
    .profilingGroupsPermissions(Backend.profilingGroupPermissions)
    .predictingLambdaExportName(Backend.predictingLambdaExportName)
    .mobileNumbers(mobileNumbers)
    .build();
  // WHEN
  const stack = new Iac.BackendStack(app, "MyTestStack", backendStackConfig);
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::Lambda::Function", {
      Environment: {
        Variables: {
          CREDENTIALS: "/google/admin/credentials",
          CODE_GURU_PROFILING_GROUP: {
            Ref: "MyTestStackbackendpredictinglambdaprofilinggroupProfilingGroupBD913E17",
          },

          SNS: { Ref: "MyTestStackbackendpredictinglambdasnstopic52F11C32" },
        },
      },
    })
  );
});

test("λ has permission to post code guru profile", () => {
  const app = new cdk.App();
  const backendStackConfig = StrictBuilder<BackendConfigDecorator>()
    .solution(Backend.solution)
    .parameterStoreCredentialsGoogle(Backend.parameterStoreCredentialsGoogle)
    .timeout(Backend.timeout)
    .codeLocation(Backend.codeLocation)
    .memorySize(Backend.memory)
    .environment(Backend.environment)
    .profilingGroupsPermissions(Backend.profilingGroupPermissions)
    .predictingLambdaExportName(Backend.predictingLambdaExportName)
    .mobileNumbers(mobileNumbers)
    .build();
  // WHEN
  const stack = new Iac.BackendStack(app, "MyTestStack", backendStackConfig);
  expectCDK(stack).to(
    haveResourceLike("AWS::IAM::Policy", {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              "codeguru-profiler:ConfigureAgent",
              "codeguru-profiler:PostAgentProfile",
            ],
            Effect: "Allow",
            Resource: {
              "Fn::GetAtt": [
                "MyTestStackbackendpredictinglambdaprofilinggroupProfilingGroupBD913E17",
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
  const app = new cdk.App();
  const backendStackConfig = StrictBuilder<BackendConfigDecorator>()
    .solution(Backend.solution)
    .parameterStoreCredentialsGoogle(Backend.parameterStoreCredentialsGoogle)
    .timeout(Backend.timeout)
    .codeLocation(Backend.codeLocation)
    .memorySize(Backend.memory)
    .environment(Backend.environment)
    .profilingGroupsPermissions(Backend.profilingGroupPermissions)
    .predictingLambdaExportName(Backend.predictingLambdaExportName)
    .mobileNumbers(mobileNumbers)
    .build();
  // WHEN
  const stack = new Iac.BackendStack(app, "MyTestStack", backendStackConfig);
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
  const app = new cdk.App();
  const backendStackConfig = StrictBuilder<BackendConfigDecorator>()
    .solution(Backend.solution)
    .parameterStoreCredentialsGoogle(Backend.parameterStoreCredentialsGoogle)
    .timeout(Backend.timeout)
    .codeLocation(Backend.codeLocation)
    .memorySize(Backend.memory)
    .environment(Backend.environment)
    .profilingGroupsPermissions(Backend.profilingGroupPermissions)
    .predictingLambdaExportName(Backend.predictingLambdaExportName)
    .mobileNumbers(mobileNumbers)
    .build();
  // WHEN
  const stack = new Iac.BackendStack(app, "MyTestStack", backendStackConfig);
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

test("Stack has cloudwatch event rule", () => {
  const app = new cdk.App();
  const backendStackConfig = StrictBuilder<BackendConfigDecorator>()
    .solution(Backend.solution)
    .parameterStoreCredentialsGoogle(Backend.parameterStoreCredentialsGoogle)
    .timeout(Backend.timeout)
    .codeLocation(Backend.codeLocation)
    .memorySize(Backend.memory)
    .environment(Backend.environment)
    .profilingGroupsPermissions(Backend.profilingGroupPermissions)
    .predictingLambdaExportName(Backend.predictingLambdaExportName)
    .mobileNumbers(mobileNumbers)
    .build();
  // WHEN
  const stack = new Iac.BackendStack(app, "MyTestStack", backendStackConfig);
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::Events::Rule")
  );
});