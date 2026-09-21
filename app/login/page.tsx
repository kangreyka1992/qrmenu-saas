"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    setLoading(false);

    const plan = searchParams.get("plan");

    if (profile?.is_admin) {
      router.push("/dashboard");
    } else if (plan) {
      router.push(`/tariffs?plan=${encodeURIComponent(plan)}&autoPay=1`);
    } else {
      router.push("/tariffs");
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <LoginContent />
    </Suspense>
  );
}