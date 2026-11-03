import React, { useState, useEffect } from 'react';

export default function CartIcon() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function updateCount() {
      try {
        const stored = localStorage.getItem('carrito');
        const carrito = stored ? JSON.parse(stored) : [];
        const total = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
        setCount(total);
      } catch (e) {
        setCount(0);
      }
    }

    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('cart-updated', updateCount);

    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('cart-updated', updateCount);
    };
  }, []);

  if (count === 0) return null;

  return (
    <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center scale-90">
      {count}
    </span>
  );
}
