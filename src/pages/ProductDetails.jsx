import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "./Context/CartContext";
import api from "../services/api"; // ✅ use api.js
import "./ProductDetails.css";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // Fetch product from Django backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}/`); // ✅ endpoint matches Django
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err.response?.data || err.message);
        toast.error("Failed to fetch product ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p style={{ padding: "2rem" }}>Loading product...</p>;
  if (!product) return <p style={{ padding: "2rem" }}>Product not found.</p>;

  // ✅ Handle Add to Cart with toast
  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size before adding to cart ❌");
      return;
    }

    const cartItem = {
      ...product,
      size: selectedSize,
      color: selectedColor || product.colors?.[0] || "default",
    };

    addToCart(cartItem);
    toast.success("Item added to cart 🛒✅");
  };

  return (
    <div className="product-details">
      <div className="details-left">
        <img
          src={product.image}
          alt={product.name}
          className="details-image"
        />
      </div>

      <div className="details-info">
        {product.discount && (
          <span className="discount-tag">-{product.discount}%</span>
        )}
        <h2 className="details-name">{product.name}</h2>

        <div className="details-price">
          <span className="new-price">₹{product.price}</span>{" "}
          {product.oldPrice && (
            <span className="old-price">₹{product.oldPrice}</span>
          )}
        </div>
        <p className="tax-info">MRP inclusive of all taxes</p>

        {/* Colors */}
        {product.colors && (
          <div className="color-section">
            <p>COLOUR: {selectedColor || product.colors[0]}</p>
            <div className="color-options">
              {product.colors.map((color, idx) => (
                <div
                  key={idx}
                  className={`color-box ${
                    selectedColor === color ? "active" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        <div className="size-section">
          <p>SELECT SIZE</p>
          <div className="size-options">
            {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
              <button
                key={size}
                className={`size-btn ${selectedSize === size ? "active" : ""}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
          <a href="#" className="size-guide">
            SIZE GUIDE
          </a>
        </div>

        <button className="add-btn" onClick={handleAddToCart}>
          ADD
        </button>

        <div className="extra-info">
          <a href="#">CHECK AVAILABILITY</a>
          <details>
            <summary>DESCRIPTION & FIT</summary>
            <p>{product.description}</p>
          </details>
          <details>
            <summary>MATERIALS</summary>
            <p>{product.materials || "Material info here..."}</p>
          </details>
          <details>
            <summary>DELIVERY AND PAYMENT</summary>
            <p>Standard delivery in 3-5 business days.</p>
          </details>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
