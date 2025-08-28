import { db } from "@/lib/drizzle/db";
import { users } from "@/lib/drizzle/schema";

export async function getUsers() {
  const profilesData = await db
    .select({
      id: users.id,
      name: users.name,
      avatar_url: users.avatar_url,
    })
    .from(users);

  return profilesData;
}
