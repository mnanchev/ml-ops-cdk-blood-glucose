export enum Backend {
  solution = "backend-predicting-lambda",
  environment = "production",
  memory = 10240,
  parameterStoreCredentialsGoogle = "/google/admin/credentials",
  codeLocation = "images",
  profilingGroupPermissions = "AmazonCodeGuruProfilerFullAccess",
  predictingLambdaExportName = "predictingLambda",
  timeout = 8,
}

export const mobileNumbers: Array<string> = ["+359898913413"];
