#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { BackendStack } from "../lib/iac-stack";

import { Builder, StrictBuilder } from "builder-pattern";
import { Backend } from "../lib/StackConfigs";
import { BackendConfigDecorator } from "../lib/1_backend/LambdaBackendConstruct";
const app = new cdk.App();

// =========================================
//
//  Backend configuration builder
//
// =========================================
const backendStackConfig = StrictBuilder<BackendConfigDecorator>()
  .solution(Backend.solution)
  .environmentValue(Backend.environmentValue)
  .timeout(Backend.timeout)
  .codeLocation(Backend.codeLocation)
  .memorySize(Backend.memory)
  .environment(Backend.environment)
  .build();
// =========================================
//
//  Backend creation
//
// =========================================
new BackendStack(app, Backend.environment, backendStackConfig);
