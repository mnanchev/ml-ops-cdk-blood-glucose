#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { BackendStack } from "../lib/backend-stack";

import { StrictBuilder } from "builder-pattern";
import { Backend, mobileNumbers } from "../lib/StackConfigs";
import { BackendConfigDecorator } from "../lib/1_backend/LambdaBackendConstruct";
import {MlOpsPipelineStack} from "../lib/ml-ops-pipeline-stack";
const app = new cdk.App();
new MlOpsPipelineStack(app, 'MlOpsPipeline');
// =========================================
//
//  Backend configuration builder
//
// =========================================
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
new BackendStack(app, "backend", backendStackConfig);
