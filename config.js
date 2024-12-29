module.exports = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/auth-db",
    JWT_SECRET: process.env.JWT_SECRET || "supersecretkey",
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
  };
  