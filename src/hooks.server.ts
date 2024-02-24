import { sequence } from "@sveltejs/kit/hooks";
import { auth } from "./hooks/auth.handler";
import { database } from "./hooks/database.handler";

export { handleError } from "./hooks/error.handler";

export const handle = sequence(database, auth);
