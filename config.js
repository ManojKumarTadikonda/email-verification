module.exports = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || "mongodb+srv://manojtadikonda5:manoj38519@cluster0.8lhda.mongodb.net/auth-db",
    JWT_SECRET: process.env.JWT_SECRET || "supersecretkey",
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
  };
  