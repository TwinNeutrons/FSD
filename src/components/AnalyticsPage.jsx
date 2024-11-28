import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import Navbar from "./Navbar";
import "./AnalyticsPage.css";

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

const Analysis = () => {
  const [orderData, setOrderData] = useState([]);
  const [error, setError] = useState(null);
  const [cityMarkers, setCityMarkers] = useState([]);

  useEffect(() => {
    const currentOrigin = window.location.origin;
    fetch(`${new URL(currentOrigin).protocol}//${new URL(currentOrigin).hostname}:5000/api/orders`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setOrderData(data);
        setError(null);
        fetchCityCoordinates(data); // Fetch coordinates after receiving orders
      })
      .catch((error) => {
        console.error("Error fetching order data:", error);
        setError("Failed to load order data. Please try again later.");
      });
  }, []);

  // Function to fetch coordinates for cities
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchCityCoordinates = async (orderData) => {
    const cities = orderData.map(order => order.city);
    const uniqueCities = [...new Set(cities)]; // Remove duplicates

    const markersData = [];

    for (let city of uniqueCities) {
      try {
        await delay(1000); // 1000ms = 1 second
        const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${city}&format=json`);
        const data = await response.json();

        const latitude = parseFloat(data[0].lat);
        const longitude = parseFloat(data[0].lon);

        // Check if the coordinates are valid
        if (!isNaN(latitude) && !isNaN(longitude)) {
          markersData.push({
            city,
            coordinates: [longitude, latitude],
          });
        } else {
          // If invalid, return a default location (e.g., [0, 0])
          console.warn(`Invalid coordinates for city: ${city}`);
          markersData.push({ city, coordinates: [0, 0] });
        }
      } catch (error) {
        console.error("Error fetching geolocation for city:", city, error);
        markersData.push({ city, coordinates: [0, 0] }); // Default to [0,0] if error
      }
      setCityMarkers(markersData);
    }

  };



  // Data processing functions
  const getOrderQuantityByProduct = () => {
    const productMap = {};
    orderData.forEach((order) => {
      productMap[order.product] = (productMap[order.product] || 0) + parseInt(order.quantity, 10);
    });
    return productMap;
  };

  const getOrderStatusDistribution = () => {
    const statusMap = {
      Pending: 0,
      "In Transit": 0,
      Delivered: 0,
    };
    orderData.forEach((order) => {
      statusMap[order.deliveryStatus] = (statusMap[order.deliveryStatus] || 0) + 1;
    });
    return statusMap;
  };

  const getOrderQuantityByShipper = () => {
    const shipperMap = {};
    orderData.forEach((order) => {
      shipperMap[order.shipper] = (shipperMap[order.shipper] || 0) + parseInt(order.quantity, 10);
    });
    return shipperMap;
  };

  const getOrderVolumeOverTime = () => {
    const dateMap = {};
    orderData.forEach((order) => {
      const date = new Date(order.date).toLocaleDateString(); // Ensure you have a `date` field
      dateMap[date] = (dateMap[date] || 0) + 1;
    });
    return dateMap;
  };

  const getTopCustomersByOrderQuantity = () => {
    const customerMap = {};
    orderData.forEach((order) => {
      customerMap[order.customer] = (customerMap[order.customer] || 0) + parseInt(order.quantity, 10);
    });
    return customerMap;
  };

  // Prepare data for charts
  const productData = getOrderQuantityByProduct();
  const barData = {
    labels: Object.keys(productData),
    datasets: [
      {
        label: "Order Quantity",
        data: Object.values(productData),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const statusData = getOrderStatusDistribution();
  const pieData = {
    labels: Object.keys(statusData),
    datasets: [
      {
        label: "Order Status Distribution",
        data: Object.values(statusData),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const shipperData = getOrderQuantityByShipper();
  const shipperBarData = {
    labels: Object.keys(shipperData),
    datasets: [
      {
        label: "Order Quantity by Shipper",
        data: Object.values(shipperData),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };


  const customerData = getTopCustomersByOrderQuantity();
  const customerBarData = {
    labels: Object.keys(customerData),
    datasets: [
      {
        label: "Top Customers by Order Quantity",
        data: Object.values(customerData),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Navbar />
      <div className="content">
        <br></br>
        <br></br>

        {error && (
          <div style={{ color: "red", marginBottom: "20px" }}>
            <strong>{error}</strong>
          </div>
        )}
        <div className="chart-container">
          <h2>Order Quantity by Product</h2>
          <Bar data={barData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>
        <div className="chart-container">
          <h2>Orders by Delivery Status</h2>
          <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>
        <div className="chart-container">
          <h2>Order Quantity by Shipper</h2>
          <Bar data={shipperBarData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>
        <div className="chart-container">
          <h2>Top Customers by Order Quantity</h2>
          <Bar data={customerBarData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>
        <div className="map-container" >
          <h2 style={{ color: "#fff" }}>Orders by Customer Location</h2>
          <ComposableMap style={{ backgroundColor: "#103a91" }}>
            <Geographies geography="https://unpkg.com/world-atlas@2.0.2/countries-110m.json">
              {({ geographies }) =>
                geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} />)
              }
            </Geographies>
            {cityMarkers.map(({ city, coordinates }, index) => (
              <Marker key={index} coordinates={coordinates}>
                <circle r={2} fill="#fff" />
                <text textAnchor="middle" y={-10} style={{ fontSize: 8, fill: "#fff" }}>
                  {city}
                </text>
              </Marker>
            ))}
          </ComposableMap>
        </div>
      </div>
    </>

  );
};

export default Analysis;
