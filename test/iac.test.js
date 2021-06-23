"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("@aws-cdk/assert");
const cdk = require("@aws-cdk/core");
const Iac = require("../lib/backend-stack");
const builder_pattern_1 = require("builder-pattern");
const StackConfigs_1 = require("../lib/StackConfigs");
const backendStackConfig = builder_pattern_1.StrictBuilder()
    .solution(StackConfigs_1.Backend.solution)
    .parameterStoreCredentialsGoogle(StackConfigs_1.Backend.parameterStoreCredentialsGoogle)
    .timeout(StackConfigs_1.Backend.timeout)
    .codeLocation(StackConfigs_1.Backend.codeLocation)
    .memorySize(StackConfigs_1.Backend.memory)
    .environment(StackConfigs_1.Backend.environment)
    .profilingGroupsPermissions(StackConfigs_1.Backend.profilingGroupPermissions)
    .predictingLambdaExportName(StackConfigs_1.Backend.predictingLambdaExportName)
    .mobileNumbers(StackConfigs_1.mobileNumbers)
    .build();
test("λ has environment variables", () => {
    const stack = new Iac.BackendStack(new cdk.App(), "MyTestStack", backendStackConfig);
    assert_1.expect(stack).to(assert_1.haveResource("AWS::Lambda::Function", {
        Environment: {
            Variables: {
                CREDENTIALS: "/google/admin/credentials",
                CODE_GURU_PROFILING_GROUP: {
                    Ref: "MyTestStackbackendpredictinglambdaprofilinggroupProfilingGroupBD913E17",
                },
                SNS: { Ref: "MyTestStackbackendpredictinglambdasnstopic52F11C32" },
            },
        },
    }));
});
test("λ has permission to post code guru profile", () => {
    const stack = new Iac.BackendStack(new cdk.App(), "MyTestStack", backendStackConfig);
    assert_1.expect(stack).to(assert_1.haveResourceLike("AWS::IAM::Policy", {
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
    }));
});
test("λ has permission to publish to sns ", () => {
    const stack = new Iac.BackendStack(new cdk.App(), "MyTestStack", backendStackConfig);
    assert_1.expect(stack).to(assert_1.haveResourceLike("AWS::IAM::Policy", {
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
    }));
});
test("λ has permission to read ssm parameter ", () => {
    const stack = new Iac.BackendStack(new cdk.App(), "TestSSM", backendStackConfig);
    assert_1.expect(stack).to(assert_1.haveResourceLike("AWS::IAM::Policy", {
        PolicyDocument: {
            Statement: [
                {
                    Action: "ssm:GetParameter*",
                    Effect: "Allow",
                    Resource: "arn:aws:ssm:undefined:undefined:parameter/google/admin/credentials",
                },
            ],
            Version: "2012-10-17",
        },
    }));
});
test("Stack has cloudwatch event rule", () => {
    const stack = new Iac.BackendStack(new cdk.App(), "TestEvents", backendStackConfig);
    assert_1.expect(stack).to(assert_1.haveResource("AWS::Events::Rule"));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWFjLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpYWMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRDQUl5QjtBQUN6QixxQ0FBcUM7QUFDckMsNENBQTRDO0FBQzVDLHFEQUFnRDtBQUVoRCxzREFBNkQ7QUFFN0QsTUFBTSxrQkFBa0IsR0FBRywrQkFBYSxFQUEwQjtLQUMvRCxRQUFRLENBQUMsc0JBQU8sQ0FBQyxRQUFRLENBQUM7S0FDMUIsK0JBQStCLENBQUMsc0JBQU8sQ0FBQywrQkFBK0IsQ0FBQztLQUN4RSxPQUFPLENBQUMsc0JBQU8sQ0FBQyxPQUFPLENBQUM7S0FDeEIsWUFBWSxDQUFDLHNCQUFPLENBQUMsWUFBWSxDQUFDO0tBQ2xDLFVBQVUsQ0FBQyxzQkFBTyxDQUFDLE1BQU0sQ0FBQztLQUMxQixXQUFXLENBQUMsc0JBQU8sQ0FBQyxXQUFXLENBQUM7S0FDaEMsMEJBQTBCLENBQUMsc0JBQU8sQ0FBQyx5QkFBeUIsQ0FBQztLQUM3RCwwQkFBMEIsQ0FBQyxzQkFBTyxDQUFDLDBCQUEwQixDQUFDO0tBQzlELGFBQWEsQ0FBQyw0QkFBYSxDQUFDO0tBQzVCLEtBQUssRUFBRSxDQUFDO0FBRVgsSUFBSSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRTtJQUN2QyxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQ2hDLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUNiLGFBQWEsRUFDYixrQkFBa0IsQ0FDbkIsQ0FBQztJQUNGLGVBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQ2pCLHFCQUFZLENBQUMsdUJBQXVCLEVBQUU7UUFDcEMsV0FBVyxFQUFFO1lBQ1gsU0FBUyxFQUFFO2dCQUNULFdBQVcsRUFBRSwyQkFBMkI7Z0JBQ3hDLHlCQUF5QixFQUFFO29CQUN6QixHQUFHLEVBQUUsd0VBQXdFO2lCQUM5RTtnQkFFRCxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsb0RBQW9ELEVBQUU7YUFDbkU7U0FDRjtLQUNGLENBQUMsQ0FDSCxDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsNENBQTRDLEVBQUUsR0FBRyxFQUFFO0lBQ3RELE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLFlBQVksQ0FDaEMsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQ2IsYUFBYSxFQUNiLGtCQUFrQixDQUNuQixDQUFDO0lBQ0YsZUFBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FDakIseUJBQWdCLENBQUMsa0JBQWtCLEVBQUU7UUFDbkMsY0FBYyxFQUFFO1lBQ2QsU0FBUyxFQUFFO2dCQUNUO29CQUNFLE1BQU0sRUFBRTt3QkFDTixrQ0FBa0M7d0JBQ2xDLG9DQUFvQztxQkFDckM7b0JBQ0QsTUFBTSxFQUFFLE9BQU87b0JBQ2YsUUFBUSxFQUFFO3dCQUNSLFlBQVksRUFBRTs0QkFDWix3RUFBd0U7NEJBQ3hFLEtBQUs7eUJBQ047cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUNELE9BQU8sRUFBRSxZQUFZO1NBQ3RCO0tBQ0YsQ0FBQyxDQUNILENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxxQ0FBcUMsRUFBRSxHQUFHLEVBQUU7SUFDL0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUNoQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFDYixhQUFhLEVBQ2Isa0JBQWtCLENBQ25CLENBQUM7SUFDRixlQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUNqQix5QkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRTtRQUNuQyxjQUFjLEVBQUU7WUFDZCxTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsTUFBTSxFQUFFLGFBQWE7b0JBQ3JCLE1BQU0sRUFBRSxPQUFPO29CQUNmLFFBQVEsRUFBRTt3QkFDUixHQUFHLEVBQUUsb0RBQW9EO3FCQUMxRDtpQkFDRjthQUNGO1lBQ0QsT0FBTyxFQUFFLFlBQVk7U0FDdEI7S0FDRixDQUFDLENBQ0gsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLHlDQUF5QyxFQUFFLEdBQUcsRUFBRTtJQUNuRCxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQ2hDLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUNiLFNBQVMsRUFDVCxrQkFBa0IsQ0FDbkIsQ0FBQztJQUNGLGVBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQ2pCLHlCQUFnQixDQUFDLGtCQUFrQixFQUFFO1FBQ25DLGNBQWMsRUFBRTtZQUNkLFNBQVMsRUFBRTtnQkFDVDtvQkFDRSxNQUFNLEVBQUUsbUJBQW1CO29CQUMzQixNQUFNLEVBQUUsT0FBTztvQkFDZixRQUFRLEVBQ04sb0VBQW9FO2lCQUN2RTthQUNGO1lBQ0QsT0FBTyxFQUFFLFlBQVk7U0FDdEI7S0FDRixDQUFDLENBQ0gsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtJQUMzQyxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQ2hDLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUNiLFlBQVksRUFDWixrQkFBa0IsQ0FDbkIsQ0FBQztJQUNGLGVBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMscUJBQVksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7QUFDekQsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBleHBlY3QgYXMgZXhwZWN0Q0RLLFxuICBoYXZlUmVzb3VyY2UsXG4gIGhhdmVSZXNvdXJjZUxpa2UsXG59IGZyb20gXCJAYXdzLWNkay9hc3NlcnRcIjtcbmltcG9ydCAqIGFzIGNkayBmcm9tIFwiQGF3cy1jZGsvY29yZVwiO1xuaW1wb3J0ICogYXMgSWFjIGZyb20gXCIuLi9saWIvYmFja2VuZC1zdGFja1wiO1xuaW1wb3J0IHsgU3RyaWN0QnVpbGRlciB9IGZyb20gXCJidWlsZGVyLXBhdHRlcm5cIjtcbmltcG9ydCB7IEJhY2tlbmRDb25maWdEZWNvcmF0b3IgfSBmcm9tIFwiLi4vbGliLzFfYmFja2VuZC9MYW1iZGFCYWNrZW5kQ29uc3RydWN0XCI7XG5pbXBvcnQgeyBCYWNrZW5kLCBtb2JpbGVOdW1iZXJzIH0gZnJvbSBcIi4uL2xpYi9TdGFja0NvbmZpZ3NcIjtcblxuY29uc3QgYmFja2VuZFN0YWNrQ29uZmlnID0gU3RyaWN0QnVpbGRlcjxCYWNrZW5kQ29uZmlnRGVjb3JhdG9yPigpXG4gIC5zb2x1dGlvbihCYWNrZW5kLnNvbHV0aW9uKVxuICAucGFyYW1ldGVyU3RvcmVDcmVkZW50aWFsc0dvb2dsZShCYWNrZW5kLnBhcmFtZXRlclN0b3JlQ3JlZGVudGlhbHNHb29nbGUpXG4gIC50aW1lb3V0KEJhY2tlbmQudGltZW91dClcbiAgLmNvZGVMb2NhdGlvbihCYWNrZW5kLmNvZGVMb2NhdGlvbilcbiAgLm1lbW9yeVNpemUoQmFja2VuZC5tZW1vcnkpXG4gIC5lbnZpcm9ubWVudChCYWNrZW5kLmVudmlyb25tZW50KVxuICAucHJvZmlsaW5nR3JvdXBzUGVybWlzc2lvbnMoQmFja2VuZC5wcm9maWxpbmdHcm91cFBlcm1pc3Npb25zKVxuICAucHJlZGljdGluZ0xhbWJkYUV4cG9ydE5hbWUoQmFja2VuZC5wcmVkaWN0aW5nTGFtYmRhRXhwb3J0TmFtZSlcbiAgLm1vYmlsZU51bWJlcnMobW9iaWxlTnVtYmVycylcbiAgLmJ1aWxkKCk7XG5cbnRlc3QoXCLOuyBoYXMgZW52aXJvbm1lbnQgdmFyaWFibGVzXCIsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgSWFjLkJhY2tlbmRTdGFjayhcbiAgICBuZXcgY2RrLkFwcCgpLFxuICAgIFwiTXlUZXN0U3RhY2tcIixcbiAgICBiYWNrZW5kU3RhY2tDb25maWdcbiAgKTtcbiAgZXhwZWN0Q0RLKHN0YWNrKS50byhcbiAgICBoYXZlUmVzb3VyY2UoXCJBV1M6OkxhbWJkYTo6RnVuY3Rpb25cIiwge1xuICAgICAgRW52aXJvbm1lbnQ6IHtcbiAgICAgICAgVmFyaWFibGVzOiB7XG4gICAgICAgICAgQ1JFREVOVElBTFM6IFwiL2dvb2dsZS9hZG1pbi9jcmVkZW50aWFsc1wiLFxuICAgICAgICAgIENPREVfR1VSVV9QUk9GSUxJTkdfR1JPVVA6IHtcbiAgICAgICAgICAgIFJlZjogXCJNeVRlc3RTdGFja2JhY2tlbmRwcmVkaWN0aW5nbGFtYmRhcHJvZmlsaW5nZ3JvdXBQcm9maWxpbmdHcm91cEJEOTEzRTE3XCIsXG4gICAgICAgICAgfSxcblxuICAgICAgICAgIFNOUzogeyBSZWY6IFwiTXlUZXN0U3RhY2tiYWNrZW5kcHJlZGljdGluZ2xhbWJkYXNuc3RvcGljNTJGMTFDMzJcIiB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KVxuICApO1xufSk7XG5cbnRlc3QoXCLOuyBoYXMgcGVybWlzc2lvbiB0byBwb3N0IGNvZGUgZ3VydSBwcm9maWxlXCIsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgSWFjLkJhY2tlbmRTdGFjayhcbiAgICBuZXcgY2RrLkFwcCgpLFxuICAgIFwiTXlUZXN0U3RhY2tcIixcbiAgICBiYWNrZW5kU3RhY2tDb25maWdcbiAgKTtcbiAgZXhwZWN0Q0RLKHN0YWNrKS50byhcbiAgICBoYXZlUmVzb3VyY2VMaWtlKFwiQVdTOjpJQU06OlBvbGljeVwiLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgXCJjb2RlZ3VydS1wcm9maWxlcjpDb25maWd1cmVBZ2VudFwiLFxuICAgICAgICAgICAgICBcImNvZGVndXJ1LXByb2ZpbGVyOlBvc3RBZ2VudFByb2ZpbGVcIixcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBFZmZlY3Q6IFwiQWxsb3dcIixcbiAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgIFwiRm46OkdldEF0dFwiOiBbXG4gICAgICAgICAgICAgICAgXCJNeVRlc3RTdGFja2JhY2tlbmRwcmVkaWN0aW5nbGFtYmRhcHJvZmlsaW5nZ3JvdXBQcm9maWxpbmdHcm91cEJEOTEzRTE3XCIsXG4gICAgICAgICAgICAgICAgXCJBcm5cIixcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogXCIyMDEyLTEwLTE3XCIsXG4gICAgICB9LFxuICAgIH0pXG4gICk7XG59KTtcblxudGVzdChcIs67IGhhcyBwZXJtaXNzaW9uIHRvIHB1Ymxpc2ggdG8gc25zIFwiLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IElhYy5CYWNrZW5kU3RhY2soXG4gICAgbmV3IGNkay5BcHAoKSxcbiAgICBcIk15VGVzdFN0YWNrXCIsXG4gICAgYmFja2VuZFN0YWNrQ29uZmlnXG4gICk7XG4gIGV4cGVjdENESyhzdGFjaykudG8oXG4gICAgaGF2ZVJlc291cmNlTGlrZShcIkFXUzo6SUFNOjpQb2xpY3lcIiwge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiBcInNuczpQdWJsaXNoXCIsXG4gICAgICAgICAgICBFZmZlY3Q6IFwiQWxsb3dcIixcbiAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgIFJlZjogXCJNeVRlc3RTdGFja2JhY2tlbmRwcmVkaWN0aW5nbGFtYmRhc25zdG9waWM1MkYxMUMzMlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiBcIjIwMTItMTAtMTdcIixcbiAgICAgIH0sXG4gICAgfSlcbiAgKTtcbn0pO1xuXG50ZXN0KFwizrsgaGFzIHBlcm1pc3Npb24gdG8gcmVhZCBzc20gcGFyYW1ldGVyIFwiLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IElhYy5CYWNrZW5kU3RhY2soXG4gICAgbmV3IGNkay5BcHAoKSxcbiAgICBcIlRlc3RTU01cIixcbiAgICBiYWNrZW5kU3RhY2tDb25maWdcbiAgKTtcbiAgZXhwZWN0Q0RLKHN0YWNrKS50byhcbiAgICBoYXZlUmVzb3VyY2VMaWtlKFwiQVdTOjpJQU06OlBvbGljeVwiLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246IFwic3NtOkdldFBhcmFtZXRlcipcIixcbiAgICAgICAgICAgIEVmZmVjdDogXCJBbGxvd1wiLFxuICAgICAgICAgICAgUmVzb3VyY2U6XG4gICAgICAgICAgICAgIFwiYXJuOmF3czpzc206dW5kZWZpbmVkOnVuZGVmaW5lZDpwYXJhbWV0ZXIvZ29vZ2xlL2FkbWluL2NyZWRlbnRpYWxzXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogXCIyMDEyLTEwLTE3XCIsXG4gICAgICB9LFxuICAgIH0pXG4gICk7XG59KTtcblxudGVzdChcIlN0YWNrIGhhcyBjbG91ZHdhdGNoIGV2ZW50IHJ1bGVcIiwgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBJYWMuQmFja2VuZFN0YWNrKFxuICAgIG5ldyBjZGsuQXBwKCksXG4gICAgXCJUZXN0RXZlbnRzXCIsXG4gICAgYmFja2VuZFN0YWNrQ29uZmlnXG4gICk7XG4gIGV4cGVjdENESyhzdGFjaykudG8oaGF2ZVJlc291cmNlKFwiQVdTOjpFdmVudHM6OlJ1bGVcIikpO1xufSk7XG4iXX0=