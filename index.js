require("dotenv").config();
const express = require("express");
const path = require("path");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();

// Set the view engine to EJS
app.set("view engine", "ejs");

// Configure body-parser middleware
app.use(bodyParser.json()); // Parse JSON bodies

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Render index.html
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// call openai
app.post("/prompt", async (req, res) => {
  try {
    const { text } = req.body;
    if (text && text.length > 50) {
      res.status(400).send("Maximum prompt length has been exceeded!");
    }
    const { data: reply } = await axios.post(
      process.env.OPENAI_ENDPOINT_CHAT,
      {
        model: "gpt-3.5-turbo",
        n: 1,
        messages: [
          {
            role: "user",
            content: text,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_APIKEY}`,
        },
      }
    );

    const { choices } = reply;
    const [firstChoice] = choices;
    const {
      message: { content },
    } = firstChoice;

    res.status(200).send(content);
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).send("Internal Server Error!");
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
