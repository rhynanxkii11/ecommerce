'use server';

import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { guests } from "@/lib/db/schema/index";
import { cookies, headers } from "next/headers";
import { randomUUID } from "crypto";
import { and, eq, lt } from "drizzle-orm";

const COOKIE_OPTIONS = {
  httpOnly: true as const,
  secure: true as const,
  sameSite: "strict" as const,
  path: "/" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

const signUpSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email(),
  password: z.string().min(8),
});

// const signInSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(8),
// });

export async function createGuestSession() {
  const cookieStore = await cookies();
  const existing = (await cookieStore).get("guest_session");
  if (existing?.value) {
    return { ok: true, sessionToken: existing.value };
  }

  const sessionToken = randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + COOKIE_OPTIONS.maxAge * 1000);

  await db.insert(guests).values({
    sessionToken,
    expiresAt,
  });

  (await cookieStore).set("guest_session", sessionToken, COOKIE_OPTIONS);
  return { ok: true, sessionToken };
}

export async function getGuestSession() {
  const cookieStore = await cookies();
  const token = (await cookieStore).get("guest_session")?.value;
  if (!token) {
    return { sessionToken: null };
  }
  const now = new Date();
  await db
    .delete(guests)
    .where(and(eq(guests.sessionToken, token), lt(guests.expiresAt, now)));

  return { sessionToken: token };
}

export async function signUp(formData: FormData) {
  const payload = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const parsed = signUpSchema.parse(payload);

  const res = await auth.api.signUpEmail({
    body: {
      email: parsed.email,
      password: parsed.password,
      name: parsed.name!
    }
  });

  await migrateGuestToUser();
  return { ok: true, userId: res.user?.id };
  // check if user exists
  // const existing = await db
  //   .select()
  //   .from(users)
  //   .where(eq(users.email, parsed.email))
  //   .limit(1)
  //   .then((r) => r[0]);

  // if (existing) {
  //   throw new Error("Email already in use");
  // }

  // const hashed = await bcrypt.hash(parsed.password, 10);

  // // create user
  // const [createdUser] = await db
  //   .insert(users)
  //   .values({
  //     name: parsed.name ?? null,
  //     email: parsed.email,
  //     emailVerified: false,
  //     image: null,
  //   })
  //   .returning();

  // // create credentials account row (password stored hashed)
  // await db.insert(accounts).values({
  //   userId: createdUser.id,
  //   accountId: parsed.email,
  //   providerId: "credentials",
  //   password: hashed,
  // });

  // // create auth session
  // const token = uuidv4();
  // const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

  // await db.insert(sessions).values({
  //   userId: createdUser.id,
  //   token,
  //   expiresAt,
  //   ipAddress: null,
  //   userAgent: null,
  // });

  // // set auth cookie
  // cookies().set({
  //   name: AUTH_COOKIE,
  //   value: token,
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "strict",
  //   path: "/",
  //   maxAge: SESSION_MAX_AGE,
  // });

  // // migrate guest data (cart) if present and clear guest session
  // const guestToken = cookies().get(GUEST_COOKIE)?.value;
  // if (guestToken) {
  //   await mergeGuestCartWithUserCart({ guestToken, userId: createdUser.id });
  //   // clear guest cookie
  //   cookies().set({
  //     name: GUEST_COOKIE,
  //     value: "",
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === "production",
  //     sameSite: "strict",
  //     path: "/",
  //     maxAge: 0,
  //   });
  // }

  // return { user: createdUser };
}

export async function signIn(formData: FormData) {
  const payload = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const parsed = signUpSchema.parse(payload);

  const res = await auth.api.signInEmail({
    body: {
      email: parsed.email,
      password: parsed.password,
    }
  });

  await migrateGuestToUser();
  return { ok: true, userId: res.user?.id };
  // const parsed = signInSchema.parse(payload);

  // // find credentials account
  // const accountRow = await db
  //   .select()
  //   .from(accounts)
  //   .where(and(eq(accounts.providerId, "credentials"), eq(accounts.accountId, parsed.email)))
  //   .limit(1)
  //   .then((r) => r[0]);

  // if (!accountRow || !accountRow.password) {
  //   throw new Error("Invalid credentials");
  // }

  // const isValid = await bcrypt.compare(parsed.password, accountRow.password);
  // if (!isValid) {
  //   throw new Error("Invalid credentials");
  // }

  // // fetch user
  // const [userRow] = await db
  //   .select()
  //   .from(users)
  //   .where(eq(users.id, accountRow.userId))
  //   .limit(1)
  //   .then((r) => r);

  // if (!userRow) {
  //   throw new Error("User not found");
  // }

  // // create session
  // const token = uuidv4();
  // const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

  // await db.insert(sessions).values({
  //   userId: userRow.id,
  //   token,
  //   expiresAt,
  //   ipAddress: null,
  //   userAgent: null,
  // });

  // // set cookie
  // cookies().set({
  //   name: AUTH_COOKIE,
  //   value: token,
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "strict",
  //   path: "/",
  //   maxAge: SESSION_MAX_AGE,
  // });

  // // migrate guest data if present
  // const guestToken = cookies().get(GUEST_COOKIE)?.value;
  // if (guestToken) {
  //   await mergeGuestCartWithUserCart({ guestToken, userId: userRow.id });
  //   cookies().set({
  //     name: GUEST_COOKIE,
  //     value: "",
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === "production",
  //     sameSite: "strict",
  //     path: "/",
  //     maxAge: 0,
  //   });
  // }

  // return { user: userRow };
}

export async function getCurrentUser() {
  try {  
    const session = await auth.api.getSession({
        headers: await headers()
    });

    return session?.user ?? null;
  } catch (e) {
    console.error("Error fetching current user:", e);

    return null;
  }
}

export async function signOut() {
  // const token = cookies().get(AUTH_COOKIE)?.value;
  // if (token) {
  //   await db.delete(sessions).where(eq(sessions.token, token));
  // }

  // // clear auth cookie
  // cookies().set({
  //   name: AUTH_COOKIE,
  //   value: "",
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "strict",
  //   path: "/",
  //   maxAge: 0,
  // });

  // return { ok: true };
}

/**
 * Merge guest cart (or other guest-owned resources) into the user's account.
 * - This is intentionally generic — cart implementation is outside MVP.
 * - This function must be called after successful sign in / sign up.
 */
export async function mergeGuestCartWithUserCart() {
  // const { guestToken, userId } = opts;

  // 1) attempt to load guest record
  // const guest = await db
  //   .select()
  //   .from(guests)
  //   .where(eq(guests.sessionToken, guestToken))
  //   .limit(1)
  //   .then((r) => r[0]);

  // if (!guest) {
  //   return { migrated: false };
  // }

  // 2) Placeholder: migrate guest-owned resources (cart, preferences, etc.)
  //    - Implement actual logic here: move rows from guest-owned tables to user-owned tables,
  //      run deduplication, recalc totals, etc.
  // Example (pseudo):
  // await db.update(carts).set({ userId }).where(eq(carts.guestId, guest.id));

  // 3) Remove guest record so token can't be reused
  // await db.delete(guests).where(eq(guests.id, guest.id));
  await migrateGuestToUser();
  return { ok: true };
}

async function migrateGuestToUser() {
  const cookieStore = await cookies();
  const token = (await cookieStore).get("guest_session")?.value;
  if (!token) return;

  await db.delete(guests).where(eq(guests.sessionToken, token));
  (await cookieStore).delete("guest_session");
}