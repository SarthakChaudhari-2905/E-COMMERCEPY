import React, { useState, useEffect, useContext } from "react";
import "./Home.css";
import Slider from "../components/Slider";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import { CartContext } from "./Context/CartContext";
import About from "../pages/About";
import { toast } from "react-toastify";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  // 🔹 Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/products/");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart 🛒`);
  };

  return (
    <div className="home">
      {/* Brand Section */}
      <section className="brand-section">
        <h1 className="brand-name">SC Collection</h1>
        <p className="brand-tagline">Style That Defines You ✨</p>
      </section>

      {/* Slider */}
      <Slider />

      {/* Products */}
      <section className="products-section">
        <h2 className="products-heading">Our Products</h2>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="products-grid">
            {products.length > 0 ? (
              products.map((p) => (
                <ProductCard
                  key={p.id} // ✅ fixed
                  product={p}
                  onAddToCart={() => handleAddToCart(p)}
                />
              ))
            ) : (
              <p>No products available</p>
            )}
          </div>
        )}
      </section>

      {/* About Section */}
      <About />
    </div>
  );
};

export default Home;
