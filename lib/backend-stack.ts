import { Stack } from "aws-cdk-lib";
import {
  BackendConfigDecorator,
  LambdaBackendConstruct,
} from "./1_backend/LambdaBackendConstruct";
import { Construct } from "constructs";

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props: BackendConfigDecorator) {
    super(scope, id, props);
    // =========================================
    //
    //  Backend Architecture Creation
    //
    // =========================================
    new LambdaBackendConstruct(this, id, props);
  }
}
