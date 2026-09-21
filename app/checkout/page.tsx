"use client";
import { useState } from "react";

export default function CheckoutPage() {
  const [amount, setAmount] = useState(500);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    const orderId = Date.now().toString();

    try {
      const res = await fetch("/api/robokassa/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          orderId,
          description: `Оплата заказа №${orderId}`,
          email,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert("Ошибка: " + (data.error || "неизвестная"));
      }
    } catch (e) {
      setLoading(false);
      alert("Ошибка сети: " + e);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Оплата заказа</h1>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full p-2 mb-3 bg-gray-800 rounded"
        placeholder="Сумма"
      />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-3 bg-gray-800 rounded"
        placeholder="Email"
      />

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full p-2 bg-blue-600 rounded disabled:opacity-50"
      >
        {loading ? "Создаём платёж..." : "Оплатить через Робокассу"}
      </button>
    </div>
  );
}