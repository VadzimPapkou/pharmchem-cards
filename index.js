const express = require('express');
const path = require("path");
const {Card} = require("./models");
const app = express();
const { exec } = require('child_process');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/cards", async (req, res) => {
  res.json(
    await Card.findAll({order: ["id"]})
  )
});

app.put("/cards/:id", async (req, res) => {
  const card = await Card.findByPk(req.params.id);
  if (!card) {
    return res.status(404).json({ error: "Card not found" });
  }
  res.send(await card.update(req.body));
});

app.post("/drop", async (req, res) => {
  res.send(await Card.drop());
});

app.post("/seed", async (req, res) => {
  exec("npx sequelize-cli db:seed:all", () => {
    res.end();
  })
});

app.use("/view", express.static("view"));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "view/index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});