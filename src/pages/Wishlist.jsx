import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import "./Wishlist.css";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to view wishlist 🔒");
          return;
        }

        const res = await api.get("/wishlist/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(res.data);
      } catch (err) {
        console.error("Error fetching wishlist:", err.response?.data || err.message);
        toast.error("Failed to load wishlist ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) return <p style={{ padding: "2rem" }}>Loading your wishlist...</p>;
  if (!wishlist.length)
    return <p style={{ padding: "2rem" }}>Your wishlist is empty 💭</p>;

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-title">My Wishlist ❤️</h2>

      <div className="wishlist-grid">
        {wishlist.map((item) => (
          <div key={item.id} className="wishlist-card">
            <img
              src={item.product.image}
              alt={item.product.name}
              className="wishlist-img"
            />

            <div className="wishlist-info">
              <h3>{item.product.name}</h3>
              <p>₹{item.product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
