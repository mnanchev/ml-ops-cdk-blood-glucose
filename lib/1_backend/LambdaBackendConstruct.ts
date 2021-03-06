import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { CfnOutput, Duration, StackProps } from "aws-cdk-lib";
import { Code, Handler, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import {
  ComputePlatform,
  ProfilingGroup,
} from "aws-cdk-lib/aws-codeguruprofiler";
import {
  EmailSubscription,
  SmsSubscription,
} from "aws-cdk-lib/aws-sns-subscriptions";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { Topic } from "aws-cdk-lib/aws-sns";
import { Construct } from "constructs";

export interface BackendConfigDecorator extends StackProps {
  readonly codeLocation: string;
  readonly solution: string;
  readonly memorySize: number | undefined;
  readonly parameterStoreCredentialsGoogle: string;
  readonly timeout: number;
  readonly environment: string;
  readonly predictingLambdaExportName: string;
  readonly mobileNumbers: Array<string>;
  readonly emails: Array<string>;
}

export class LambdaBackendConstruct extends Construct {
  constructor(scope: Construct, id: string, props: BackendConfigDecorator) {
    super(scope, id);
    // =========================================
    //
    //  DynamoDb Table
    //
    // =========================================
    const table = new Table(this, `${props.solution}-blood-glucose`, {
      tableName: props.predictingLambdaExportName,
      partitionKey: { name: "dateTime", type: AttributeType.STRING },
      sortKey: { name: "bloodGlucose", type: AttributeType.NUMBER },
    });
    // =========================================
    //
    //  Code Guru Profiling group
    //
    // =========================================
    const profilingGroup = new ProfilingGroup(
      this,
      `${props.solution}-profiling-group`,
      {
        computePlatform: ComputePlatform.AWS_LAMBDA,
      }
    );
    // =========================================
    //
    //  SNS topic creation and subscription
    //
    // =========================================
    const topic = new Topic(this, `${props.solution}-sns-topic`, {
      displayName: "BLOOD_GLUCOSE_CRIT",
    });
    props.mobileNumbers.forEach(function (number) {
      topic.addSubscription(new SmsSubscription(number));
    });
    props.emails.forEach(function (email: string) {
      topic.addSubscription(new EmailSubscription(email));
    });
    // =========================================
    //
    //  Lambda function creation
    //
    // =========================================
    const parameterStoreCredentialsGoogle =
      props.parameterStoreCredentialsGoogle.toString();
    const predictingLambda = new Function(this, `${props.solution}`, {
      code: Code.fromAssetImage(props.codeLocation),
      runtime: Runtime.FROM_IMAGE,
      handler: Handler.FROM_IMAGE,
      memorySize: props.memorySize,
      environment: {
        CREDENTIALS: parameterStoreCredentialsGoogle,
        SNS: `${topic.topicArn}`,
        CODE_GURU_PROFILING_GROUP: profilingGroup.profilingGroupName,
        DYNAMO_DB: table.tableName,
      },
      timeout: Duration.seconds(props.timeout),
    });
    table.grantWriteData(predictingLambda);
    // =========================================
    //
    //  Permissions to read from System Manager Parameter store
    //
    // =========================================
    const predictingLambdaSystemManagerGetParameterPolicyStatement =
      new PolicyStatement({
        actions: ["ssm:GetParameter*"],
        resources: [
          `arn:aws:ssm:${process.env.CDK_DEFAULT_REGION}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter${parameterStoreCredentialsGoogle}`,
        ],
      });
    predictingLambda.role?.attachInlinePolicy(
      new Policy(this, `${props.solution}-get-ssm-environment-variable`, {
        statements: [predictingLambdaSystemManagerGetParameterPolicyStatement],
      })
    );
    // =========================================
    //
    //  Permissions to push notification
    //
    // =========================================
    const predictingLambdaSNSPublishPolicyStatement = new PolicyStatement({
      actions: ["sns:Publish"],
      resources: [`${topic.topicArn}`],
    });
    predictingLambda.role?.attachInlinePolicy(
      new Policy(this, `${props.solution}-publish-to-sns`, {
        statements: [predictingLambdaSNSPublishPolicyStatement],
      })
    );
    // =========================================
    //
    //  Permissions to talk to code guru agent
    //
    // =========================================
    profilingGroup.grantPublish(predictingLambda);
    // =========================================
    //
    //  Outputs, topic arn and function arn
    //
    // =========================================
    const lambdaArn = new CfnOutput(this, `${props.solution}-arn`, {
      value: predictingLambda.functionArn,
      exportName: props.predictingLambdaExportName,
    });
    lambdaArn.overrideLogicalId(props.predictingLambdaExportName);
    new CfnOutput(this, `${props.solution}-topic-arn`, {
      value: topic.topicArn,
    });
    const rule = new Rule(this, "Rule", {
      schedule: Schedule.expression("rate(5 minutes)"),
    });
    rule.addTarget(new LambdaFunction(predictingLambda));
  }
}
