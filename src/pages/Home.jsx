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
  const [sortOrder, setSortOrder] = useState("default"); // 🆕 sorting state
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

  // 🧮 Sort products based on selected order
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "highToLow") return b.price - a.price;
    if (sortOrder === "lowToHigh") return a.price - b.price;
    return 0; // default - no sorting
  });

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
        <div className="products-header">
          <h2 className="products-heading">Our Products</h2>

          {/* 🆕 Sort Dropdown */}
          <select
            className="sort-dropdown"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">Sort By</option>
            <option value="highToLow">Price: High to Low</option>
            <option value="lowToHigh">Price: Low to High</option>
          </select>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="products-grid">
            {sortedProducts.length > 0 ? (
              sortedProducts.map((p) => (
                <ProductCard
                  key={p.id}
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
