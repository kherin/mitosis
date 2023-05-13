const express = require("express");
const path = require("path");

const app = express();

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Render index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
