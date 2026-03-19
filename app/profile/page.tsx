import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileClient from "./ProfileClient"; // 我們將互動部分拆分出去，保持結構清晰

export default async function ProfilePage() {
  // 1. 伺服器端檢查 Cookie
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/"); // 沒登入就踢回首頁
  }

  // 2. 抓取資料庫中最新的使用者資料
  const user = await prisma.profile.findUnique({
    where: { id: parseInt(userId) },
    select: { id: true, account: true }, // 不要把密碼抓到前端
  });

  if (!user) {
    redirect("/"); // 找不到使用者也踢走
  }

  // 3. 將資料交給 Client Component 處理互動
  return <ProfileClient user={user} />;
}