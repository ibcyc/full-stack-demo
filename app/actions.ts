"use server"; // 關鍵！這行告訴 Next.js 這是跑在伺服器端的安全代碼

import { prisma } from "@/lib/prisma";

// 1. 註冊邏輯
export async function registerUser(formData: FormData) {
  const account = formData.get("account") as string;
  const password = formData.get("password") as string;

  // 檢查帳號是否已存在
  const existingUser = await prisma.profile.findFirst({
    where: { account: account },
  });

  if (existingUser) {
    return { success: false, message: "❌ 此帳號已被註冊過囉！" };
  }

  // 存入資料庫
  await prisma.profile.create({
    data: {
      account: account,
      password: password, // 實務建議加密，這裡先示範存入
    },
  });

  return { success: true, message: "✅ 註冊成功！現在可以登入囉。" };
}

// 2. 登入邏輯
export async function loginUser(formData: FormData) {
  const account = formData.get("account") as string;
  const password = formData.get("password") as string;

  // 去資料庫找這個人
  const user = await prisma.profile.findFirst({
    where: { account: account },
  });

  if (!user || user.password !== password) {
    return { success: false, message: "❌ 帳號或密碼錯誤，請再試一次。" };
  }

  return { success: true, message: `👋 歡迎回來，${user.account}！` };
}