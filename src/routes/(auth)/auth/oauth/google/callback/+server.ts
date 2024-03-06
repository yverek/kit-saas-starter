import type { RequestHandler } from "./$types";

import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";

import { route } from "$lib/ROUTES";

import { GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME, GOOGLE_OAUTH_STATE_COOKIE_NAME } from "$configs/general";
import { error } from "@sveltejs/kit";
import { googleOauth } from "$lib/server/auth";
import { redirect } from "sveltekit-flash-message/server";
import { logger } from "$lib/logger";
import { createUser, getUserByEmail, updateUserById } from "$lib/server/db/users";
import { createOauthAccount, getOAuthAccountByProviderUserId } from "$lib/server/db/oauth-accounts";
import { createAndSetSession } from "$lib/server/auth/auth-utils";

type GoogleUser = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
};

export const GET: RequestHandler = async ({ cookies, url, locals: { db, lucia } }) => {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const stateCookie = cookies.get(GOOGLE_OAUTH_STATE_COOKIE_NAME);
  const codeVerifierCookie = cookies.get(GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME);

  // Validate OAuth state and code verifier
  if (!code || !state || !stateCookie || !codeVerifierCookie || state !== stateCookie) {
    error(400, "Invalid OAuth state or code verifier");
  }

  try {
    const tokens = await googleOauth.validateAuthorizationCode(code, codeVerifierCookie);

    const googleUserResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`
      }
    });

    const googleUser = (await googleUserResponse.json()) as GoogleUser;

    if (!googleUser.email) {
      error(400, "No primary email address");
    }

    if (!googleUser.email_verified) {
      error(400, "Unverified email");
    }

    // Check if the user already exists
    const existingUser = await getUserByEmail(db, googleUser.email);

    if (existingUser) {
      // Check if the user already has a Google OAuth account linked
      const existingOauthAccount = await getOAuthAccountByProviderUserId(db, "google", googleUser.sub);

      if (!existingOauthAccount) {
        // Add the 'google' auth provider to the user's authMethods list
        const authMethods = existingUser.authMethods || [];
        authMethods.push("google");

        // ! this should be a transaction, but right now D1 doesn't support them yet
        // Link the Google OAuth account to the existing user
        const newOauthAccount = await createOauthAccount(db, {
          userId: existingUser.id,
          providerId: "google",
          providerUserId: googleUser.sub
        });
        if (!newOauthAccount) {
          error(400, "Something went wrong");
        }

        // Update the user's authMethods list
        const updatedUser = await updateUserById(db, existingUser.id, { authMethods });
        if (!updatedUser) {
          error(400, "Something went wrong");
        }
        // ! end of transaction
      }

      await createAndSetSession(lucia, existingUser.id, cookies);
    } else {
      // Create a new user and their OAuth account
      const userId = generateId(15);

      // ! this should be a transaction, but right now D1 doesn't support them yet
      const newUser = await createUser(db, {
        id: userId,
        name: googleUser.name,
        avatarUrl: googleUser.picture,
        email: googleUser.email,
        isVerified: true,
        authMethods: ["google"]
      });
      if (!newUser) {
        error(400, "Something went wrong");
      }

      const newOauthAccount = await createOauthAccount(db, {
        userId,
        providerId: "google",
        providerUserId: googleUser.sub
      });
      if (!newOauthAccount) {
        error(400, "Something went wrong");
      }
      // ! end of transaction

      await createAndSetSession(lucia, userId, cookies);
    }
  } catch (e) {
    logger.error(e);

    if (e instanceof OAuth2RequestError) {
      error(400);
    }

    error(500);
  }

  redirect(303, route("/dashboard"));
};
