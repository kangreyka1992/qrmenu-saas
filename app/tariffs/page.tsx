"use client";

import { useState } from "react";

type Plan = {
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
};

const plans: Plan[] = [
  {
    name: "Старт",
    price: 2490,
    features: [
      "1 заведение",
      "Безлимит блюд",
      "Свой логотип",
      "QR-код для печати",
      "Обновление в реальном времени",
    ],
  },
  {
    name: "Бизнес",
    price: 5199,
    popular: true,
    features: [
      "До 3 заведений",
      "Всё из «Старт»",
      "Мультиязычность",
      "Аналитика просмотров",
      "Онлайн-заказ",
    ],
  },
  {
    name: "Сеть",
    price: 9900,
    features: [
      "До 10 заведений",
      "Всё из «Бизнес»",
      "Свой домен",
      "API для интеграций",
      "Приоритетная поддержка",
    ],
  },
];

export default function TariffsPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const handlePayment = async (plan: Plan) => {
    if (!email || !email.includes("@")) {
      alert("Введите корректный email — на него придёт чек.");
      return;
    }

    setLoading(plan.name);
    const orderId = Date.now().toString();

    try {
      const res = await fetch("/api/robokassa/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: plan.price,
          orderId,
          description: `Подписка «${plan.name}»`,
          email,
        }),
      });

      const data = await res.json();
      setLoading(null);

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert("Ошибка: " + (data.error || "неизвестная"));
      }
    } catch (e) {
      setLoading(null);
      alert("Ошибка сети: " + e);
    }
  };

  return (
    <section className="min-h-screen bg-[#0a0a0a] text-white px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4">Тарифы</h1>

        {/* Поле email — нужно для чека от Робокассы */}
        <div className="max-w-md mx-auto mb-12">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ваш email для чека"
            className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-700 focus:border-orange-500 outline-none text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 border ${
                plan.popular
                  ? "border-orange-500 bg-[#141414] shadow-[0_0_40px_-10px_rgba(249,115,22,0.5)]"
                  : "border-gray-800 bg-[#111111]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-black text-xs font-bold px-4 py-1 rounded-full">
                  ПОПУЛЯРНЫЙ
                </div>
              )}

              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <div className="text-4xl font-bold text-orange-500 mb-1">
                {plan.price} ₽
              </div>
              <div className="text-sm text-gray-500 mb-6">в месяц</div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePayment(plan)}
                disabled={loading === plan.name}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  plan.popular
                    ? "bg-orange-500 hover:bg-orange-600 text-black"
                    : "bg-gray-800 hover:bg-gray-700 text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.name ? "Создаём платёж..." : "Начать"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}