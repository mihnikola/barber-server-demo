const Token = require("../models/Token");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// API route to save FCM Token
exports.saveToken = async (req, res) => {
  const { tokenExpo } = req.body;
  try {
    // Save the token to MongoDB

    const tokens = await Token.findOne({ token: tokenExpo });
    if (tokens) {
      return res.status(200).send("Token already exist");
    }
     
        const newToken = new Token({ token: tokenExpo });
        await newToken.save();
     

      res.status(200).send("Token saved successfully");
      console.log("Token saved successfully");
    
  } catch (error) {
    console.error("Error saving token:", error);
    res.status(500).send("Failed to save token");
  }
};

// API route to send push notification
exports.sendNotification = async (req, res) => {
  const { token, title, content, data } = req.body;

  try {
    const message = {
      to: token,
      sound: "default",
      title: title,
      body: content,
      data: { someData: data },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    res.status(200).json("Successfully sent notification");
  } catch (error) {
    res.status(500).json("Error send notification");
  }
};
