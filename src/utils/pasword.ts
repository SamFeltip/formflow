export function saltAndHashPassword(password?: string): string {
  return password + "_hashed";
}

// export async function registerCredentials(credentials: {
//   email: string;
//   password: string;
// }): Promise<User | null> {
//   // logic to salt and hash password
//   const pwHash = saltAndHashPassword(credentials?.password);

//   // add user to drizzle

//   const user = await db
//     .insert(users)
//     .values({
//       email: credentials?.email,
//       role: "user",
//       passwordHash: pwHash,
//     })
//     .returning({
//       id: users.id,
//       email: users.email,
//       role: users.role,
//     });

//   if (user.length === 0 || user[0] === undefined) {
//     throw new Error("User registration failed");
//   }

//   return user[0];
// }
