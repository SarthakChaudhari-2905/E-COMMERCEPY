import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // ❤️ icons
import api from "../services/api";
import { toast } from "react-toastify";

const ProductCard = ({ product, onAddToCart }) => {
  const { id, name, price, image, category } = product;
  const [wishlisted, setWishlisted] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (onAddToCart) onAddToCart(product);
  };

  // ❤️ Handle Wishlist Click
  const handleWishlist = async (e) => {
    e.preventDefault();

    try {
      await api.post("/wishlist/add/", { product: id });

      setWishlisted(true);
      toast.success(`${name} added to wishlist ❤️`);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist ❌");
    }
  };

  return (
    <article className="product-card" aria-label={name}>
      <Link to={`/product/${id}`} className="img-link">
        <div className="product-image-wrap">
          <img src={image} alt={name} className="product-image" />

          {/* ❤️ Wishlist Icon */}
          <div className="wishlist-icon" onClick={handleWishlist}>
            {wishlisted ? (
              <FaHeart color="red" size={22} />
            ) : (
              <FaRegHeart color="gray" size={22} />
            )}
          </div>

          <div className="badge">{category?.toUpperCase()}</div>
        </div>
      </Link>

      <div className="product-body">
        <h3 className="product-name">
          <Link to={`/product/${id}`}>{name}</Link>
        </h3>

        <p className="product-price">
          ₹{price?.toFixed ? price.toFixed(2) : price}
        </p>

        <div className="card-actions">
          <button className="btn" onClick={handleAdd}>
            Add to Cart
          </button>
          <Link to={`/product/${id}`} className="btn-outline">
            View
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
