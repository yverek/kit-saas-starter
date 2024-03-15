import { deleteUserById, getAllUsers } from "$lib/server/db/users";
import { type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { setFlash } from "sveltekit-flash-message/server";

export const load = (async ({ locals }) => {
  const users = await getAllUsers(locals.db);

  return { users };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ request, cookies, locals: { db } }) => {
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
