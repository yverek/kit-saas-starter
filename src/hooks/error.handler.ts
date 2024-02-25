import { logger } from "$lib/logger";
import type { HandleServerError } from "@sveltejs/kit";

export const handleError: HandleServerError = ({ status, message, error }) => {
  logger.error(error);

  // do not return sensitive data here as it will be sent to the client
  return { message };
};
