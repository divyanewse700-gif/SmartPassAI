const express = require("express");
const app = express();
const organizationRoutes = require("./routes/organizationRoutes");
const userRoutes = require("./routes/userRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const visitRoutes = require("./routes/visitRoutes");
const queueRoutes = require("./routes/queueRoutes");
const queueStatusRoutes = require("./routes/queueStatusRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const visitStatusRoutes = require("./routes/visitStatusRoutes");
const checkInRoutes = require("./routes/checkInRoutes");
const checkOutRoutes = require("./routes/checkOutRoutes");
const passRoutes = require("./routes/passRoutes");
const passVerificationRoutes = require("./routes/passVerificationRoutes");
const documentRoutes = require("./routes/documentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

//Middleware
app.use(express.json());

//Organization routes
app.use("/api/organizations", organizationRoutes);

//user route
app.use("/api/users", userRoutes);

//visitors route
app.use("/api/visitors", visitorRoutes);

//visit route
app.use("/api/visits", visitRoutes);
app.use("/api/visits", visitStatusRoutes);

//queue route
app.use("/api/queues", queueRoutes);

//queuestatus route
app.use("/api/queues", queueStatusRoutes);

//auth routes
app.use("/api/auth", authRoutes);

//checkin route
app.use("/api/checkins", checkInRoutes);

//checkout route
app.use("/api/checkouts", checkOutRoutes);

//passRoute
app.use("/api/passes", passRoutes);
app.use("/api/pass-verification", passVerificationRoutes);

app.use("/api/documents", documentRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Test route
app.get("/api/protected-test", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "You have access to the protected route",
    user: req.user,
  });
});

module.exports = app;
