const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const errorController = require("../helpers/errorController");
const { createTables } = require("../db/sqliteDb");
const AppError = require("../helpers/appError");
const usersRouter = require("../users/users.router");

const PORT = process.env.PORT || 80;

class CrudServer {
  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRouters();
    await this.initDataBase();
    this.initErrorHandling();
    this.startListening();
  }

  initServer() {
    this.app = express();
  }
  initMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors({ origin: "https://bitmedia-pa30p42.netlify.app" }));
    this.app.use(morgan("combined"));
  }

  initRouters() {
    this.app.use("/", usersRouter);
  }

  async initDataBase() {
    try {
      createTables();
      console.log("Database has been started");
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }

  initErrorHandling() {
    this.app.all("*", (req, res, next) => {
      next(new AppError(`Can't find ${req.originalUrl}`, 404));
    });
    this.app.use(errorController);
  }

  startListening() {
    this.app.listen(PORT, () => {
      console.log("Server started listening on port", PORT);
    });
  }
}

exports.crudServer = new CrudServer();
