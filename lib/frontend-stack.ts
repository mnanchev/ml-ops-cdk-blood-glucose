import * as cdk from "@aws-cdk/core";
import { CfnSkill } from "@aws-cdk/alexa-ask";
import * as path from "path";
import { Asset } from "@aws-cdk/aws-s3-assets";
import {
  CompositePrincipal,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "@aws-cdk/aws-iam";
import { StackProps } from "@aws-cdk/core";
export class FrontendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: StackProps) {
    super(scope, id, props);
    const asset = new Asset(this, "SkillAsset", {
      path: path.join(__dirname, "2_frontend"),
    });
    const role = new Role(this, "Role", {
      assumedBy: new CompositePrincipal(
        new ServicePrincipal("alexa-appkit.amazon.com"),
        new ServicePrincipal("cloudformation.amazonaws.com")
      ),
    });

    // Allow the skill resource to access the zipped skill package
    role.addToPolicy(
      new PolicyStatement({
        actions: ["S3:GetObject"],
        resources: [`arn:aws:s3:::${asset.s3BucketName}/*`],
      })
    );
    // =========================================
    //
    //  Frontend Architecture Creation
    //
    // =========================================
    new CfnSkill(this, id, {
      vendorId: "M2H6SI71RLZDQ",
      authenticationConfiguration: {
        clientId:
          "amzn1.application-oa2-client.101615094d5246d79d6935ef4167f7b9",
        clientSecret:
          "2f265ef94817ad32b721cff38a3e692f0bc797e58947fc250da60d444e77462d",
        refreshToken:
          "Atzr|IwEBIJR3h70xFJ84mnV_qN3wNUsYybaLXtzcdoSYkM7UFwfn0ZnfQOY40LebsMYDuoOqtCWs_2zFjI1JqpglFCTaSNi7obCM8s29jxulrYjT_e9E1vwrTbSR9hXe22tCbcC1YoXtYlzSqx1gy7dql2NA7Kd2-AAkO4ZIOpKP38Gu5FgUdqbfp-GTF6HItR6J4J0eQ6K7d3vVjRJBF6OPVyVIcUg37qs9tk4_M3IDlVo4NNPLojvC3DkWTIWvDGErzSEFeE4yCNRbSU-5i74Y8UV2Y8ly8R8TgfXjuqmMQlj9nw1PtfVqbQV3p83o3_oxX2-b2hpTBa3S-4Q4UVktunSFNhvswRsN9pGGD8GXaicGb7p6iAJSNngraEwLDY5X08adbLjsfSx9wceihF4REMXRbAusX6SdIpdOIHAmGGmk1LpvyFro7Ku9bktYBn4LO5xNA5KYOIqu1KOfg9wrlzwik671yZhU8XNwm32hnjwhC5mI2uCXcZOQ5FEqBMNDYEevx2kCGom-_i6cC3nIw9m7ZQTLr5WZRN-NojUsLHnko5lzhs23xZhf26vhXfMc_xxy-uWqMu_CpKH3kAMDbZhJeFpH",
      },
      skillPackage: {
        s3Bucket: asset.s3BucketName,
        s3Key: asset.s3ObjectKey,
        s3BucketRole: role.roleArn,
        overrides: {
          manifest: {
            apis: {
              custom: {
                endpoint: {
                  uri: "arn:aws:lambda:eu-central-1:559706524079:function:PrepareAndDeploy-backend-backendbackendpredictingl-LmvEXe1y3UW7",
                },
              },
            },
          },
        },
      },
    });
  }
}
