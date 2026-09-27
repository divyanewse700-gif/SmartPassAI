require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5050;

// Connect MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`SmartPass AI Backend is running on port ${PORT}`);
});
