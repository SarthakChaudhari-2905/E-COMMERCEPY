import React, { useContext, useState } from "react";
import { CartContext } from "./Context/CartContext";
import "./CartPage.css";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const [showBill, setShowBill] = useState(false); // <-- NEW STATE

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const gst = (totalPrice * 0.18).toFixed(2); // Example 18% GST
  const finalAmount = (totalPrice + parseFloat(gst)).toFixed(2);

  if (cart.length === 0) {
    return <h2 className="empty-cart">🛒 Your cart is empty</h2>;
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Shopping Cart</h2>

      <div className="cart-items">
        {cart.map((item) => (
          <div
            className="cart-item"
            key={`${item.id}-${item.size}-${item.color}`}
          >
            <img src={item.image} alt={item.name} className="cart-img" />
            <div className="cart-info">
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>
              <p>
                <strong>Size:</strong> {item.size} | <strong>Color:</strong> {item.color}
              </p>

              <div className="cart-controls">
                <button
                  onClick={() =>
                    updateQuantity(item.id, item.size, item.color, item.quantity - 1)
                  }
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.id, item.size, item.color, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>

              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id, item.size, item.color)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="cart-summary">
        <h3>Total: ₹{totalPrice}</h3>
        <button
          className="checkout-btn"
          onClick={() => setShowBill(true)} // <-- SHOW BILL
        >
          Proceed to Checkout
        </button>
      </div>

      {/* Bill Section */}
      {showBill && (
        <div className="bill-container">
          <h2>🧾 Order Summary</h2>
          <table className="bill-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={`${item.id}-${item.size}-${item.color}`}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price}</td>
                  <td>₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="bill-summary">
            <p>Subtotal: ₹{totalPrice}</p>
            <p>GST (18%): ₹{gst}</p>
            <h3>Final Amount: ₹{finalAmount}</h3>
          </div>

          <button
            className="place-order-btn"
            onClick={() => alert("✅ Order placed successfully!")}
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
