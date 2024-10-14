const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
require("dotenv").config();
const fs = require("fs");
const multer = require("multer");
const path = require("path");

// Models
const User = require("./models/user");
const Place = require("./models/Place");
const BookingModel = require("./models/booking");

// Middleware setup
app.use(express.json());
app.use(cookieParser()); // Ensure cookie-parser is available to all routes
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Constants for bcrypt and jwt
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "shivaku,madjhjhjsh";

// CORS setup to allow credentials
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173", // Update to match your frontend origin
  })
);

// Test route to check server
app.get("/test", (req, res) => {
  res.json(`Server is up and running`);
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

  function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
      const token = req.cookies?.token;
      if (!token) return reject(new Error("Token is missing"));
      jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
        if (err) reject(err);
        resolve(userData);
      });
    });
  }
  
// Register route
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, bcryptSalt);

  try {
    const userDoc = await User.create({ name, email, password: hashedPassword });
    res.json(userDoc);
  } catch (err) {
    res.status(422).json(err);
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtSecret, {}, (err, token) => {
        if (err) throw err;
        res
          .cookie("token", token, {
            httpOnly: true,
            secure: false, // Set to true only if using HTTPS
            sameSite: "lax",
          })
          .json(userDoc);
      });
    } else {
      res.status(422).json("Password incorrect");
    }
  } else {
    res.status(422).json("User not found");
  }
});

// Utility to get user data from JWT token

// Profile route
app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) return res.status(403).json({ error: "Invalid token" });
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

// Logout route
app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

// Route to upload images by link with validation
app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  if (!link) return res.status(400).json({ error: "Link is required" });
  const newName = `Photos${Date.now()}.jpg`;
  try {
    await imageDownloader.image({
      url: link,
      dest: path.join(__dirname, "/uploads/", newName),
    });
    res.json(newName);
  } catch (err) {
    res.status(500).json({ error: "Failed to download image", details: err.message });
  }
});

// Route to upload photos with multer
const photosMiddleware = multer({ dest: "uploads/" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = `${path}.${ext}`;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads", ""));
  }
  res.json(uploadedFiles);
});

// Create place route with token verification
app.post("/places", (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: "Token is required" });

  const { title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuest, price } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    const placeDoc = await Place.create({
      owner: userData.id,
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuest,
      price,
    });
    res.json(placeDoc);
  });
});

// Fetch places route with token verification
app.get("/user-places", (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: "Token is required" });

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    const places = await Place.find({ owner: userData.id });
    res.json(places);
  });
});

// Get specific place by ID
app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

// Update place route
app.put("/places", async (req, res) => {
  const { token } = req.cookies;
  const { id, title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuest, price } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json("Unauthorized");

    const placeDoc = await Place.findById(id);
    if (placeDoc && userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuest,
        price,
      });
      await placeDoc.save();
      res.json("ok");
    } else {
      res.status(403).json("Forbidden");
    }
  });
});

// Get all places
app.get("/places", async (req, res) => {
  res.json(await Place.find());
});

// Bookings route
app.post("/bookings", async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const { place, checkIn, checkOut, numberOfGuest, name, phone, price } = req.body;

    const bookingDoc = await BookingModel.create({
      place,
      checkIn,
      checkOut,
      numberOfGuest,
      name,
      phone,
      price,
      user: userData.id,
    });
    res.json(bookingDoc);
  } catch (err) {
    res.status(500).json({ error: "Booking creation failed", details: err.message });
  }
});


// app.get("/bookings", async (req, res) => {
//   try {
//     const userData = await getUserDataFromReq(req);
//     const bookings = await BookingModel.find({ user: userData.id });
//     res.json(await BookingModel.find({ user: userData.id }).populate('place'));
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch bookings", details: err.message });
//   }
// });

// app.get("/bookings", async (req, res) => {
//   try {
//     const userData = await getUserDataFromReq(req);
//     const bookings = await BookingModel.find({ user: userData.id }).populate('place');
//     res.json(bookings);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch bookings", details: err.message });
//   }
// });
app.get("/bookings", async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const bookings = await BookingModel.find({ user: userData.id }).populate('place');
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings with populated place data:", err);
    res.status(500).json({ error: "Failed to fetch bookings", details: err.message });
  }
});
const port =process.env.PORT || 4000;

// Start server
app.listen(port, () => {
  console.log("Server running on port 4000");
});
