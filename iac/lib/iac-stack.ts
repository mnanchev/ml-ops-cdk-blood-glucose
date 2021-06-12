import * as cdk from "@aws-cdk/core";
import {
  BackendConfigDecorator,
  LambdaBackendConstruct,
} from "./1_backend/LambdaBackendConstruct";
import { Function } from "@aws-cdk/aws-lambda";
import { ManagedPolicy } from "@aws-cdk/aws-iam";

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: BackendConfigDecorator) {
    super(scope, id, props);
    // =========================================
    //
    //  Backend Architecture Creation
    //
    // =========================================
    const backend = new LambdaBackendConstruct(this, id, props);
  }
}
