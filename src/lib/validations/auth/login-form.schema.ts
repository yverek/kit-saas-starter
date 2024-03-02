import { z } from "zod";
import { emailField, passwordField } from "$validations/core";

const loginFormSchema = z.object({ email: emailField, password: passwordField });

export { loginFormSchema };
