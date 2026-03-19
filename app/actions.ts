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

// 3. 更改邏輯
export async function updateUser(formData: FormData) {
  // 從隱藏欄位取得 id
  const userId = parseInt(formData.get("id") as string); 
  const newAccount = formData.get("newAccount") as string;
  const newPassword = formData.get("newPassword") as string;

  try {
    // 1. 檢查新帳號是否被「其他人」佔用 (排除掉自己)
    const existingUser = await prisma.profile.findFirst({
      where: { 
        account: newAccount,
        NOT: { id: userId } // 排除掉目前正在修改的這個人
      },
    });

    if (existingUser) {
      return { success: false, message: "❌ 此帳號已被他人使用！" };
    }

    // 2. 使用唯一 ID 進行更新
    await prisma.profile.update({
      where: { id: userId },
      data: {
        account: newAccount,
        password: newPassword,
      },
    });

    return { success: true, message: "✅ 資料已更新成功！" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "❌ 更新失敗，請稍後再試。" };
  }
}

// 4. 刪除邏輯
export async function deleteUser(formData: FormData) {
  const userId = parseInt(formData.get("id") as string);

  try {
    await prisma.profile.delete({
      where: { id: userId },
    });
    return { success: true, message: "✅ 帳號已永久刪除。" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "❌ 刪除失敗，請稍後再試。" };
  }
}