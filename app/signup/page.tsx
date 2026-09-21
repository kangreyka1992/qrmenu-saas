"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Если Supabase требует подтверждение email — data.user может быть null
    if (!data.user) {
      setLoading(false);
      alert("Проверьте почту — нужно подтвердить email.");
      router.push("/login");
      return;
    }

    // Проверяем профиль (новый пользователь точно не админ)
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", data.user.id)
      .single();

    setLoading(false);

    if (profile?.is_admin) {
      router.push("/admin");
    } else {
      router.push("/#tariffs");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md bg-[#111] p-8 rounded-2xl border border-gray-800"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Регистрация</h1>

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
          placeholder="Пароль (мин. 6 символов)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-4 py-3 mb-6 rounded-lg bg-[#1a1a1a] border border-gray-700 focus:border-orange-500 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-black font-semibold rounded-lg disabled:opacity-50"
        >
          {loading ? "Создаём аккаунт..." : "Зарегистрироваться"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Уже есть аккаунт?{" "}
          <a href="/login" className="text-orange-500 hover:underline">
            Войти
          </a>
        </p>
      </form>
    </div>
  );
}