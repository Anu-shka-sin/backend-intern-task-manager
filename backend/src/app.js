const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const errorHandler = require('./utils/errorHandler');

const app = express();

/* ================= SECURITY MIDDLEWARE ================= */

// Security headers
app.use(helmet());

// Enable CORS (you can restrict origin in production)
app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true
  })
);

// Logging (only in development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser with size limit
app.use(express.json({ limit: "10kb" }));

/* ================= ROUTES ================= */

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);

/* ================= 404 HANDLER ================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/* ================= GLOBAL ERROR HANDLER ================= */

app.use(errorHandler);

module.exports = app;