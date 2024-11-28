import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "./DataEntryPage.css";

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
        const currentOrigin = window.location.origin;
        const response = await axios.get(`${new URL(currentOrigin).protocol}//${new URL(currentOrigin).hostname}:5000/api/orders`);        
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
      const orderData = { ...formData };
      const currentOrigin = window.location.origin;
      await axios.post(`${new URL(currentOrigin).protocol}//${new URL(currentOrigin).hostname}:5000/api/orders`, orderData);
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
      const response = await axios.get(`${new URL(currentOrigin).protocol}//${new URL(currentOrigin).hostname}:5000/api/orders`);
      setCurrentOrders(response.data);
    } catch (error) {
      console.error("Error adding order:", error);
      alert("Failed to add order.");
    }
  };

  return (
    <>
    <div className="data-entry-page">
      <Navbar />
      <div className="data-entry-container">
        <div className="data-entry-box">
          <h1 className="data-entry-header">Add New Order</h1>

          {/* Data Entry Form */}
          <form onSubmit={handleSubmit} className="data-entry-form">
            <div className="data-entry-form-group">
              <label>Product</label>
              <input
                type="text"
                name="product"
                value={formData.product}
                onChange={handleChange}
                className="data-entry-input"
                placeholder="Product Name"
              />
            </div>
            <div className="data-entry-form-group">
              <label>Product ID</label>
              <input
                type="text"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                className="data-entry-input"
                placeholder="Product ID"
              />
            </div>
            <div className="data-entry-form-group">
              <label>Shipper</label>
              <input
                type="text"
                name="shipper"
                value={formData.shipper}
                onChange={handleChange}
                className="data-entry-input"
                placeholder="Shipper Name"
              />
            </div>
            <div className="data-entry-form-group">
              <label>Customer</label>
              <input
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                className="data-entry-input"
                placeholder="Customer Name"
              />
            </div>
            <div className="data-entry-form-group">
              <label>Customer ID</label>
              <input
                type="text"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                className="data-entry-input"
                placeholder="Customer ID"
              />
            </div>
            <div className="data-entry-form-group">
              <label>House</label>
              <input
                type="text"
                name="house"
                value={formData.house}
                onChange={handleChange}
                className="data-entry-input"
                placeholder="House Address"
              />
            </div>
            <div className="data-entry-form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="data-entry-input"
                placeholder="City"
              />
            </div>
            <div className="data-entry-form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="data-entry-input"
                placeholder="State"
              />
            </div>
            <div className="data-entry-form-group">
              <label>Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="data-entry-input"
                placeholder="Pincode"
              />
            </div>
            <div className="data-entry-form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="data-entry-input"
                placeholder="Country"
              />
            </div>
            <div className="data-entry-form-group">
              <label>Delivery Status</label>
              <select
                name="deliveryStatus"
                value={formData.deliveryStatus}
                onChange={handleChange}
                className="data-entry-input"
              >
                <option value="Pending">Pending</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
            <div className="data-entry-form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="data-entry-input"
              />
            </div>
            <button type="submit" className="data-entry-submit-btn">
              Add Order
            </button>
          </form>

          {/* Display Current Orders */}
          <div className="data-entry-orders-section">
            <h2 className="data-entry-subheader">Current Orders</h2>
            <table className="data-entry-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Customer</th>
                  <th>Delivery Status</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.productId}</td>
                      <td>{order.product}</td>
                      <td>{order.customer}</td>
                      <td>{order.deliveryStatus}</td>
                      <td>{order.quantity}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-orders">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default DataEntryPage;
