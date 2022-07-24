require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

module.exports = {
  PORT,
  MONGODB_URI,
  JWT_SECRET,
  STRIPE_SECRET_KEY,
};
