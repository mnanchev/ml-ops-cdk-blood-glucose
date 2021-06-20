#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { MlOpsPipelineStack } from "../lib/ml-ops-pipeline-stack";
const app = new cdk.App();
new MlOpsPipelineStack(app, "MlOpsPipeline");

