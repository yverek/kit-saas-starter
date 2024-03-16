import { z } from "zod";
import type { Infer } from "sveltekit-superforms";
import { nameField, userIdField } from "$validations/core";

export const deleteUserFormSchema = z.object({ userId: userIdField });
export type DeleteUserFormSchema = Infer<typeof deleteUserFormSchema>;

// TODO implement this schema
export const updateUserFormSchema = z.object({ name: nameField });
export type UpdateUserFormSchema = Infer<typeof updateUserFormSchema>;
