"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const user = data.user;
    if (!user) {
      setError("Не удалось получить пользователя");
      setLoading(false);
      return;
    }

    // Проверяем, админ ли пользователь
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    setLoading(false);

    if (profile?.is_admin) {
      router.push("/admin");
    } else {
      router.push("/#tariffs"); // главная с тарифами
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-[#111] p-8 rounded-2xl border border-gray-800"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Вход</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-900/40 border border-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 mb-3 rounded-lg bg-[#1a1a1a] border border-gray-700 focus:border-orange-500 outline-none"
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 mb-6 rounded-lg bg-[#1a1a1a] border border-gray-700 focus:border-orange-500 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-black font-semibold rounded-lg disabled:opacity-50"
        >
          {loading ? "Входим..." : "Войти"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Нет аккаунта?{" "}
          <a href="/signup" className="text-orange-500 hover:underline">
            Зарегистрироваться
          </a>
        </p>
      </form>
    </div>
  );
}