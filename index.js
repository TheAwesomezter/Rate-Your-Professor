const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = new express();

let con = mysql.createConnection({
  host: "localhost",
  user: "administrator",
  password: "veryGood",
  database: "rateYourProfessor"
});

const port = process.env.PORT || 8080;
let reqNo = 1;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("./public/"));
app.use(express.static("./public/html/"));
app.use(express.json({ limit: "1mb" }));

app.post("/reviewData", (req, res) => {
  console.log("Got a ping! Number: " + reqNo);
  const data = req.body;
  let timestamp = Date.now();
  data.timestamp = timestamp;
  console.log(data);

  res.json({
    status: "success",
    timestamp: timestamp
  });

  con.connect(err => {
    if (err) throw err;
    console.log("Connected to Database");
  });
  let sql =
    "insert into reviews (university_name, campus, faculty_name, review) values (" +
    " ' " +
    data.u_name +
    " ' " +
    ", " +
    " ' " +
    data.c_name +
    " ' " +
    ", " +
    " ' " +
    data.f_name +
    " ' " +
    ", " +
    " ' " +
    data.review +
    " ' " +
    ")";
  con.query(sql, (err, res) => {
    if (err) throw err;
    console.log("Inserted into database");
  });
});

app.get("/receivingReviews", (req, res) => {
  // con.connect(err => {
  //   if (err) throw err;
  //   console.log("Connected to Database");

  console.log("Got a ping! Number: " + reqNo);

  let sql = "select * from reviews";
  con.query(sql, (err, result, fields) => {
    if (err) throw err;

    console.log(result);
    res.json(result);
  });
  // });
});

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
