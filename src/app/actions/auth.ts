"use server";

import { db } from "@/lib/drizzle/db";
import { redirect as nextRedirect } from "next/navigation";

import { users, sessions } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import {
  hashPassword,
  comparePassword,
  createSession,
  deleteSession,
} from "@/lib/auth";
import { cookies } from "next/headers";

export async function register(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return nextRedirect("/login?message=email and password required");
  }

  const existingUser = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.email, email));

  if (!existingUser) {
    return nextRedirect("/login?message=user already exists");
  }

  const hashedPassword = await hashPassword(password);

  const [newUser] = await db
    .insert(users)
    .values({
      name: "sample-name",
      email,
      password_hash: hashedPassword,
      avatar_url: getRandomAvatar(),
    })
    .returning();

  if (!newUser) {
    return nextRedirect("/login?message=Failed to register user");
  }

  const sessionToken = await createSession(newUser.id);
  (await cookies()).set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return nextRedirect("/");
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return nextRedirect("/login?message=Email and password are required");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    return nextRedirect("/login?message=Invalid credentials");
  }

  const passwordMatch = await comparePassword(password, user.password_hash);

  if (!passwordMatch) {
    return nextRedirect("/login?message=Invalid credentials");
  }

  const sessionToken = await createSession(user.id);
  (await cookies()).set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return nextRedirect("/");
}

export async function logout() {
  const sessionToken = (await cookies()).get("session")?.value;
  if (sessionToken) {
    await deleteSession(sessionToken);
  }
  (await cookies()).delete("session");
  return { success: true };
}

function getRandomAvatar() {
  const gender = Math.floor(Math.random() * 2);
  const picture = Math.floor(Math.random() * 99);

  const genderString = gender % 2 == 0 ? "woman" : "man";

  return `https://randomuser.me/api/portraits/${genderString}/${picture}.jpg`;
}
