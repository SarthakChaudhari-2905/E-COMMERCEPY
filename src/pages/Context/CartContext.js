import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // ✅ Sync cart with localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ Add to cart
  const addToCart = (product) => {
    const size = product.size || "default";
    const color = product.color || "default";

    setCart((prevCart) => {
      const existing = prevCart.find(
        (item) =>
          item.id === product.id && // ✅ changed _id → id
          item.size === size &&
          item.color === color
      );

      if (existing) {
        // Increase quantity if same product variant exists
        return prevCart.map((item) =>
          item.id === product.id &&
          item.size === size &&
          item.color === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new product
        return [...prevCart, { ...product, size, color, quantity: 1 }];
      }
    });
  };

  // ✅ Remove from cart
  const removeFromCart = (id, size, color) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.id === id &&
            item.size === size &&
            item.color === color
          )
      )
    );
  };

  // ✅ Update quantity
  const updateQuantity = (id, size, color, qty) => {
    if (qty <= 0) return removeFromCart(id, size, color);

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};
