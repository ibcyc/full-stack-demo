"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // 1. 引入路由工具
import { registerUser, loginUser } from "./actions";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter(); // 2. 初始化 router

  async function clientAction(formData: FormData) {
    setMessage("處理中...");
    const result = isLogin ? await loginUser(formData) : await registerUser(formData);
    
    setMessage(result.message);

    // --- 關鍵修改處 ---
    if (result.success) {
      if (isLogin) {
        // 如果是「登入」成功，直接跳轉到 profile 頁面
        // 注意：確保你已經建立了 app/profile/page.tsx
        router.push("/profile"); 
      } else {
        // 如果是「註冊」成功，切換到登入介面讓使用者登入
        setIsLogin(true);
      }
    }
    // ----------------
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-24">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-black">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "登入帳號" : "註冊新帳號"}
        </h2>
        
        <form action={clientAction} className="flex flex-col gap-4">
          <input 
            name="account" 
            type="text" 
            placeholder="請輸入帳號"
            className="border p-2 rounded outline-blue-500"
            required
          />

          <input 
            name="password" 
            type="password" 
            placeholder="請輸入密碼"
            className="border p-2 rounded outline-blue-500"
            required
          />

          <button 
            type="submit"
            className="bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition"
          >
            {isLogin ? "登入" : "立即註冊"}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center text-sm ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

        <p className="text-sm text-center text-gray-500 mt-6">
          {isLogin ? "還沒有帳號嗎？" : "已經有帳號了？"}
          <span 
            onClick={() => { setIsLogin(!isLogin); setMessage(""); }}
            className="text-blue-500 cursor-pointer hover:underline ml-1"
          >
            {isLogin ? "立即註冊" : "按此登入"}
          </span>
        </p>
      </div>
    </main>
  );
}