export default function handler(req, res) {
    res.json({
      DB_HOST: process.env.DB_HOST || "NOT SET",
      DB_USER: process.env.DB_USER || "NOT SET",
      DB_PASSWORD: process.env.DB_PASSWORD ? "SET" : "NOT SET",
      DB_NAME: process.env.DB_NAME || "NOT SET",
      DB_PORT: process.env.DB_PORT || "NOT SET"
    });
  }
  