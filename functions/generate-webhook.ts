import { Logger } from "@aws-lambda-powertools/logger";
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
  Context,
} from "aws-lambda";

const logger = new Logger({ serviceName: "reject-catch" });

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyStructuredResultV2> => {
  logger.addContext(context);
  const { path } = JSON.parse(event.body!);

  const url = `${process.env.API_GATEWAY_URL}${path}`;
  logger.info(`Sending webhook to ${path}`);

  const response = await fetch(url, {
    method: "POST",
  });

  logger.info(
    `Webhook response: ${response.status}: ${JSON.stringify(response.body)}`
  );

  if (!response.ok) {
    logger.error(`I don't know how to handle that?`);
  }

  return {
    statusCode: response.status,
    body: JSON.stringify({
      message: `Webhook sent to ${url}`,
      response: {
        status: response.status,
        body: response.body,
      },
    }),
  };
};
