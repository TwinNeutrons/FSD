// src/pages/Inventory.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

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
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6">Inventory</h1>

        {/* Subheading: Update Stock */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Update Stock</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Product"
              value={formData.product}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="productId"
              placeholder="Product ID"
              value={formData.productId}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <button
              type="submit"
              className="col-span-2 bg-blue-500 text-white p-2 rounded"
            >
              Update Stock
            </button>
          </form>
        </section>

        {/* Subheading: Products */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Product List</h2>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border p-2">Product</th>
                <th className="border p-2">Product ID</th>
                <th className="border p-2">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.productId}>
                    <td className="border p-2">{product.name}</td>
                    <td className="border p-2">{product.productId}</td>
                    <td className="border p-2">{product.stock}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="border p-2 text-center text-gray-500"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
};

export default Inventory;
