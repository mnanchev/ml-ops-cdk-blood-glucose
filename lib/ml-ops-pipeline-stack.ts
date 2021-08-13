// import * as cdk from "@aws-cdk/core";
// import { Repository } from "@aws-cdk/aws-codecommit";
// import { CodeCommitSourceAction } from "@aws-cdk/aws-codepipeline-actions";
// import { Artifact } from "@aws-cdk/aws-codepipeline";
// import { SimpleSynthAction, CdkPipeline } from "@aws-cdk/pipelines";
import { MlOpsPipelineStage } from "./ml-ops-pipeline-stage";
import {Stack, StackProps} from "aws-cdk-lib";
import {CdkPipeline, SimpleSynthAction} from "aws-cdk-lib/pipelines";
import {CodeCommitSourceAction} from "aws-cdk-lib/aws-codepipeline-actions";
import {Artifact} from "aws-cdk-lib/aws-codepipeline";
import {Construct} from "constructs";
import {Repository} from "aws-cdk-lib/aws-codecommit";

export class MlOpsPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?:StackProps) {
    super(scope, id, props);
    const pipelineName = "MlOpsPipeline";
    const ml_repo = new Repository(this, "MlOpsPipelineRepo", {
      repositoryName: `${pipelineName}Repo`,
    });
    const sourceArtifact = new Artifact();
    const cloudAssemblyArtifact = new Artifact();
    const pipeline = new CdkPipeline(this, `${pipelineName}`, {
      pipelineName: `${pipelineName}`,
      cloudAssemblyArtifact,

      sourceAction: new CodeCommitSourceAction({
        actionName: "GetSource",
        output: sourceArtifact,
        repository: ml_repo,
        branch: "main",
      }),

      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
        actionName: "BuildAndTest",
        installCommand: "npm install",
        buildCommand: "npm run build && npm test",
      }),
    });
    const deploy = new MlOpsPipelineStage(this, "PrepareAndDeploy");
    pipeline.addApplicationStage(deploy);
  }
}
