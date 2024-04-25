const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
const MemoryStore = require('memorystore')(session)
const app = express();

const userRoutes = require("./routes/user");
const businessRoutes = require("./routes/business");


mongoose.connect(process.env.DBURI,
  { useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log("Database Connected successfully!")
});
// session
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      }),
    resave: false,
    saveUninitialized: false,
}))

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// passport
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use(userRoutes);
app.use("/business", businessRoutes);

app.listen(3000);
