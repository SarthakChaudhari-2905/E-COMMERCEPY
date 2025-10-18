import { useState, useEffect } from "react";
import api, { setAuthToken } from "../services/api"; // correct path
import "./AdminPanel.css";

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", description: "", category: "", image: "" });
  const [editId, setEditId] = useState(null);

useEffect(() => {
  const token = localStorage.getItem("token");
  setAuthToken(token);
}, []);


  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/");
      setProducts(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();
  const payload = { ...form, price: parseFloat(form.price) };

  try {
    if (editId) {
      await api.put(`/products/update/${editId}/`, payload);
      setEditId(null);
    } else {
      await api.post("/products/add/", payload);
    }
    setForm({ name: "", price: "", description: "", category: "", image: "" });
    fetchProducts();
  } catch (err) {
    console.error(err.response?.data || err.message);
    if (err.response?.status === 401) alert("Unauthorized ❌. Admin access required.");
    else alert(err.response?.data?.msg || "Action failed ❌");
  }
};

  // Delete Product
  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/delete/${id}/`);
      fetchProducts();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.msg || "Delete failed ❌");
    }
  };

  // Edit Product → fills the form
  const editProduct = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
    });
    setEditId(product.id || product.pk); // Django uses pk/id
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Panel</h2>

      {/* Add/Update Form */}
      <form onSubmit={handleSubmit} className="admin-form">
        <input className="admin-input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="admin-input" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input className="admin-input" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="admin-input" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input className="admin-input" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />

        <button className="admin-btn submit-btn">{editId ? "Update Product" : "Add Product"}</button>
      </form>

      {/* Product List */}
      <h3 className="admin-subtitle">Products</h3>
      <ul className="product-list">
        {products.map((p) => (
          <li key={p.id || p.pk} className="product-item">
            <span>
              <strong>{p.name}</strong> - ₹{p.price}
            </span>
            <div className="btn-group">
              <button className="admin-btn edit-btn" onClick={() => editProduct(p)}>Edit</button>
              <button className="admin-btn delete-btn" onClick={() => deleteProduct(p.id || p.pk)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;
