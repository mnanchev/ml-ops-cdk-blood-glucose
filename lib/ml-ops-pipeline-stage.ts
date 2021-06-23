import { Stage, Construct, StageProps } from "@aws-cdk/core";
import { BackendStack } from "./backend-stack";
import { StrictBuilder } from "builder-pattern";
import { BackendConfigDecorator } from "./1_backend/LambdaBackendConstruct";
import { Backend, mobileNumbers } from "./StackConfigs";

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
      .profilingGroupsPermissions(Backend.profilingGroupPermissions)
      .predictingLambdaExportName(Backend.predictingLambdaExportName)
      .mobileNumbers(mobileNumbers)
      .build();
    // =========================================
    //
    //  Backend creation
    //
    // =========================================
    new BackendStack(this, "backend", backendStackConfig);
  }
}
