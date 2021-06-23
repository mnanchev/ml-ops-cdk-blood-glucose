"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MlOpsPipelineStack = void 0;
const cdk = require("@aws-cdk/core");
const aws_codecommit_1 = require("@aws-cdk/aws-codecommit");
const aws_codepipeline_actions_1 = require("@aws-cdk/aws-codepipeline-actions");
const aws_codepipeline_1 = require("@aws-cdk/aws-codepipeline");
const pipelines_1 = require("@aws-cdk/pipelines");
const ml_ops_pipeline_stage_1 = require("./ml-ops-pipeline-stage");
class MlOpsPipelineStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const pipelineName = "MlOpsPipeline";
        const ml_repo = new aws_codecommit_1.Repository(this, "MlOpsPipelineRepo", {
            repositoryName: `${pipelineName}Repo`,
        });
        const sourceArtifact = new aws_codepipeline_1.Artifact();
        const cloudAssemblyArtifact = new aws_codepipeline_1.Artifact();
        const pipeline = new pipelines_1.CdkPipeline(this, `${pipelineName}`, {
            pipelineName: `${pipelineName}`,
            cloudAssemblyArtifact,
            sourceAction: new aws_codepipeline_actions_1.CodeCommitSourceAction({
                actionName: "CodeCommit",
                output: sourceArtifact,
                repository: ml_repo,
                branch: "main",
            }),
            synthAction: pipelines_1.SimpleSynthAction.standardNpmSynth({
                sourceArtifact,
                cloudAssemblyArtifact,
                actionName: "Build",
                installCommand: "cd iac && npm install && ls -alh && pwd",
                buildCommand: "npm run build",
            }),
        });
        const deploy = new ml_ops_pipeline_stage_1.MlOpsPipelineStage(this, "Deploy");
        pipeline.addApplicationStage(deploy);
    }
}
exports.MlOpsPipelineStack = MlOpsPipelineStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWwtb3BzLXBpcGVsaW5lLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWwtb3BzLXBpcGVsaW5lLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFxQztBQUNyQyw0REFBcUQ7QUFDckQsZ0ZBQTJFO0FBQzNFLGdFQUFxRDtBQUNyRCxrREFBc0U7QUFDdEUsbUVBQTZEO0FBRzdELE1BQWEsa0JBQW1CLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDL0MsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QixNQUFNLFlBQVksR0FBRyxlQUFlLENBQUM7UUFDckMsTUFBTSxPQUFPLEdBQUcsSUFBSSwyQkFBVSxDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRTtZQUN4RCxjQUFjLEVBQUUsR0FBRyxZQUFZLE1BQU07U0FDdEMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxjQUFjLEdBQUcsSUFBSSwyQkFBUSxFQUFFLENBQUM7UUFDdEMsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLDJCQUFRLEVBQUUsQ0FBQztRQUM3QyxNQUFNLFFBQVEsR0FBRyxJQUFJLHVCQUFXLENBQUMsSUFBSSxFQUFFLEdBQUcsWUFBWSxFQUFFLEVBQUU7WUFDeEQsWUFBWSxFQUFFLEdBQUcsWUFBWSxFQUFFO1lBQy9CLHFCQUFxQjtZQUVyQixZQUFZLEVBQUUsSUFBSSxpREFBc0IsQ0FBQztnQkFDdkMsVUFBVSxFQUFFLFlBQVk7Z0JBQ3hCLE1BQU0sRUFBRSxjQUFjO2dCQUN0QixVQUFVLEVBQUUsT0FBTztnQkFDbkIsTUFBTSxFQUFFLE1BQU07YUFDZixDQUFDO1lBRUYsV0FBVyxFQUFFLDZCQUFpQixDQUFDLGdCQUFnQixDQUFDO2dCQUM5QyxjQUFjO2dCQUNkLHFCQUFxQjtnQkFDckIsVUFBVSxFQUFFLE9BQU87Z0JBQ25CLGNBQWMsRUFBRSx5Q0FBeUM7Z0JBQ3pELFlBQVksRUFBRSxlQUFlO2FBQzlCLENBQUM7U0FDSCxDQUFDLENBQUM7UUFDSCxNQUFNLE1BQU0sR0FBRyxJQUFJLDBDQUFrQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN0RCxRQUFRLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdkMsQ0FBQztDQUNGO0FBL0JELGdEQStCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tIFwiQGF3cy1jZGsvY29yZVwiO1xuaW1wb3J0IHsgUmVwb3NpdG9yeSB9IGZyb20gXCJAYXdzLWNkay9hd3MtY29kZWNvbW1pdFwiO1xuaW1wb3J0IHsgQ29kZUNvbW1pdFNvdXJjZUFjdGlvbiB9IGZyb20gXCJAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lLWFjdGlvbnNcIjtcbmltcG9ydCB7IEFydGlmYWN0IH0gZnJvbSBcIkBhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmVcIjtcbmltcG9ydCB7IFNpbXBsZVN5bnRoQWN0aW9uLCBDZGtQaXBlbGluZSwgIH0gZnJvbSBcIkBhd3MtY2RrL3BpcGVsaW5lc1wiO1xuaW1wb3J0IHsgTWxPcHNQaXBlbGluZVN0YWdlIH0gZnJvbSBcIi4vbWwtb3BzLXBpcGVsaW5lLXN0YWdlXCI7XG5pbXBvcnQgKiBhcyBjb2RlYnVpbGQgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVidWlsZCc7XG5cbmV4cG9ydCBjbGFzcyBNbE9wc1BpcGVsaW5lU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuICAgIGNvbnN0IHBpcGVsaW5lTmFtZSA9IFwiTWxPcHNQaXBlbGluZVwiO1xuICAgIGNvbnN0IG1sX3JlcG8gPSBuZXcgUmVwb3NpdG9yeSh0aGlzLCBcIk1sT3BzUGlwZWxpbmVSZXBvXCIsIHtcbiAgICAgIHJlcG9zaXRvcnlOYW1lOiBgJHtwaXBlbGluZU5hbWV9UmVwb2AsXG4gICAgfSk7XG4gICAgY29uc3Qgc291cmNlQXJ0aWZhY3QgPSBuZXcgQXJ0aWZhY3QoKTtcbiAgICBjb25zdCBjbG91ZEFzc2VtYmx5QXJ0aWZhY3QgPSBuZXcgQXJ0aWZhY3QoKTtcbiAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBDZGtQaXBlbGluZSh0aGlzLCBgJHtwaXBlbGluZU5hbWV9YCwge1xuICAgICAgcGlwZWxpbmVOYW1lOiBgJHtwaXBlbGluZU5hbWV9YCxcbiAgICAgIGNsb3VkQXNzZW1ibHlBcnRpZmFjdCxcblxuICAgICAgc291cmNlQWN0aW9uOiBuZXcgQ29kZUNvbW1pdFNvdXJjZUFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6IFwiQ29kZUNvbW1pdFwiLFxuICAgICAgICBvdXRwdXQ6IHNvdXJjZUFydGlmYWN0LFxuICAgICAgICByZXBvc2l0b3J5OiBtbF9yZXBvLFxuICAgICAgICBicmFuY2g6IFwibWFpblwiLFxuICAgICAgfSksXG5cbiAgICAgIHN5bnRoQWN0aW9uOiBTaW1wbGVTeW50aEFjdGlvbi5zdGFuZGFyZE5wbVN5bnRoKHtcbiAgICAgICAgc291cmNlQXJ0aWZhY3QsXG4gICAgICAgIGNsb3VkQXNzZW1ibHlBcnRpZmFjdCxcbiAgICAgICAgYWN0aW9uTmFtZTogXCJCdWlsZFwiLFxuICAgICAgICBpbnN0YWxsQ29tbWFuZDogXCJjZCBpYWMgJiYgbnBtIGluc3RhbGwgJiYgbHMgLWFsaCAmJiBwd2RcIixcbiAgICAgICAgYnVpbGRDb21tYW5kOiBcIm5wbSBydW4gYnVpbGRcIixcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIGNvbnN0IGRlcGxveSA9IG5ldyBNbE9wc1BpcGVsaW5lU3RhZ2UodGhpcywgXCJEZXBsb3lcIik7XG4gICAgcGlwZWxpbmUuYWRkQXBwbGljYXRpb25TdGFnZShkZXBsb3kpO1xuICB9XG59XG4iXX0=