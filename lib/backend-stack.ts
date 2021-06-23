import * as cdk from "@aws-cdk/core";
import {
  BackendConfigDecorator,
  LambdaBackendConstruct,
} from "./1_backend/LambdaBackendConstruct";

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: BackendConfigDecorator) {
    super(scope, id, props);
    // =========================================
    //
    //  Backend Architecture Creation
    //
    // =========================================
    new LambdaBackendConstruct(this, id, props);
  }
}
