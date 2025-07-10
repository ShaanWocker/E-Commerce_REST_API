// Initialise Express Server
const express = require("express");
const app = express();

// Initialise Mongo
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Routes
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const mediaRoute = require("./routes/media");

// const paypalRoute = require("./routes/paypal");

const cors = require("cors");


dotenv.config();

mongoose
    .set('strictQuery', true)
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connection Established"))
    .catch((err) => {
        console.log(err);
    });
    
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/media", mediaRoute);
// app.use("/api/checkout", paypalRoute);


app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server is running!");
});
