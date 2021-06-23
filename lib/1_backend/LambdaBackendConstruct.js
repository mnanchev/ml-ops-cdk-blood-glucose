"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaBackendConstruct = void 0;
const core_1 = require("@aws-cdk/core");
const aws_lambda_1 = require("@aws-cdk/aws-lambda");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const aws_sns_1 = require("@aws-cdk/aws-sns");
const aws_codeguruprofiler_1 = require("@aws-cdk/aws-codeguruprofiler");
const aws_sns_subscriptions_1 = require("@aws-cdk/aws-sns-subscriptions");
const aws_events_1 = require("@aws-cdk/aws-events");
const aws_events_targets_1 = require("@aws-cdk/aws-events-targets");
class LambdaBackendConstruct extends core_1.Construct {
    constructor(scope, id, props) {
        var _a, _b, _c;
        super(scope, id);
        // =========================================
        //
        //  Code Guru Profiling group
        //
        // =========================================
        const profilingGroup = new aws_codeguruprofiler_1.ProfilingGroup(this, `${props.solution}-profiling-group`, {
            computePlatform: aws_codeguruprofiler_1.ComputePlatform.AWS_LAMBDA,
        });
        // =========================================
        //
        //  SNS topic creation and subscription
        //
        // =========================================
        const topic = new aws_sns_1.Topic(this, `${props.solution}-sns-topic`, {
            displayName: "BLOOD_GLUCOSE_CRIT",
        });
        props.mobileNumbers.forEach(function (number) {
            topic.addSubscription(new aws_sns_subscriptions_1.SmsSubscription(number));
        });
        // =========================================
        //
        //  Lambda function creation
        //
        // =========================================
        const parameterStoreCredentialsGoogle = props.parameterStoreCredentialsGoogle.toString();
        const predictingLambda = new aws_lambda_1.Function(this, `${props.solution}`, {
            code: aws_lambda_1.Code.fromAssetImage(props.codeLocation),
            runtime: aws_lambda_1.Runtime.FROM_IMAGE,
            handler: aws_lambda_1.Handler.FROM_IMAGE,
            memorySize: props.memorySize,
            environment: {
                CREDENTIALS: parameterStoreCredentialsGoogle,
                SNS: `${topic.topicArn}`,
                CODE_GURU_PROFILING_GROUP: profilingGroup.profilingGroupName,
            },
            timeout: core_1.Duration.seconds(props.timeout),
        });
        // =========================================
        //
        //  Permissions to read from System Manager Parameter store
        //
        // =========================================
        const predictingLambdaSystemManagerGetParameterPolicyStatement = new aws_iam_1.PolicyStatement({
            actions: ["ssm:GetParameter*"],
            resources: [
                `arn:aws:ssm:${process.env.CDK_DEFAULT_REGION}:${process.env.CDK_DEFAULT_ACCOUNT}:parameter${parameterStoreCredentialsGoogle}`,
            ],
        });
        (_a = predictingLambda.role) === null || _a === void 0 ? void 0 : _a.attachInlinePolicy(new aws_iam_1.Policy(this, `${props.solution}-get-ssm-environment-variable`, {
            statements: [predictingLambdaSystemManagerGetParameterPolicyStatement],
        }));
        // =========================================
        //
        //  Permissions to push notification
        //
        // =========================================
        const predictingLambdaSNSPublishPolicyStatement = new aws_iam_1.PolicyStatement({
            actions: ["sns:Publish"],
            resources: [`${topic.topicArn}`],
        });
        (_b = predictingLambda.role) === null || _b === void 0 ? void 0 : _b.attachInlinePolicy(new aws_iam_1.Policy(this, `${props.solution}-publish-to-sns`, {
            statements: [predictingLambdaSNSPublishPolicyStatement],
        }));
        // =========================================
        //
        //  Permissions to talk to code guru agent
        //
        // =========================================
        (_c = predictingLambda.role) === null || _c === void 0 ? void 0 : _c.addManagedPolicy(aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName(props.profilingGroupsPermissions));
        profilingGroup.grantPublish(predictingLambda);
        // =========================================
        //
        //  Outputs, topic arn and function arn
        //
        // =========================================
        const lambdaArn = new core_1.CfnOutput(this, `${props.solution}-arn`, {
            value: predictingLambda.functionArn,
            exportName: props.predictingLambdaExportName,
        });
        lambdaArn.overrideLogicalId(props.predictingLambdaExportName);
        new core_1.CfnOutput(this, `${props.solution}-topic-arn`, {
            value: topic.topicArn,
        });
        const rule = new aws_events_1.Rule(this, "Rule", {
            schedule: aws_events_1.Schedule.expression("rate(5 minutes)"),
        });
        rule.addTarget(new aws_events_targets_1.LambdaFunction(predictingLambda));
    }
}
exports.LambdaBackendConstruct = LambdaBackendConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFtYmRhQmFja2VuZENvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkxhbWJkYUJhY2tlbmRDb25zdHJ1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsd0NBQTJFO0FBQzNFLG9EQUF1RTtBQUN2RSw4Q0FBMEU7QUFDMUUsOENBQXlDO0FBQ3pDLHdFQUFnRjtBQUNoRiwwRUFBaUU7QUFDakUsb0RBQXFEO0FBQ3JELG9FQUE2RDtBQWM3RCxNQUFhLHNCQUF1QixTQUFRLGdCQUFTO0lBQ25ELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBNkI7O1FBQ3JFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDakIsNENBQTRDO1FBQzVDLEVBQUU7UUFDRiw2QkFBNkI7UUFDN0IsRUFBRTtRQUNGLDRDQUE0QztRQUM1QyxNQUFNLGNBQWMsR0FBRyxJQUFJLHFDQUFjLENBQ3ZDLElBQUksRUFDSixHQUFHLEtBQUssQ0FBQyxRQUFRLGtCQUFrQixFQUNuQztZQUNFLGVBQWUsRUFBRSxzQ0FBZSxDQUFDLFVBQVU7U0FDNUMsQ0FDRixDQUFDO1FBQ0YsNENBQTRDO1FBQzVDLEVBQUU7UUFDRix1Q0FBdUM7UUFDdkMsRUFBRTtRQUNGLDRDQUE0QztRQUM1QyxNQUFNLEtBQUssR0FBRyxJQUFJLGVBQUssQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsUUFBUSxZQUFZLEVBQUU7WUFDM0QsV0FBVyxFQUFFLG9CQUFvQjtTQUNsQyxDQUFDLENBQUM7UUFDSCxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFVLE1BQU07WUFDMUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLHVDQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNyRCxDQUFDLENBQUMsQ0FBQztRQUVILDRDQUE0QztRQUM1QyxFQUFFO1FBQ0YsNEJBQTRCO1FBQzVCLEVBQUU7UUFDRiw0Q0FBNEM7UUFDNUMsTUFBTSwrQkFBK0IsR0FDbkMsS0FBSyxDQUFDLCtCQUErQixDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ25ELE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxxQkFBUSxDQUFDLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUMvRCxJQUFJLEVBQUUsaUJBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQztZQUM3QyxPQUFPLEVBQUUsb0JBQU8sQ0FBQyxVQUFVO1lBQzNCLE9BQU8sRUFBRSxvQkFBTyxDQUFDLFVBQVU7WUFDM0IsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO1lBQzVCLFdBQVcsRUFBRTtnQkFDWCxXQUFXLEVBQUUsK0JBQStCO2dCQUM1QyxHQUFHLEVBQUUsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFO2dCQUN4Qix5QkFBeUIsRUFBRSxjQUFjLENBQUMsa0JBQWtCO2FBQzdEO1lBQ0QsT0FBTyxFQUFFLGVBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztTQUN6QyxDQUFDLENBQUM7UUFDSCw0Q0FBNEM7UUFDNUMsRUFBRTtRQUNGLDJEQUEyRDtRQUMzRCxFQUFFO1FBQ0YsNENBQTRDO1FBQzVDLE1BQU0sd0RBQXdELEdBQzVELElBQUkseUJBQWUsQ0FBQztZQUNsQixPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztZQUM5QixTQUFTLEVBQUU7Z0JBQ1QsZUFBZSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLGFBQWEsK0JBQStCLEVBQUU7YUFDL0g7U0FDRixDQUFDLENBQUM7UUFDTCxNQUFBLGdCQUFnQixDQUFDLElBQUksMENBQUUsa0JBQWtCLENBQ3ZDLElBQUksZ0JBQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsUUFBUSwrQkFBK0IsRUFBRTtZQUNqRSxVQUFVLEVBQUUsQ0FBQyx3REFBd0QsQ0FBQztTQUN2RSxDQUFDLENBQ0gsQ0FBQztRQUNGLDRDQUE0QztRQUM1QyxFQUFFO1FBQ0Ysb0NBQW9DO1FBQ3BDLEVBQUU7UUFDRiw0Q0FBNEM7UUFDNUMsTUFBTSx5Q0FBeUMsR0FBRyxJQUFJLHlCQUFlLENBQUM7WUFDcEUsT0FBTyxFQUFFLENBQUMsYUFBYSxDQUFDO1lBQ3hCLFNBQVMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2pDLENBQUMsQ0FBQztRQUNILE1BQUEsZ0JBQWdCLENBQUMsSUFBSSwwQ0FBRSxrQkFBa0IsQ0FDdkMsSUFBSSxnQkFBTSxDQUFDLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxRQUFRLGlCQUFpQixFQUFFO1lBQ25ELFVBQVUsRUFBRSxDQUFDLHlDQUF5QyxDQUFDO1NBQ3hELENBQUMsQ0FDSCxDQUFDO1FBQ0YsNENBQTRDO1FBQzVDLEVBQUU7UUFDRiwwQ0FBMEM7UUFDMUMsRUFBRTtRQUNGLDRDQUE0QztRQUM1QyxNQUFBLGdCQUFnQixDQUFDLElBQUksMENBQUUsZ0JBQWdCLENBQ3JDLHVCQUFhLENBQUMsd0JBQXdCLENBQUMsS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQ3pFLENBQUM7UUFDRixjQUFjLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDOUMsNENBQTRDO1FBQzVDLEVBQUU7UUFDRix1Q0FBdUM7UUFDdkMsRUFBRTtRQUNGLDRDQUE0QztRQUM1QyxNQUFNLFNBQVMsR0FBRyxJQUFJLGdCQUFTLENBQUMsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLFFBQVEsTUFBTSxFQUFFO1lBQzdELEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxXQUFXO1lBQ25DLFVBQVUsRUFBRSxLQUFLLENBQUMsMEJBQTBCO1NBQzdDLENBQUMsQ0FBQztRQUNILFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztRQUM5RCxJQUFJLGdCQUFTLENBQUMsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLFFBQVEsWUFBWSxFQUFFO1lBQ2pELEtBQUssRUFBRSxLQUFLLENBQUMsUUFBUTtTQUN0QixDQUFDLENBQUM7UUFDSCxNQUFNLElBQUksR0FBRyxJQUFJLGlCQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtZQUNsQyxRQUFRLEVBQUUscUJBQVEsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUM7U0FDakQsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLG1DQUFjLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7Q0FDRjtBQXhHRCx3REF3R0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDZm5PdXRwdXQsIENvbnN0cnVjdCwgRHVyYXRpb24sIFN0YWNrUHJvcHMgfSBmcm9tIFwiQGF3cy1jZGsvY29yZVwiO1xuaW1wb3J0IHsgQ29kZSwgRnVuY3Rpb24sIEhhbmRsZXIsIFJ1bnRpbWUgfSBmcm9tIFwiQGF3cy1jZGsvYXdzLWxhbWJkYVwiO1xuaW1wb3J0IHsgTWFuYWdlZFBvbGljeSwgUG9saWN5LCBQb2xpY3lTdGF0ZW1lbnQgfSBmcm9tIFwiQGF3cy1jZGsvYXdzLWlhbVwiO1xuaW1wb3J0IHsgVG9waWMgfSBmcm9tIFwiQGF3cy1jZGsvYXdzLXNuc1wiO1xuaW1wb3J0IHsgQ29tcHV0ZVBsYXRmb3JtLCBQcm9maWxpbmdHcm91cCB9IGZyb20gXCJAYXdzLWNkay9hd3MtY29kZWd1cnVwcm9maWxlclwiO1xuaW1wb3J0IHsgU21zU3Vic2NyaXB0aW9uIH0gZnJvbSBcIkBhd3MtY2RrL2F3cy1zbnMtc3Vic2NyaXB0aW9uc1wiO1xuaW1wb3J0IHsgUnVsZSwgU2NoZWR1bGUgfSBmcm9tIFwiQGF3cy1jZGsvYXdzLWV2ZW50c1wiO1xuaW1wb3J0IHsgTGFtYmRhRnVuY3Rpb24gfSBmcm9tIFwiQGF3cy1jZGsvYXdzLWV2ZW50cy10YXJnZXRzXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmFja2VuZENvbmZpZ0RlY29yYXRvciBleHRlbmRzIFN0YWNrUHJvcHMge1xuICByZWFkb25seSBjb2RlTG9jYXRpb246IHN0cmluZztcbiAgcmVhZG9ubHkgc29sdXRpb246IHN0cmluZztcbiAgcmVhZG9ubHkgbWVtb3J5U2l6ZTogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICByZWFkb25seSBwYXJhbWV0ZXJTdG9yZUNyZWRlbnRpYWxzR29vZ2xlOiBzdHJpbmc7XG4gIHJlYWRvbmx5IHRpbWVvdXQ6IG51bWJlcjtcbiAgcmVhZG9ubHkgZW52aXJvbm1lbnQ6IHN0cmluZztcbiAgcmVhZG9ubHkgcHJvZmlsaW5nR3JvdXBzUGVybWlzc2lvbnM6IHN0cmluZztcbiAgcmVhZG9ubHkgcHJlZGljdGluZ0xhbWJkYUV4cG9ydE5hbWU6IHN0cmluZztcbiAgcmVhZG9ubHkgbW9iaWxlTnVtYmVyczogQXJyYXk8c3RyaW5nPjtcbn1cblxuZXhwb3J0IGNsYXNzIExhbWJkYUJhY2tlbmRDb25zdHJ1Y3QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQmFja2VuZENvbmZpZ0RlY29yYXRvcikge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvL1xuICAgIC8vICBDb2RlIEd1cnUgUHJvZmlsaW5nIGdyb3VwXG4gICAgLy9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNvbnN0IHByb2ZpbGluZ0dyb3VwID0gbmV3IFByb2ZpbGluZ0dyb3VwKFxuICAgICAgdGhpcyxcbiAgICAgIGAke3Byb3BzLnNvbHV0aW9ufS1wcm9maWxpbmctZ3JvdXBgLFxuICAgICAge1xuICAgICAgICBjb21wdXRlUGxhdGZvcm06IENvbXB1dGVQbGF0Zm9ybS5BV1NfTEFNQkRBLFxuICAgICAgfVxuICAgICk7XG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvL1xuICAgIC8vICBTTlMgdG9waWMgY3JlYXRpb24gYW5kIHN1YnNjcmlwdGlvblxuICAgIC8vXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjb25zdCB0b3BpYyA9IG5ldyBUb3BpYyh0aGlzLCBgJHtwcm9wcy5zb2x1dGlvbn0tc25zLXRvcGljYCwge1xuICAgICAgZGlzcGxheU5hbWU6IFwiQkxPT0RfR0xVQ09TRV9DUklUXCIsXG4gICAgfSk7XG4gICAgcHJvcHMubW9iaWxlTnVtYmVycy5mb3JFYWNoKGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgICAgIHRvcGljLmFkZFN1YnNjcmlwdGlvbihuZXcgU21zU3Vic2NyaXB0aW9uKG51bWJlcikpO1xuICAgIH0pO1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvL1xuICAgIC8vICBMYW1iZGEgZnVuY3Rpb24gY3JlYXRpb25cbiAgICAvL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY29uc3QgcGFyYW1ldGVyU3RvcmVDcmVkZW50aWFsc0dvb2dsZSA9XG4gICAgICBwcm9wcy5wYXJhbWV0ZXJTdG9yZUNyZWRlbnRpYWxzR29vZ2xlLnRvU3RyaW5nKCk7XG4gICAgY29uc3QgcHJlZGljdGluZ0xhbWJkYSA9IG5ldyBGdW5jdGlvbih0aGlzLCBgJHtwcm9wcy5zb2x1dGlvbn1gLCB7XG4gICAgICBjb2RlOiBDb2RlLmZyb21Bc3NldEltYWdlKHByb3BzLmNvZGVMb2NhdGlvbiksXG4gICAgICBydW50aW1lOiBSdW50aW1lLkZST01fSU1BR0UsXG4gICAgICBoYW5kbGVyOiBIYW5kbGVyLkZST01fSU1BR0UsXG4gICAgICBtZW1vcnlTaXplOiBwcm9wcy5tZW1vcnlTaXplLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgQ1JFREVOVElBTFM6IHBhcmFtZXRlclN0b3JlQ3JlZGVudGlhbHNHb29nbGUsXG4gICAgICAgIFNOUzogYCR7dG9waWMudG9waWNBcm59YCxcbiAgICAgICAgQ09ERV9HVVJVX1BST0ZJTElOR19HUk9VUDogcHJvZmlsaW5nR3JvdXAucHJvZmlsaW5nR3JvdXBOYW1lLFxuICAgICAgfSxcbiAgICAgIHRpbWVvdXQ6IER1cmF0aW9uLnNlY29uZHMocHJvcHMudGltZW91dCksXG4gICAgfSk7XG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvL1xuICAgIC8vICBQZXJtaXNzaW9ucyB0byByZWFkIGZyb20gU3lzdGVtIE1hbmFnZXIgUGFyYW1ldGVyIHN0b3JlXG4gICAgLy9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNvbnN0IHByZWRpY3RpbmdMYW1iZGFTeXN0ZW1NYW5hZ2VyR2V0UGFyYW1ldGVyUG9saWN5U3RhdGVtZW50ID1cbiAgICAgIG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBhY3Rpb25zOiBbXCJzc206R2V0UGFyYW1ldGVyKlwiXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbXG4gICAgICAgICAgYGFybjphd3M6c3NtOiR7cHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfUkVHSU9OfToke3Byb2Nlc3MuZW52LkNES19ERUZBVUxUX0FDQ09VTlR9OnBhcmFtZXRlciR7cGFyYW1ldGVyU3RvcmVDcmVkZW50aWFsc0dvb2dsZX1gLFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgcHJlZGljdGluZ0xhbWJkYS5yb2xlPy5hdHRhY2hJbmxpbmVQb2xpY3koXG4gICAgICBuZXcgUG9saWN5KHRoaXMsIGAke3Byb3BzLnNvbHV0aW9ufS1nZXQtc3NtLWVudmlyb25tZW50LXZhcmlhYmxlYCwge1xuICAgICAgICBzdGF0ZW1lbnRzOiBbcHJlZGljdGluZ0xhbWJkYVN5c3RlbU1hbmFnZXJHZXRQYXJhbWV0ZXJQb2xpY3lTdGF0ZW1lbnRdLFxuICAgICAgfSlcbiAgICApO1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy9cbiAgICAvLyAgUGVybWlzc2lvbnMgdG8gcHVzaCBub3RpZmljYXRpb25cbiAgICAvL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY29uc3QgcHJlZGljdGluZ0xhbWJkYVNOU1B1Ymxpc2hQb2xpY3lTdGF0ZW1lbnQgPSBuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFtcInNuczpQdWJsaXNoXCJdLFxuICAgICAgcmVzb3VyY2VzOiBbYCR7dG9waWMudG9waWNBcm59YF0sXG4gICAgfSk7XG4gICAgcHJlZGljdGluZ0xhbWJkYS5yb2xlPy5hdHRhY2hJbmxpbmVQb2xpY3koXG4gICAgICBuZXcgUG9saWN5KHRoaXMsIGAke3Byb3BzLnNvbHV0aW9ufS1wdWJsaXNoLXRvLXNuc2AsIHtcbiAgICAgICAgc3RhdGVtZW50czogW3ByZWRpY3RpbmdMYW1iZGFTTlNQdWJsaXNoUG9saWN5U3RhdGVtZW50XSxcbiAgICAgIH0pXG4gICAgKTtcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vXG4gICAgLy8gIFBlcm1pc3Npb25zIHRvIHRhbGsgdG8gY29kZSBndXJ1IGFnZW50XG4gICAgLy9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIHByZWRpY3RpbmdMYW1iZGEucm9sZT8uYWRkTWFuYWdlZFBvbGljeShcbiAgICAgIE1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKHByb3BzLnByb2ZpbGluZ0dyb3Vwc1Blcm1pc3Npb25zKVxuICAgICk7XG4gICAgcHJvZmlsaW5nR3JvdXAuZ3JhbnRQdWJsaXNoKHByZWRpY3RpbmdMYW1iZGEpO1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy9cbiAgICAvLyAgT3V0cHV0cywgdG9waWMgYXJuIGFuZCBmdW5jdGlvbiBhcm5cbiAgICAvL1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY29uc3QgbGFtYmRhQXJuID0gbmV3IENmbk91dHB1dCh0aGlzLCBgJHtwcm9wcy5zb2x1dGlvbn0tYXJuYCwge1xuICAgICAgdmFsdWU6IHByZWRpY3RpbmdMYW1iZGEuZnVuY3Rpb25Bcm4sXG4gICAgICBleHBvcnROYW1lOiBwcm9wcy5wcmVkaWN0aW5nTGFtYmRhRXhwb3J0TmFtZSxcbiAgICB9KTtcbiAgICBsYW1iZGFBcm4ub3ZlcnJpZGVMb2dpY2FsSWQocHJvcHMucHJlZGljdGluZ0xhbWJkYUV4cG9ydE5hbWUpO1xuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgYCR7cHJvcHMuc29sdXRpb259LXRvcGljLWFybmAsIHtcbiAgICAgIHZhbHVlOiB0b3BpYy50b3BpY0FybixcbiAgICB9KTtcbiAgICBjb25zdCBydWxlID0gbmV3IFJ1bGUodGhpcywgXCJSdWxlXCIsIHtcbiAgICAgIHNjaGVkdWxlOiBTY2hlZHVsZS5leHByZXNzaW9uKFwicmF0ZSg1IG1pbnV0ZXMpXCIpLFxuICAgIH0pO1xuICAgIHJ1bGUuYWRkVGFyZ2V0KG5ldyBMYW1iZGFGdW5jdGlvbihwcmVkaWN0aW5nTGFtYmRhKSk7XG4gIH1cbn1cbiJdfQ==