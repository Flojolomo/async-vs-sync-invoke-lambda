import * as cdk from "aws-cdk-lib";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

export class AsyncVsSyncInvokeLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const restApi = new apigw.RestApi(this, "rest-api", {
      deploy: true,
    });

    const resolve = new lambdaNodeJs.NodejsFunction(this, "resolve", {
      entry: "functions/resolve.ts",
      logRetention: logs.RetentionDays.ONE_DAY,
      timeout: cdk.Duration.seconds(10),
    });

    const reject = new lambdaNodeJs.NodejsFunction(this, "reject", {
      entry: "functions/reject.ts",
      logRetention: logs.RetentionDays.ONE_DAY,
      timeout: cdk.Duration.seconds(10),
    });

    const rejectCatch = new lambdaNodeJs.NodejsFunction(this, "reject-catch", {
      entry: "functions/reject-catch.ts",
      logRetention: logs.RetentionDays.ONE_DAY,
      timeout: cdk.Duration.seconds(10),
    });

    const generateWebhook = new lambdaNodeJs.NodejsFunction(
      this,
      "generate-webhook",
      {
        entry: "functions/generate-webhook.ts",
        logRetention: logs.RetentionDays.ONE_DAY,
        timeout: cdk.Duration.seconds(10),
      }
    );

    generateWebhook.addEnvironment(
      "API_GATEWAY_URL",
      restApi.deploymentStage.urlForPath("/")
    );

    restApi.root.addResource("generate-webhook").addMethod(
      "POST",
      new apigw.LambdaIntegration(generateWebhook, {
        allowTestInvoke: true,
      })
    );

    const asyncResource = restApi.root.addResource("async");
    this.addAsyncLambdaInvokation(asyncResource, "resolve", resolve);
    this.addAsyncLambdaInvokation(asyncResource, "reject", reject);
    this.addAsyncLambdaInvokation(asyncResource, "reject-catch", rejectCatch);

    const sync = restApi.root.addResource("sync");
    sync.addResource("resolve").addMethod(
      "POST",
      new apigw.LambdaIntegration(resolve, {
        allowTestInvoke: true,
      })
    );
    sync.addResource("reject").addMethod(
      "POST",
      new apigw.LambdaIntegration(reject, {
        allowTestInvoke: true,
      })
    );

    sync.addResource("reject-catch").addMethod(
      "POST",
      new apigw.LambdaIntegration(rejectCatch, {
        allowTestInvoke: true,
      })
    );

    new cdk.CfnOutput(this, "webhook-endpoint", {
      value: restApi.deploymentStage.urlForPath("/generate-webhook"),
      description: "Webhook endpoint",
    });
  }

  private addAsyncLambdaInvokation(
    resource: apigw.IResource,
    path: string,
    handler: lambda.IFunction
  ) {
    resource.addResource(path).addMethod(
      "POST",
      new apigw.LambdaIntegration(handler, {
        allowTestInvoke: true,
        proxy: false,
        requestTemplates: {
          "application/json": JSON.stringify({
            statusCode: "202",
          }),
        },
        requestParameters: {
          "integration.request.header.X-Amz-Invocation-Type": "'Event'",
        },
        integrationResponses: [
          {
            statusCode: "202",
            responseTemplates: {
              "application/json": JSON.stringify({
                message: "Request accepted",
              }),
            },
          },
        ],
      }),
      {
        methodResponses: [
          {
            statusCode: "202",
            responseModels: {
              "application/json": apigw.Model.EMPTY_MODEL,
            },
          },
        ],
      }
    );
  }
}
