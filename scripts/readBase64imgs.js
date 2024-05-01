const fs = require('fs/promises');
const path = require('path');

async function readFilesAndConvertToBase64(folderPath) {
  try {
    const files = await fs.readdir(folderPath);

    const base64Images = [];
    for (const file of files) {
      const filePath = path.join(folderPath, file);

      // Фильтруем только файлы с расширением .png
      if (path.extname(filePath) === '.png') {
        const data = await fs.readFile(filePath);
        const base64Data = data.toString('base64');

        base64Images.push(base64Data);
      }
    }

    return base64Images;
  } catch (err) {
    console.error('Ошибка при чтении файлов:', err);
    return [];
  }
}

module.exports = readFilesAndConvertToBase64;