import { deleteUserById, getAllUsers } from "$lib/server/db/users";
import { type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { setFlash } from "sveltekit-flash-message/server";
import { FLASH_MESSAGE_STATUS } from "$configs/general";
import { logger } from "$lib/logger";
import { deleteUserFormSchema, type DeleteUserFormSchema } from "$validations/admin/database/users.schema";

export const load = (async ({ locals }) => {
  const users = await getAllUsers(locals.db);

  return { users };
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
    const flashMessage: FlashMessage = { status: FLASH_MESSAGE_STATUS.SUCCESS, text: "User successfully deleted!" };
    let form: DeleteUserFormSchema;

    const data = Object.fromEntries(await request.formData());
    try {
      form = deleteUserFormSchema.parse(data);
    } catch (error) {
      logger.debug("Invalid form");
      flashMessage.status = FLASH_MESSAGE_STATUS.ERROR;
      flashMessage.text = "Invalid form!";
      setFlash(flashMessage, cookies);
      return;
    }

    const deletedUser = await deleteUserById(db, form.userId);
    if (!deletedUser) {
      logger.debug("Something went wrong");
      flashMessage.status = FLASH_MESSAGE_STATUS.ERROR;
      flashMessage.text = "Something went wrong!";

      setFlash(flashMessage, cookies);
      return;
    }

    setFlash(flashMessage, cookies);
  }
};
