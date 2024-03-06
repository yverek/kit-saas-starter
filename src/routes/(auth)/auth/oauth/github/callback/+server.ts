import type { RequestHandler } from "./$types";

import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";

import { route } from "$lib/ROUTES";
import { GITHUB_OAUTH_STATE_COOKIE_NAME } from "$configs/general";
import { error } from "@sveltejs/kit";
import { githubOauth } from "$lib/server/auth";
import { createUser, getUserByEmail, updateUserById } from "$lib/server/db/users";
import { createOauthAccount, getOAuthAccountByProviderUserId } from "$lib/server/db/oauth-accounts";
import { createAndSetSession } from "$lib/server/auth/auth-utils";
import { logger } from "$lib/logger";
import { redirect } from "sveltekit-flash-message/server";

type GitHubUser = {
  id: number;
  login: string;
  avatar_url: string;
  name: string;
};

type GitHubEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
};

export const GET: RequestHandler = async ({ url, cookies, locals: { db, lucia } }) => {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies.get(GITHUB_OAUTH_STATE_COOKIE_NAME);

  if (!code || !state || !storedState || state !== storedState) {
    error(400, "Invalid OAuth state or code verifier");
  }

  try {
    // Validate the authorization code and retrieve the tokens
    const tokens = await githubOauth.validateAuthorizationCode(code);

    // Fetch the GitHub user associated with the access token
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`
      }
    });

    // Fetch the primary email address of the GitHub user
    const githubEmailResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`
      }
    });

    const githubUser = (await githubUserResponse.json()) as GitHubUser;
    const githubEmail = (await githubEmailResponse.json()) as GitHubEmail[];

    const primaryEmail = githubEmail.find((email) => email.primary) ?? null;

    if (!primaryEmail) {
      error(400, "No primary email address");
    }

    if (!primaryEmail.verified) {
      error(400, "Unverified email");
    }

    // Check if the user already exists
    const existingUser = await getUserByEmail(db, primaryEmail.email);

    if (existingUser) {
      // Check if the user already has a GitHub OAuth account linked
      const existingOauthAccount = await getOAuthAccountByProviderUserId(db, "github", githubUser.id.toString());

      if (!existingOauthAccount) {
        // Add the 'github' auth provider to the user's authMethods list
        const authMethods = existingUser.authMethods || [];
        authMethods.push("github");

        // ! this should be a transaction, but right now D1 doesn't support them yet
        // Link the GitHub OAuth account to the existing user
        const newOauthAccount = await createOauthAccount(db, {
          userId: existingUser.id,
          providerId: "github",
          providerUserId: githubUser.id.toString()
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
        name: githubUser.name,
        avatarUrl: githubUser.avatar_url,
        email: primaryEmail.email,
        isVerified: true,
        authMethods: ["github"]
      });
      if (!newUser) {
        error(400, "Something went wrong");
      }

      const newOauthAccount = await createOauthAccount(db, {
        userId,
        providerId: "github",
        providerUserId: githubUser.id.toString()
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
