import { logger } from "$lib/server/logger";
import type { HandleServerError } from "@sveltejs/kit";

export const handleError: HandleServerError = ({ status, error, message }) => {
  if (status !== 404) {
    logger.error(error);
  }

  // do not return sensitive data here as it will be sent to the client
  return { message };
};
