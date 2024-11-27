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
    fetch("http://localhost:5000/api/orders")
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

  // Function to process each city with a delay of 1 second between each request
  for (let city of uniqueCities) {
    try {
      // Introduce a delay of 1 second before each fetch
      await delay(2000); // 1000ms = 1 second
      
      const response = await fetch(`https://geocode.xyz/${city}?json=1`);
      const data = await response.json();

      const latitude = parseFloat(data.latt);
      const longitude = parseFloat(data.longt);

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
  }

  // Once all markers are fetched, update the state
  setCityMarkers(markersData);
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

  const volumeData = getOrderVolumeOverTime();
  const lineData = {
    labels: Object.keys(volumeData),
    datasets: [
      {
        label: "Order Volume Over Time",
        data: Object.values(volumeData),
        fill: false,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
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
        <h1>Order Analysis</h1>
        {error && (
          <div style={{ color: "red", marginBottom: "20px" }}>
            <strong>{error}</strong>
          </div>
        )}
        <div style={{ width: "100%", margin: "0 auto" }}>
          <h2>Order Quantity by Product</h2>
          <Bar data={barData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>
        <div style={{ width: "100%", margin: "0 auto", marginTop: "20px" }}>
          <h2>Orders by Delivery Status</h2>
          <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>
        <div style={{ width: "100%", margin: "0 auto", marginTop: "20px" }}>
          <h2>Order Quantity by Shipper</h2>
          <Bar data={shipperBarData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>
        <div style={{ width: "100%", margin: "0 auto", marginTop: "20px" }}>
          <h2>Top Customers by Order Quantity</h2>
          <Bar data={customerBarData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>
        <div style={{ marginTop: "20px" }}>
          <h2>Orders by Customer Location</h2>
          <ComposableMap>
            <Geographies geography="https://unpkg.com/world-atlas@2.0.2/countries-110m.json">
              {({ geographies }) =>
                geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} />)
              }
            </Geographies>
            {cityMarkers.map(({ city, coordinates }, index) => (
              <Marker key={index} coordinates={coordinates}>
                <circle r={5} fill="#F53" />
                <text textAnchor="middle" y={-10} style={{ fontSize: 12, fill: "#F53" }}>
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
