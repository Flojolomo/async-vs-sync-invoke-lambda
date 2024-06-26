# Showcase: Async vs Sync invoking Lambda functions from API gateway

Inspired by the question "why should I invoke a lambda function in async mode, or even include a SQS queue behind an API gateway", I decided to build that showcase to, on one side, verify my hypothesis, and on the other side, to show case the setup.

To give a bit more context: The setup includes a SaaS product (A) working heavily with events and running in a Kubernetes Cluster on AWS, and a new service built from scratch (B) to handle webhooks of the SaaS product. There was a discussion sparked about implementation details of B and why, or why not, it would make sense to decouple the response to the webhook initiated by A.
A requires events about the processing state. Those include `“success”, “failed”, “aborted”`.

![Basic Setup](./docs/basic-setup.png)

The definition of a webhook is as follows

> A webhook can be thought of as a type of API that is driven by events rather than requests. [Source](https://www.mparticle.com/blog/apis-vs-webhooks/)

To show case, the setup, following steps are taken

- Create API Gateway :white_check_mark:
- Create a Lambda function waiting 5 seconds and resolving :white_check_mark:
- Create a Lambda function waiting 3 seconds and rejecting :white_check_mark:
- Attach the lambda functions to :white_check_mark:
  - `POST /async/resolve` & `POST /async/reject`
  - `POST /sync/resolve` & `POST sync/reject`
- ~~Create 4 lambda functions invoking the API, one for each method~~ Create function to generate webhook
- Optional: Pack in VPC
- Provide a cost estimation

https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html
https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigatewayv2.HttpApi.html

## Notes

- Supported for REST API only?
- `curl -X POST https://6dqljh52v5.execute-api.eu-west-1.amazonaws.com/prod/generate-webhook -H "Content-Type: application/json" --data '{"path": "/sync/resolve"}'  
{"message":"Webhook sent to /sync/resolve"}`
