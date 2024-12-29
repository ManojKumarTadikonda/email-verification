const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MONGO_URI, PORT } = require("./config");

const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

require("dotenv").config();

// Routes
app.use("/api/auth", authRoutes);

// MongoDB Connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
