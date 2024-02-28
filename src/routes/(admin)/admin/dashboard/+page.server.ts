import { route } from "$lib/ROUTES";
import { deleteUserById, getAllUsers } from "$lib/server/db/user";
import { type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { redirect, setFlash } from "sveltekit-flash-message/server";

export const load = (async ({ locals, cookies }) => {
  if (!locals.user) redirect(route("/auth/login"), { status: "error", text: "You must be logged in to view the dashboard." }, cookies);
  // if (locals.user.admin) redirect(302, route("/dashboard"));

  const users = await getAllUsers(locals.db);

  return { users };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ request, cookies, locals: { db } }) => {
    const data = await request.formData();
    const userId = data.get("userId") as string;
    console.log("🚀 ~ userId:", userId);
    const res = await deleteUserById(db, userId);
    if (res) {
      setFlash({ status: "success", text: "Success!" }, cookies);
      return;
    }

    setFlash({ status: "error", text: "Error" }, cookies);
  }
};
