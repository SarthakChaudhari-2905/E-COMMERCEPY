import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import "./CategoryPage.css";

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("default"); // 🆕 sort state

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const res = await api.get(`/products/?category=${category}`);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching category products:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  // 🧮 Sort products based on selected order
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "highToLow") return b.price - a.price;
    if (sortOrder === "lowToHigh") return a.price - b.price;
    return 0; // default - no sorting
  });

  return (
    <div className="category-container">
      <h2 className="category-title">{category} Collection</h2>

      {/* --- MEN SECTION --- */}
      {category === "men" && (
        <>
          <div className="video-container">
            <video
              className="category-video"
              src="https://image.hm.com/content/dam/global_campaigns/season_02/men/start-page-assets/wk37/MS42C3-2x3-Startpage-Teaser1-Video-wk37.mp4"
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              disablePictureInPicture
              controlsList="nodownload noremoteplayback noplaybackrate"
            />
          </div>

          <div className="category-banner">
            <div className="category-block">
              <h3 className="category-heading">NEW ARRIVALS</h3>
              <img
                src="https://image.hm.com/content/dam/global_campaigns/season_02/men/start-page-assets/w40/Hoodies-and-Sweatshirts-CE-wk40-43.jpg?imwidth=1536"
                alt="Men New Arrivals"
                className="category-img"
              />
            </div>

            <div className="category-block">
              <h3 className="category-heading link">SHOP NOW</h3>
              <img
                src="https://image.hm.com/content/dam/global_campaigns/season_02/men/start-page-assets/w41/MS42LH5-4x5-Startpage-Teaser-2-w41.jpg?imwidth=1366"
                alt="Men Shop Now"
                className="category-img"
              />
            </div>
          </div>
        </>
      )}

      {/* --- LADIES SECTION --- */}
      {category === "ladies" && (
        <>
          <div className="video-container">
            <img
              className="category-video"
              src="https://image.hm.com/content/dam/global_campaigns/season_02/women/startpage-category-entries/wk39/WS42C-16x9-women-startpage-wk39-Option.jpg?imwidth=2560"
              alt="Ladies Collection"
            />
          </div>

          <div className="ladies-banner">
            <div className="ladies-block">
              <h3 className="ladies-heading">NEW ARRIVALS</h3>
              <img
                src="https://image.hm.com/content/dam/global_campaigns/season_02/women/startpage-category-entries/wk41/2042-4x5-NEW-women-startpage-wk41.jpg?imwidth=1366"
                alt="New Arrivals"
                className="ladies-img"
              />
            </div>

            <div className="ladies-block">
              <h3 className="ladies-heading link">SHOP NOW</h3>
              <img
                src="https://image.hm.com/content/dam/global_campaigns/season_02/women/startpage-category-entries/wk41/1022B-4x5-women-startpage-wk42.jpg?imwidth=1366"
                alt="Shop Now"
                className="ladies-img"
              />
            </div>
          </div>
        </>
      )}

      {/* --- KIDS SECTION --- */}
      {category === "kids" && (
        <>
          <div className="video-container">
            <video
              className="category-video"
              src="https://image.hm.com/content/dam/global_campaigns/season_02/kids/start-page-assets/w39-40/KS42B1-2x3-kids-start-page-VIDEO-wk39-40.mp4"
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              disablePictureInPicture
              controlsList="nodownload noremoteplayback noplaybackrate"
            />
          </div>

          <div className="kids-banner">
            <div className="kids-block">
              <h3 className="kids-heading">NEW ARRIVALS</h3>
              <img
                src="https://image.hm.com/content/dam/global_campaigns/season_02/kids/start-page-assets/wk41/Newborn-KCE-wk41-43.jpg?imwidth=1536"
                alt="Kids New Arrivals"
                className="kids-img"
              />
            </div>

            <div className="kids-block">
              <h3 className="kids-heading link">SHOP NOW</h3>
              <img
                src="https://image.hm.com/content/dam/global_campaigns/season_02/kids/start-page-assets/wk41/KS42G-4x5-kids-wk41-42.jpg?imwidth=1366"
                alt="Kids Shop Now"
                className="kids-img"
              />
            </div>
          </div>
        </>
      )}

      {/* --- PRODUCTS GRID --- */}
      <div className="category-products">
        {/* 🆕 Sort dropdown */}
        <div className="sort-section">
          <label htmlFor="sort">Sort by:</label>
          <select
            id="sort"
            className="sort-dropdown"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="highToLow">Price: High to Low</option>
            <option value="lowToHigh">Price: Low to High</option>
          </select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : sortedProducts.length > 0 ? (
          <div className="products-grid">
            {sortedProducts.map((p) => (
              <ProductCard key={p.id || p._id} product={p} />
            ))}
          </div>
        ) : (
          <p>No products found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
