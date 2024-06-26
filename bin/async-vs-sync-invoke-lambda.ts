#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { AsyncVsSyncInvokeLambdaStack } from "../lib/async-vs-sync-invoke-lambda-stack";

const app = new cdk.App();
new AsyncVsSyncInvokeLambdaStack(app, "AsyncVsSyncInvokeLambdaStack", {});
