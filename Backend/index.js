const express = require("express");
const cors = require("cors");
const userRoutes = require("./Routes/userRoutes");
const furnitureRoutes = require("./Routes/furnitureRoutes");
const connectDB = require("./Database/connection");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
connectDB();

app.get("/", (req, res) => {
    res.json({ message: "Hello from backend" });
});

// user routes
app.use("/api/users", userRoutes);

// furniture routes
app.use("/api/furniture", furnitureRoutes);    

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
});