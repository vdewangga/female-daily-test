const express = require("express");
const next = require("next");
const axios = require("axios");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

var whitelist = ["http://localhost:3000"];
var corsOptions = function (origin, callback) {
  var corsOptions;
  if (whitelist.indexOf(origin) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

const checkIfHaveCookies = (req, res, next) => {
  let cookies = req.cookies["loginCookies"];
  const allow = ["login", "service-worker.js", "_next"];
  if (!cookies && !allow.includes(req.originalUrl?.split("/")[1])) {
    res.redirect("/login");
    return;
  }
  next();
};

let tempData = [];

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(cors(corsOptions));
    server.use(express.json());
    server.use(cookieParser());

    server.get("/api/v1/products", checkIfHaveCookies, async (req, res) => {
      const { _page, _limit, product_name } = req.query;
      try {
        if (tempData.length === 0) {
          const response = await axios.get(
            "https://3523f64a-177f-4429-9954-60c0329cb886.mock.pstmn.io/products"
          );
          tempData = [...response.data];
        }

        const changeResponse = tempData.slice((_page - 1) * 10, _limit * _page);
        res.status(200).send({
          data: changeResponse,
          count: tempData.length,
        });
      } catch (error) {
        res.send(error.status);
      }
    });

    server.get("/api/v1/products/:id", checkIfHaveCookies, async (req, res) => {
      const { id } = req.params;
      try {
        if (tempData.length === 0) {
          const response = await axios.get(
            "https://3523f64a-177f-4429-9954-60c0329cb886.mock.pstmn.io/products"
          );
          tempData = [...response.data];
        }
        const changeResponse = tempData.filter((item) => item.id == id);
        res.status(200).send({
          data: changeResponse,
        });
      } catch (error) {
        res.send(error.status);
      }
    });

    server.post("/api/v1/products", checkIfHaveCookies, async (req, res) => {
      tempData = [{ ...req.body, id: new Date() / 1 }, ...tempData];
      res.status(201).send(true);
    });

    server.patch("/api/v1/products", checkIfHaveCookies, async (req, res) => {
      const data = tempData.map((item) => {
        if (item.id == req.body.id) {
          return req.body;
        }
        return item;
      });
      tempData = [...data];
      res.status(201).send(true);
    });

    server.delete(
      "/api/v1/products/:id",
      checkIfHaveCookies,
      async (req, res) => {
        const { id } = req.params;
        const data = tempData.filter((item) => item.id != id);
        tempData = [...data];
        res.status(200).send(true);
      }
    );

    server.get("/api/v1/user", async (req, res) => {
      let cookies = req.cookies["loginCookies"];
      res.status(200).send(JSON.parse(cookies));
    });

    server.post("/api/v1/login", async (req, res) => {
      try {
        const response = await axios.get(
          "https://3523f64a-177f-4429-9954-60c0329cb886.mock.pstmn.io/users"
        );

        const haveEmail = response.data.filter(
          (item) => item.email === req.body.email
        );
        if (haveEmail.length > 0) {
          res.cookie("loginCookies", JSON.stringify(haveEmail), {
            maxAge: 900000,
            httpOnly: true,
          });
          res.status(response.status).send(true);
          return;
        }
        res.status(400).json({ message: "error login" });
      } catch (error) {
        res.status(400).json({ message: "error login" });
      }
    });

    server.post("/api/v1/logout", async (req, res) => {
      try {
        res.clearCookie("loginCookies");
        res.status(200).send(true);
      } catch (error) {
        res.status(400).json({ message: "error login" });
      }
    });

    server.get("*", checkIfHaveCookies, (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, (err) => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
