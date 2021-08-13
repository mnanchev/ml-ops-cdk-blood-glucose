#!/usr/bin/env node
import "source-map-support/register";

import { MlOpsPipelineStack } from "../lib/ml-ops-pipeline-stack";
import { App } from "aws-cdk-lib";
const app = new App();
new MlOpsPipelineStack(app, "MlOpsPipeline");
