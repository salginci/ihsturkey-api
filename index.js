const express = require("express");

const app = express();
const port = process.env.PORT || 8080;

// Define a single endpoint
app.get("/", (req, res) => {
  res.json({ message: "Hello from Google Cloud Run!" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

