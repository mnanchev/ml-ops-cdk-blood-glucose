import * as cdk from "@aws-cdk/core";
import { BackendConfigDecorator } from "./1_backend/LambdaBackendConstruct";
export declare class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: BackendConfigDecorator);
}
