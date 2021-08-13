import {Backend, emails, mobileNumbers} from "./StackConfigs";
import {BackendStack} from "./backend-stack";
import {BackendConfigDecorator} from "./1_backend/LambdaBackendConstruct";
import {Construct} from "constructs";
import {StrictBuilder} from "builder-pattern";
import {Stage, StageProps} from "aws-cdk-lib";

export class MlOpsPipelineStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
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
    // =========================================
    //
    //  Backend creation
    //
    // =========================================
    new BackendStack(this, "backend", backendStackConfig);
  }
}
