"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUser, deleteUser } from "../actions"; // 引入刪除 Action

export default function ProfilePage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  
  // 假設這是目前的使用者狀態
  const [user, setUser] = useState({ 
    id: 1, 
    account: "current_user" 
  });

  // 修改邏輯
  async function handleUpdate(formData: FormData) {
    setMessage("處理中...");
    const result = await updateUser(formData);
    setMessage(result.message);
    if (result.success) {
      setUser(prev => ({ ...prev, account: formData.get("newAccount") as string }));
    }
  }

  // 刪除邏輯
  async function handleDelete() {
    const isConfirmed = window.confirm("確定要永久刪除帳號嗎？此動作無法復原！");
    
    if (isConfirmed) {
      const formData = new FormData();
      formData.append("id", user.id.toString());
      
      const result = await deleteUser(formData);
      
      if (result.success) {
        alert("帳號已刪除，即將返回首頁。");
        router.push("/"); // 執行跟登出一樣的行為：跳回登入頁
      } else {
        setMessage(result.message);
      }
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4 text-black">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">個人資料設定</h2>
        
        {/* 修改表單 */}
        <form action={handleUpdate} className="flex flex-col gap-5">
          <input type="hidden" name="id" value={user.id} />
          
          <div>
            <label className="text-xs text-gray-400 ml-1">帳號名稱</label>
            <input 
              name="newAccount"
              type="text" 
              defaultValue={user.account}
              className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 ml-1">新密碼</label>
            <input 
              name="newPassword"
              type="password" 
              placeholder="輸入新密碼"
              className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button type="submit" className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md">
            儲存變更
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center text-sm font-medium ${message.includes("✅") ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
          {/* 登出按鈕 */}
          <button 
            onClick={() => router.push("/")}
            className="w-full text-gray-500 py-2 text-sm hover:underline"
          >
            登出帳號
          </button>

          {/* 刪除按鈕 */}
          <button 
            onClick={handleDelete}
            className="w-full bg-red-50 text-red-600 py-3 rounded-lg font-bold hover:bg-red-100 transition"
          >
            永久刪除帳號
          </button>
        </div>
      </div>
    </main>
  );
}