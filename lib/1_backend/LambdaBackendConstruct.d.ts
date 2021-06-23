import { Construct, StackProps } from "@aws-cdk/core";
export interface BackendConfigDecorator extends StackProps {
  readonly codeLocation: string;
  readonly solution: string;
  readonly memorySize: number | undefined;
  readonly parameterStoreCredentialsGoogle: string;
  readonly timeout: number;
  readonly environment: string;
  readonly profilingGroupsPermissions: string;
  readonly predictingLambdaExportName: string;
  readonly mobileNumbers: Array<string>;
}
export declare class LambdaBackendConstruct extends Construct {
  constructor(scope: Construct, id: string, props: BackendConfigDecorator);
}
