const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables FIRST
dotenv.config();

const session = require("express-session");
const passport = require("./config/passport");
const connectDB = require("./config/db")
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoutes");
const cartRoute = require("./routes/cartRoutes");
const checkoutRoute = require("./routes/checkoutRoutes");
const orderRoute = require("./routes/orderroutes");
const uploadRoute = require("./routes/uploadRoutes");
const subscriberRoute = require("./routes/subscribeRoute");
const adminRoute = require("./routes/adminRoutes");
const productAdminRoute = require("./routes/productAdminRoutes");
const adminOrderRoute = require("./routes/adminOrderRoutes");
const analyticsRoute = require("./routes/analyticsRoutes");
const authRoute = require("./routes/authRoutes");


const app = express();
app.use(express.json());
app.use(cors());

// Session configuration for passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 3000;

//kết nối với MongoDB 
connectDB();

app.get("/",(req, res) => {
    res.send("XIN CHAO Api Lunabakery!");
});

//API Routes
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/checkout", checkoutRoute);
app.use("/api/orders", orderRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/subscribe", subscriberRoute);
//admin routes
app.use("/api/admin/users", adminRoute);
app.use("/api/admin/products", productAdminRoute);
app.use("/api/admin/orders", adminOrderRoute);
app.use("/api/analytics", analyticsRoute);
app.use("/api/auth", authRoute);





app.listen(PORT, () => {
    console.log(`Server chay tren http://localhost:${PORT}`);
});