const { userInfo } = require("../db/sqliteDb");

const getUsers = (req, res) => {
  const {
    query: { page = 1, usersPerPage = 15 },
  } = req;
  const skip = (page - 1) * usersPerPage;
  const usersList = {};
  userInfo.serialize(() => {
    userInfo.all(
      `SELECT * FROM users LIMIT ${skip}, ${usersPerPage}`,
      (err, result) => {
        usersList.users = result;
      }
    ),
      userInfo.all(
        `SELECT * FROM users_statistics WHERE user_id>${skip} AND user_id<=${
          page * usersPerPage
        }`,
        (err, result) => {
          usersList.users.map((user) => {
            user.total_clicks = result
              .filter((el) => el.user_id === user.id)
              .reduce((acc, el) => acc + el.clicks, 0);
            user.total_page_views = result
              .filter((el) => el.user_id === user.id)
              .reduce((acc, el) => acc + el.page_views, 0);
            return user;
          });
        }
      ),
      userInfo.all(`SELECT COUNT(*) FROM USERS`, (err, result) => {
        usersList.numberOfPage = Math.ceil(
          result[0]["COUNT(*)"] / Number(usersPerPage)
        );
        usersList.page = page;
        return res.status(200).send(usersList);
      });
  });
};

const getUserById = (req, res) => {
  const {
    params: { user_id },
  } = req;
  const userData = {};
  userInfo.serialize(() => {
    userInfo.all(
      `SELECT * FROM users_statistics WHERE user_id = ${user_id}`,
      (err, result) => {
        if (err) {
          return res.status(404).send(err.message);
        }
        console.log(result);
        userData.active = result;
      }
    );
  });
  userInfo.get(
    `SELECT first_name, last_name  FROM users WHERE id = ${user_id}`,
    (err, result) => {
      if (err) {
        return res.status(404).send(err.message);
      }
      userData.userName = result;
      return res.status(200).send(userData);
    }
  );
};

module.exports = { getUsers, getUserById };
