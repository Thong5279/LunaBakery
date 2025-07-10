const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const dotenv = require("dotenv");
const { createServer } = require('http');
const { Server } = require('socket.io');

// Load environment variables FIRST
dotenv.config();

const connectDB = require("./config/db")
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoutes");
const ingredientRoute = require("./routes/ingredientRoutes");
const cartRoute = require("./routes/cartRoutes");
const checkoutRoute = require("./routes/checkoutRoutes");
const orderRoute = require("./routes/orderroutes");
const uploadRoute = require("./routes/uploadRoutes");
const subscriberRoute = require("./routes/subscribeRoute");
const adminRoute = require("./routes/adminRoutes");
const productAdminRoute = require("./routes/productAdminRoutes");
const adminOrderRoute = require("./routes/adminOrderRoutes");
const adminIngredientRoute = require("./routes/adminIngredientRoutes");
const adminRecipeRoute = require("./routes/adminRecipeRoutes");
const analyticsRoute = require("./routes/analyticsRoutes");
const authRoute = require("./routes/authRoutes");
const paymentRoute = require("./routes/paymentRoutes");
const inventoryRoute = require("./routes/inventoryRoutes");
const managerOrderRoute = require("./routes/managerOrderRoutes");
const bakerOrderRoute = require("./routes/bakerOrderRoutes");
const bakerRecipeRoute = require("./routes/bakerRecipeRoutes");
const deliveryOrderRoute = require("./routes/deliveryOrderRoutes");
const chatRoutes = require('./routes/chatRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.VITE_FRONTEND_URL || "http://localhost:5173",
    credentials: true
  }
});

// Lưu instance của Socket.IO vào app để có thể sử dụng trong routes
app.set('io', io);

// Socket.IO events
io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.VITE_FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

const PORT = process.env.PORT || 9000;

//kết nối với MongoDB 
connectDB();

app.get("/", (req, res) => {
  res.send("XIN CHAO Api Lunabakery!");
});

//API Routes
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/ingredients", ingredientRoute);
app.use("/api/cart", cartRoute);
app.use("/api/checkout", checkoutRoute);
app.use("/api/orders", orderRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/subscribe", subscriberRoute);
//admin routes
app.use("/api/admin/users", adminRoute);
app.use("/api/admin/products", productAdminRoute);
app.use("/api/admin/orders", adminOrderRoute);
app.use("/api/admin/ingredients", adminIngredientRoute);
app.use("/api/admin/recipes", adminRecipeRoute);
app.use("/api/analytics", analyticsRoute);
app.use("/api/auth", authRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/inventory", inventoryRoute);
//role-based order routes
app.use("/api/manager/orders", managerOrderRoute);
app.use("/api/baker/orders", bakerOrderRoute);
app.use("/api/baker/recipes", bakerRecipeRoute);
app.use("/api/delivery/orders", deliveryOrderRoute);
app.use('/api/chat', chatRoutes);
app.use('/api/contact', contactRoutes);

httpServer.listen(PORT, () => {
  console.log(`Server chay tren http://localhost:${PORT}`);
});
