import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const DataEntryPage = () => {
  const [formData, setFormData] = useState({
    product: "",
    productId: "",
    shipper: "",
    customer: "",
    customerId: "",
    house: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    deliveryStatus: "Pending",
    quantity: 1,
  });

  const [currentOrders, setCurrentOrders] = useState([]);

  // Fetch all orders (no userId)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders");
        setCurrentOrders(response.data);
      } catch (error) {
        console.error("Error fetching current orders:", error);
      }
    };
    fetchOrders();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // No need to include userId
      const orderData = { ...formData };
      await axios.post("http://localhost:5000/api/orders", orderData);
      alert("Order added successfully!");
      setFormData({
        product: "",
        productId: "",
        shipper: "",
        customer: "",
        customerId: "",
        house: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
        deliveryStatus: "Pending",
        quantity: 1,
      });
      // Refresh orders after submission
      const response = await axios.get("http://localhost:5000/api/orders");
      setCurrentOrders(response.data);
    } catch (error) {
      console.error("Error adding order:", error);
      alert("Failed to add order.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6">Orders</h1>

        {/* Subheading: Data Entry */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Data Entry</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="product"
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
              type="text"
              name="shipper"
              placeholder="Shipper"
              value={formData.shipper}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="customer"
              placeholder="Customer"
              value={formData.customer}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="customerId"
              placeholder="Customer ID"
              value={formData.customerId}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="house"
              placeholder="House"
              value={formData.house}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <select
              name="deliveryStatus"
              value={formData.deliveryStatus}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
            </select>
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <button
              type="submit"
              className="col-span-2 bg-blue-500 text-white p-2 rounded"
            >
              Submit
            </button>
          </form>
        </section>

        {/* Subheading: Current Orders */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Current Orders</h2>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border p-2">Order ID</th>
                <th className="border p-2">Product</th>
                <th className="border p-2">Customer</th>
                <th className="border p-2">Delivery Status</th>
                <th className="border p-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="border p-2">{order.productId}</td>
                    <td className="border p-2">{order.product}</td>
                    <td className="border p-2">{order.customer}</td>
                    <td className="border p-2">{order.deliveryStatus}</td>
                    <td className="border p-2">{order.quantity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="border p-2 text-center text-gray-500"
                  >
                    No orders found.
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

export default DataEntryPage;
