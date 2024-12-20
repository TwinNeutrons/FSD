const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const PORT = 5000;
const JWT_SECRET = "your_jwt_secret_key";

app.use(cors());
app.use(express.json());

// Connect to the MongoDB "SCM" database
mongoose.connect("mongodb+srv://Inferno:Test123@cluster0.bycscce.mongodb.net/SCM", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => console.log("Connected to MongoDB database 'SCM'"));

// User Schema explicitly using "users" collection
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { collection: "users" } // Specify collection name
);

const User = mongoose.model("User", userSchema);

// Shipment Schema explicitly using "orders" collection
const orderSchema = new mongoose.Schema(
  {
    product: String,
    productId: String,
    shipper: String,
    customer: String,
    customerId: String,
    house: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    deliveryStatus: { type: String, enum: ["Pending", "In Transit", "Delivered"], default: "Pending" },
    quantity: String,
  },
  { collection: "orders" } // Explicit collection name
);

const Order = mongoose.model("Order", orderSchema);

// Routes
// Register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "User registration failed" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ username: user.username }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Protected route for testing
app.get("/protected", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({ message: "Access granted", user: decoded });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Shipment Routes
// Add shipment data (POST)
app.post("/api/orders", async (req, res) => {
  const {
    product,
    productId,
    shipper,
    customer,
    customerId,
    house,
    city,
    state,
    pincode,
    country,
    deliveryStatus,
    quantity,
  } = req.body;

  try {
    const newOrder = new Order({
      product,
      productId,
      shipper,
      customer,
      customerId,
      house,
      city,
      state,
      pincode,
      country,
      deliveryStatus,
      quantity,
    });
    await newOrder.save();
    res.status(201).json({ message: "Order added successfully!" });
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ error: "Failed to add order." });
  }
});

// Get all shipment orders (GET)
app.get("/api/orders", async (req, res) => {
  try {
    // Fetch all orders without filtering by userId
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

// Product Schema explicitly using "products" collection
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    productId: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
  },
  { collection: "products" } // Explicit collection name
);

const Product = mongoose.model("Product", productSchema);

// Get all products (GET)
app.get("/api/products", async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products." });
  }
});

// Update product stock by productId (PUT)
app.put("/api/products/:productId", async (req, res) => {
  const { productId } = req.params;
  const { stock, name, price } = req.body; // Include name and price for adding new product

  try {
    // Try to find the product by its productId
    let product = await Product.findOne({ productId: productId });

    if (product) {
      // Update the existing product's stock
      product.stock = stock;
      await product.save();
      res.status(200).json({ message: "Stock updated successfully", product });
    } else {
      // Create a new product if it doesn't exist
      const newProduct = new Product({
        productId,
        stock,
        name: name || "Unnamed Product", // Default name if not provided
        price: price || 0, // Default price if not provided
      });
      await newProduct.save();
      res.status(201).json({ message: "New product added successfully", newProduct });
    }
  } catch (error) {
    console.error("Error updating or adding product:", error);
    res.status(500).json({ error: "Failed to update or add product." });
  }
});




app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
