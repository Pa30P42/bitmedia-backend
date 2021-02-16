const sqlite3 = require("sqlite3").verbose();
const users = require("./users.json");
const users_statistics = require("./users_statistic.json");

const connectToDB = () => {
  return new sqlite3.Database(":memory:", (error) =>
    error ? console.log(error) : console.log("Sqlite conected")
  );
};

const userInfo = connectToDB();

const createTables = () => {
  userInfo.serialize(function () {
    userInfo.run(
      "CREATE TABLE if not exists users (id INT PRIMARY KEY, first_name TEXT, last_name TEXT, email TEXT, gender TEXT, ip_address TEXT)",
      (err) => err && console.log(err)
    );
    const stmt = userInfo.prepare("INSERT INTO users VALUES (?,?,?,?,?,?)");
    users.forEach((el) => {
      stmt.run(
        el.id,
        el.first_name,
        el.last_name,
        el.email,
        el.gender,
        el.ip_address
      );
    });
    stmt.finalize();
  });

  userInfo.serialize(function () {
    userInfo.run(
      "CREATE TABLE if not exists users_statistics (user_id INT , date TEXT, page_views INT, clicks INT)",
      (err) => err && console.log(err)
    );
    const stmt = userInfo.prepare(
      "INSERT INTO users_statistics VALUES (?,?,?,?)"
    );
    users_statistics.forEach((el) => {
      stmt.run(el.user_id, el.date, el.page_views, el.clicks);
    });
    stmt.finalize();
  });
};

module.exports = { userInfo, createTables };
