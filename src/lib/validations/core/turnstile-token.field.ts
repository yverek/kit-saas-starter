import { z } from "zod";

const turnstileTokenField = z.string({ required_error: "Turnstile token is required" });

export { turnstileTokenField };
