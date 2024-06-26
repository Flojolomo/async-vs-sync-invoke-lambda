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
  try {
    logger.addContext(context);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    logger.info("Rejecting ...");
    throw new Error("Rejected!");
  } catch (err) {
    logger.error("Caught error", { err });
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Caught error" }),
    };
  }
};
