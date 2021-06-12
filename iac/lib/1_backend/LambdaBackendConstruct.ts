import { CfnOutput, Construct, Duration, StackProps } from "@aws-cdk/core";
import { Code, Function, Handler, Runtime } from "@aws-cdk/aws-lambda";
import { ManagedPolicy, Policy, PolicyStatement } from "@aws-cdk/aws-iam";
import { Topic } from "@aws-cdk/aws-sns";
import { ComputePlatform, ProfilingGroup } from "@aws-cdk/aws-codeguruprofiler";
import { SmsSubscription } from "@aws-cdk/aws-sns-subscriptions";
export interface BackendConfigDecorator extends StackProps {
  readonly codeLocation: string;
  readonly solution: string;
  readonly memorySize: number | undefined;
  readonly parameterStoreCredentialsGoogle: string;
  readonly timeout: number;
  readonly environment: string;
  readonly profilingGroupsPermissions: string;
  readonly predictingLambdaExportName: string;
  readonly mobileNumber: string;
}

export class LambdaBackendConstruct extends Construct {
  constructor(scope: Construct, id: string, props: BackendConfigDecorator) {
    super(scope, id);
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
    topic.addSubscription(new SmsSubscription(props.mobileNumber));
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
      },
      timeout: Duration.seconds(props.timeout),
    });
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
    predictingLambda.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(props.profilingGroupsPermissions)
    );
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
  }
}
