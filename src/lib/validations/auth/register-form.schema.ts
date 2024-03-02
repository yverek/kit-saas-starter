import { z } from "zod";
import { nameField, emailField, passwordField, passwordConfirmField, passwordConfirmMustBeEqualToPassword } from "$validations/core";

const registerFormSchema = z
  .object({ name: nameField, email: emailField, password: passwordField, passwordConfirm: passwordConfirmField })
  .superRefine(passwordConfirmMustBeEqualToPassword);

export { registerFormSchema };
