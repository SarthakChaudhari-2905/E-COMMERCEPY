import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Profile from "./pages/Profile";
import ProductDetails from "./pages/ProductDetails";
import AdminPanel from "./pages/AdminPanel";
import { CartProvider } from "./pages/Context/CartContext";
import CartPage from "./pages/CartPage";
import CategoryPage from "./pages/CategoryPage";

function App() {
  return (
    <div>
      <CartProvider>
        <Header />
        <div className="flex flex-1">
          <main className="flex-1 p-4">
            <Routes>
              {/* Home and general pages */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/about" element={<About />} />

              {/* Product and category pages */}
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/product/:id" element={<ProductDetails />} />

              {/* Cart and profile */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/profile" element={<Profile />} />

              {/* Admin */}
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
        </div>

        {/* Toast notifications */}
        <ToastContainer position="top-right" autoClose={3000} />
      </CartProvider>
    </div>
  );
}

export default App;
