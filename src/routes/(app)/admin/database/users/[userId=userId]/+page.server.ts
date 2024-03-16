import { getUserById } from "$lib/server/db/users";
import { error, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { setFlash } from "sveltekit-flash-message/server";
import { FLASH_MESSAGE_STATUS } from "$configs/general";
import { logger } from "$lib/logger";
import { superValidate } from "sveltekit-superforms";
import { updateUserFormSchema, type UpdateUserFormSchema } from "$validations/admin/database/users.schema";
import { zod } from "sveltekit-superforms/adapters";

export const load = (async ({ locals, params }) => {
  const { userId } = params;
  const user = await getUserById(locals.db, userId);
  if (!user) {
    error(404, "User not found");
  }

  const form = await superValidate<UpdateUserFormSchema, FlashMessage>(user, zod(updateUserFormSchema));

  return { form, user };
}) satisfies PageServerLoad;

// export const actions: Actions = {
//   updateUser: async ({ request, cookies, locals: { db } }) => {
//     // TODO switch to zod
//     const data = await request.formData();
//     const userId = data.get("userId") as string;

//     const res = await deleteUserById(db, userId);
//     if (res) {
//       setFlash({ status: "success", text: "Success!" }, cookies);
//       return;
//     }

//     setFlash({ status: "error", text: "Error" }, cookies);
//   }
// };
