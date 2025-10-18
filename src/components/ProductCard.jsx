import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product, onAddToCart }) => {
  // product: { id, name, price, image, category, description }
  const { id, name, price, image, category } = product; // ✅ changed _id → id

  const handleAdd = (e) => {
    e.preventDefault();
    if (onAddToCart) onAddToCart(product);
  };

  return (
    <article className="product-card" aria-label={name}>
      {/* ✅ changed _id → id in all links */}
      <Link to={`/product/${id}`} className="img-link">
        <div className="product-image-wrap">
          <img src={image} alt={name} className="product-image" />
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
