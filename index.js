const express = require("express");
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;

// Valid options for the 'q' parameter
const VALID_QUERIES = ['broadband', 'mobile', 'timeline'];

// Read data from JSON file
const getData = (query) => {
  try {
    let fileName;
    if (query === 'timeline') {
      fileName = 'data.json';
    } else if (query === 'broadband') {
      fileName = 'broadband.json';
    } else if (query === 'mobile') {
      fileName = 'mobile.json';
    }

    const rawData = fs.readFileSync(path.join(__dirname, fileName));
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
    return null;
  }
};
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(cors({ origin: '*' })); //

// Define endpoint with query parameter validation
app.get("/", (req, res) => {
  // Check if 'q' parameter exists
  if (!req.query.q) {
    return res.status(400).json({ 
      error: "Missing required 'q' parameter" 
    });
  }

  // Check if 'q' parameter has valid value
  const query = req.query.q.toLowerCase();
  if (!VALID_QUERIES.includes(query)) {
    return res.status(400).json({ 
      error: "Invalid query value. Allowed values: broadband, mobile, timeline" 
    });
  }

  // Read data from appropriate JSON file
  const data = getData(query);
  if (!data) {
    return res.status(500).json({ 
      error: "Error reading data" 
    });
  }

  res.json(data);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

