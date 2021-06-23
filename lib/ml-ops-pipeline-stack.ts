import * as cdk from "@aws-cdk/core";
import { Repository } from "@aws-cdk/aws-codecommit";
import { CodeCommitSourceAction } from "@aws-cdk/aws-codepipeline-actions";
import { Artifact } from "@aws-cdk/aws-codepipeline";
import { SimpleSynthAction, CdkPipeline } from "@aws-cdk/pipelines";
import { MlOpsPipelineStage } from "./ml-ops-pipeline-stage";

export class MlOpsPipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
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
        actionName: "CodeCommit",
        output: sourceArtifact,
        repository: ml_repo,
        branch: "main",
      }),

      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
        subdirectory: "iac",
        actionName: "Build",
        buildCommand: "npm install && npm run build && docker version",
      }),
    });
    const deploy = new MlOpsPipelineStage(this, "Deploy");
    pipeline.addApplicationStage(deploy);
  }
}
