const xlsx = require("xlsx");
const path = require("path");

const readExcelSlips = () => {
  const filePath = path.join(__dirname, "../uploads/book1.xlsx");
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  return data; // Returns array of rows
};

module.exports = readExcelSlips;
