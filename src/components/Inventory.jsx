import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "./Inventory.css"; // Ensure this file has the new styles

const Inventory = () => {
  const [formData, setFormData] = useState({
    name: "",
    productId: "",
    stock: 0,
  });

  const [products, setProducts] = useState([]);

  // Fetch all products (productId, stock)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (update product stock)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = { ...formData };
      await axios.put(
        `http://localhost:5000/api/products/${formData.productId}`,
        updatedProduct
      );
      alert("Stock updated successfully!");
      // Refresh product list after stock update
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
      setFormData({
        name: "",
        productId: "",
        stock: 0,
      });
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Failed to update stock.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="inventory-container">
        <div className="inventory-box">
          <h1>Inventory</h1>

          {/* Update Stock Form */}
          <section className="form-section">
            <h2>Update Stock</h2>
            <form onSubmit={handleSubmit} className="inventory-form">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
              />
              <input
                type="text"
                name="productId"
                placeholder="Product ID"
                value={formData.productId}
                onChange={handleChange}
              />
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={formData.stock}
                onChange={handleChange}
              />
              <button type="submit" className="submit-btn">
                Update Stock
              </button>
            </form>
          </section>

          {/* Product List Table */}
          <section className="table-section">
            <h2>Product List</h2>
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Product ID</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.productId}>
                      <td>{product.name}</td>
                      <td>{product.productId}</td>
                      <td>{product.stock}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="no-products">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </>
  );
};

export default Inventory;
