const readFilesAndConvertToBase64 = require("../scripts/readBase64imgs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const beta = await readFilesAndConvertToBase64("beta");
    const osn = await readFilesAndConvertToBase64("osn");
    const sint = await readFilesAndConvertToBase64("sint");
    const tuber = await readFilesAndConvertToBase64("tuber");
    const virus = await readFilesAndConvertToBase64("virus");
    const citostatic = await readFilesAndConvertToBase64("citostatic");

    const cards = [
      ...beta.map(img => ({formula: img, lesson: "Бета-лактамы"})),
      ...osn.map(img => ({formula: img, lesson: "Основные_Группы"})),
      ...sint.map(img => ({formula: img, lesson: "Синтетические"})),
      ...tuber.map(img => ({formula: img, lesson: "Туберкулез"})),
      ...virus.map(img => ({formula: img, lesson: "Вирусы"})),
      ...citostatic.map(img => ({formula: img, lesson: "Противоопухолевые"})),
    ];

    return queryInterface.bulkInsert('Cards', cards);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Cards", {})
  }
};