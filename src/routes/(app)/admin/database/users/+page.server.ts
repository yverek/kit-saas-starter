import { deleteUserById, getAllUsers } from "$lib/server/db/users";
import { type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { setFlash } from "sveltekit-flash-message/server";
import { superValidate } from "sveltekit-superforms";
import { updateUserFormSchema, type UpdateUserFormSchema } from "$validations/app/update-user.schema";
import { zod } from "sveltekit-superforms/adapters";

export const load = (async ({ locals }) => {
  const users = await getAllUsers(locals.db);

  const form = await superValidate<UpdateUserFormSchema, FlashMessage>(zod(updateUserFormSchema));

  return { form, users };
}) satisfies PageServerLoad;

export const actions: Actions = {
  updateUser: async ({ request, cookies, locals: { db } }) => {
    // TODO switch to zod
    const data = await request.formData();
    const userId = data.get("userId") as string;

    const res = await deleteUserById(db, userId);
    if (res) {
      setFlash({ status: "success", text: "Success!" }, cookies);
      return;
    }

    setFlash({ status: "error", text: "Error" }, cookies);
  },

  deleteUser: async ({ request, cookies, locals: { db } }) => {
    // TODO switch to zod
    const data = await request.formData();
    const userId = data.get("userId") as string;

    const res = await deleteUserById(db, userId);
    if (res) {
      setFlash({ status: "success", text: "Success!" }, cookies);
      return;
    }

    setFlash({ status: "error", text: "Error" }, cookies);
  }
};
