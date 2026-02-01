import { betterAuth } from "better-auth";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema";

const rawAdminEmail = process.env.ADMIN_EMAIL;
const adminEmail = rawAdminEmail?.trim().toLowerCase();

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL ?? "https://blog.ddev.site",
    plugins: [tanstackStartCookies()],
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema,
        camelCase: true,
    }),
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID ?? "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
        }
    },
    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            const pathsToCheck = ["/sign-up/email", "/sign-in/email"];
            if (!pathsToCheck.includes(ctx.path)) {
                return;
            }
            const userEmail = ctx.body?.email as string | undefined;
            const userEmailNormalized = userEmail?.trim().toLowerCase();
            if (!userEmailNormalized || userEmailNormalized !== adminEmail) {
                if (userEmail) {
                    console.warn(`Unauthorized login attempt by: ${userEmail}`);
                }
                throw new APIError("UNAUTHORIZED", {
                    message: "Get the Fuck out of here.",
                });
            }
        }),
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    if (!adminEmail) {
                        console.error("ADMIN_EMAIL is not set in .env");
                        throw new Error(
                            "Server misconfiguration: ADMIN_EMAIL is not set. Only the admin email can sign up.",
                        );
                    }
                    const userEmailNormalized = user.email?.trim().toLowerCase();
                    if (userEmailNormalized !== adminEmail) {
                        console.warn(`Unauthorized sign-up attempt by: ${user.email}`);
                        throw new Error(
                            "Only the admin email is allowed to create an account. Check that ADMIN_EMAIL in .env matches your GitHub email.",
                        );
                    }
                    return { data: user };
                },
            },
        },
    },
});
