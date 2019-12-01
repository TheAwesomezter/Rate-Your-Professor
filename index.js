const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const sqlite3 = require("sqlite3");

const app = new express();
const db = new sqlite3.Database("./rateYourProfessor.db", err => {
  if (err) throw err;
  console.log("Connected to SQL Database");
});

// let con = mysql.createConnection({
//   host: "localhost",
//   user: "administrator",
//   password: "veryGood",
//   database: "rateYourProfessor"
// });

const port = process.env.PORT || 8080;
let reqNo = 1;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("./public/"));
app.use(express.static("./public/html/"));
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.redirect("./public/html/index.html");
});

app.post("/reviewData", (req, res) => {
  // console.log("Got a ping! Number: " + reqNo);
  // reqNo++;
  const data = req.body;
  let timestamp = Date.now();
  data.timestamp = timestamp;
  console.log(data);

  res.json({
    status: "success",
    timestamp: timestamp
  });

  db.run(
    "CREATE TABLE IF NOT EXISTS reviews (id INTEGER PRIMARY KEY AUTOINCREMENT, university_name TEXT, campus TEXT, faculty_name TEXT, review TEXT, time TIMESTAMP DEFAULT DATETIME('now'))",
    err => {
      if (err) {
        console.log(err);
      }
    }
  );

  db.run(
    "INSERT INTO reviews (university_name, campus, faculty_name, review) values (?, ?, ?, ?)",
    [data.u_name, data.c_name, data.f_name, data.review],
    err => {
      if (err) {
        console.log(err);
      }
      console.log("A row has been inserted with row_id " + this.lastID);
    }
  );

  // con.connect(err => {
  //   if (err) throw err;
  //   console.log("Connected to Database");
  // });
  // let sql =
  // "insert into reviews (university_name, campus, faculty_name, review) values (" +
  // " ' " +
  // data.u_name +
  // " ' " +
  // ", " +
  // " ' " +
  // data.c_name +
  // " ' " +
  // ", " +
  // " ' " +
  // data.f_name +
  // " ' " +
  // ", " +
  // " ' " +
  // data.review +
  // " ' " +
  // ")";
  // con.query(sql, (err, res) => {
  //   if (err) throw err;
  //   console.log("Inserted into database");
  // });
  // db.close();
  console.log("inserted?");
});

app.get("/receivingReviews", (req, res) => {
  // console.log("Got a ping! Number: " + reqNo);
  // reqNo++;

  let sql = "select * from reviews";
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.log(err.message);
    }
    res.json(rows);
  });
  // db.close();
});

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
