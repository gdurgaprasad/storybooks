const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");
const passport = require("passport");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require('method-override');
const connectDB = require("./config/db");
const indexRoutes = require("./routes/index");

/*ENVIRONMENT & PORT CONFIG */
dotenv.config({ path: "./config/config.env" });
const PORT = process.env.PORT || 5000;

/*MONGODB CONFIGURATION */
const app = express();
connectDB();

/*BODY PARSER CONFIG */
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

/*METHOD OVERWRIDE MIDDLEWARE */
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method
    delete req.body._method
    return method
  }
}))

/*MORGAN CONFIG - FOR LOGGING*/
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const { formatDate, truncate, stripTags, editIcon, select, formatTitle } = require('./helpers/hbs')
/*TEMPLATE ENGINE CONFIG */
app.engine(".hbs", exphbs({ helpers: { formatDate, truncate, stripTags, editIcon, select, formatTitle }, defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

/*SESSION CONFIG */
app.use(expressSession({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  })
}))

/*PASSPORT MIDDLEWARECONFIG */
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session())

/*CONFIG GLOBAL VARIABLE */
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
})

/*STATIC FOLDER CONFIG */
app.use(express.static(path.join(__dirname, 'public')))

/*ROUTE CONFIG */
app.use("/", indexRoutes);
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"))
app.listen(
  PORT,
  console.log(`Server running on ${process.env.NODE_ENV} mode in port ${PORT}`)
);
