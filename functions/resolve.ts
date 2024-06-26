import { Logger } from "@aws-lambda-powertools/logger";
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
  Context,
} from "aws-lambda";

const logger = new Logger({ serviceName: "resolve" });

const waitingPeriodSeconds = 5;

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyStructuredResultV2> => {
  logger.addContext(context);

  logger.info(`Waiting ${waitingPeriodSeconds} seconds ...`);
  await new Promise((resolve) =>
    setTimeout(resolve, waitingPeriodSeconds * 1000)
  );

  logger.info("Waiting done!");
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Waiting done" }),
  };
};
