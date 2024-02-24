// import { drizzle } from "drizzle-orm/d1";
// import { dev } from "$app/environment";

// import * as schema from "$lib/server/db/schema";
// import { initializeLucia } from "$lib/server/lucia";
// import { handleError } from "./hooks/error.handler";
import { sequence } from "@sveltejs/kit/hooks";
import { auth } from "./hooks/auth.handler";
import { database } from "./hooks/database.handler";

export { handleError } from "./hooks/error.handler";

export const handle = sequence(database, auth);
