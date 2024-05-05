const express = require('express');
const path = require("path");
const cookieParser = require('cookie-parser')
const {Card} = require("./models");
const app = express();
const { exec } = require('child_process');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


function auth(req, res, next) {
  if(req.cookies.password === process.env.PASSWORD) {
    next();
  } else {
    res.status(401).end();
  }
}

app.get("/cards", auth, async (req, res) => {
  res.json(
    await Card.findAll({order: ["id"]})
  )
});

app.put("/cards/:id", auth, async (req, res) => {
  const card = await Card.findByPk(req.params.id);
  if (!card) {
    return res.status(404).json({ error: "Card not found" });
  }
  res.send(await card.update(req.body));
});

app.use("/view", express.static("view"));

app.get("/401", (req, res) => {
  res.sendFile(path.join(__dirname, "view/401.html"));
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "view/index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
