"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MlOpsPipelineStage = void 0;
const core_1 = require("@aws-cdk/core");
const backend_stack_1 = require("./backend-stack");
const builder_pattern_1 = require("builder-pattern");
const StackConfigs_1 = require("./StackConfigs");
class MlOpsPipelineStage extends core_1.Stage {
    constructor(scope, id, props) {
        super(scope, id, props);
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
        // =========================================
        //
        //  Backend creation
        //
        // =========================================
        new backend_stack_1.BackendStack(this, "backend", backendStackConfig);
    }
}
exports.MlOpsPipelineStage = MlOpsPipelineStage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWwtb3BzLXBpcGVsaW5lLXN0YWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWwtb3BzLXBpcGVsaW5lLXN0YWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdDQUE2RDtBQUM3RCxtREFBK0M7QUFDL0MscURBQWdEO0FBRWhELGlEQUF3RDtBQUV4RCxNQUFhLGtCQUFtQixTQUFRLFlBQUs7SUFDM0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QixNQUFNLGtCQUFrQixHQUFHLCtCQUFhLEVBQTBCO2FBQy9ELFFBQVEsQ0FBQyxzQkFBTyxDQUFDLFFBQVEsQ0FBQzthQUMxQiwrQkFBK0IsQ0FBQyxzQkFBTyxDQUFDLCtCQUErQixDQUFDO2FBQ3hFLE9BQU8sQ0FBQyxzQkFBTyxDQUFDLE9BQU8sQ0FBQzthQUN4QixZQUFZLENBQUMsc0JBQU8sQ0FBQyxZQUFZLENBQUM7YUFDbEMsVUFBVSxDQUFDLHNCQUFPLENBQUMsTUFBTSxDQUFDO2FBQzFCLFdBQVcsQ0FBQyxzQkFBTyxDQUFDLFdBQVcsQ0FBQzthQUNoQywwQkFBMEIsQ0FBQyxzQkFBTyxDQUFDLHlCQUF5QixDQUFDO2FBQzdELDBCQUEwQixDQUFDLHNCQUFPLENBQUMsMEJBQTBCLENBQUM7YUFDOUQsYUFBYSxDQUFDLDRCQUFhLENBQUM7YUFDNUIsS0FBSyxFQUFFLENBQUM7UUFDWCw0Q0FBNEM7UUFDNUMsRUFBRTtRQUNGLG9CQUFvQjtRQUNwQixFQUFFO1FBQ0YsNENBQTRDO1FBQzVDLElBQUksNEJBQVksQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLGtCQUFrQixDQUFDLENBQUM7SUFDeEQsQ0FBQztDQUNGO0FBckJELGdEQXFCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWdlLCBDb25zdHJ1Y3QsIFN0YWdlUHJvcHMgfSBmcm9tIFwiQGF3cy1jZGsvY29yZVwiO1xuaW1wb3J0IHsgQmFja2VuZFN0YWNrIH0gZnJvbSBcIi4vYmFja2VuZC1zdGFja1wiO1xuaW1wb3J0IHsgU3RyaWN0QnVpbGRlciB9IGZyb20gXCJidWlsZGVyLXBhdHRlcm5cIjtcbmltcG9ydCB7IEJhY2tlbmRDb25maWdEZWNvcmF0b3IgfSBmcm9tIFwiLi8xX2JhY2tlbmQvTGFtYmRhQmFja2VuZENvbnN0cnVjdFwiO1xuaW1wb3J0IHsgQmFja2VuZCwgbW9iaWxlTnVtYmVycyB9IGZyb20gXCIuL1N0YWNrQ29uZmlnc1wiO1xuXG5leHBvcnQgY2xhc3MgTWxPcHNQaXBlbGluZVN0YWdlIGV4dGVuZHMgU3RhZ2Uge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWdlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcbiAgICBjb25zdCBiYWNrZW5kU3RhY2tDb25maWcgPSBTdHJpY3RCdWlsZGVyPEJhY2tlbmRDb25maWdEZWNvcmF0b3I+KClcbiAgICAgIC5zb2x1dGlvbihCYWNrZW5kLnNvbHV0aW9uKVxuICAgICAgLnBhcmFtZXRlclN0b3JlQ3JlZGVudGlhbHNHb29nbGUoQmFja2VuZC5wYXJhbWV0ZXJTdG9yZUNyZWRlbnRpYWxzR29vZ2xlKVxuICAgICAgLnRpbWVvdXQoQmFja2VuZC50aW1lb3V0KVxuICAgICAgLmNvZGVMb2NhdGlvbihCYWNrZW5kLmNvZGVMb2NhdGlvbilcbiAgICAgIC5tZW1vcnlTaXplKEJhY2tlbmQubWVtb3J5KVxuICAgICAgLmVudmlyb25tZW50KEJhY2tlbmQuZW52aXJvbm1lbnQpXG4gICAgICAucHJvZmlsaW5nR3JvdXBzUGVybWlzc2lvbnMoQmFja2VuZC5wcm9maWxpbmdHcm91cFBlcm1pc3Npb25zKVxuICAgICAgLnByZWRpY3RpbmdMYW1iZGFFeHBvcnROYW1lKEJhY2tlbmQucHJlZGljdGluZ0xhbWJkYUV4cG9ydE5hbWUpXG4gICAgICAubW9iaWxlTnVtYmVycyhtb2JpbGVOdW1iZXJzKVxuICAgICAgLmJ1aWxkKCk7XG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvL1xuICAgIC8vICBCYWNrZW5kIGNyZWF0aW9uXG4gICAgLy9cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIG5ldyBCYWNrZW5kU3RhY2sodGhpcywgXCJiYWNrZW5kXCIsIGJhY2tlbmRTdGFja0NvbmZpZyk7XG4gIH1cbn1cbiJdfQ==