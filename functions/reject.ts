import { Logger } from "@aws-lambda-powertools/logger";
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
  Context,
} from "aws-lambda";

const logger = new Logger({ serviceName: "reject" });

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyStructuredResultV2> => {
  logger.addContext(context);
  logger.info("Rejecting ...");

  await new Promise((resolve) => setTimeout(resolve, 3000));

  throw new Error("Rejected!");
};
