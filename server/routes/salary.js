const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const path = require('path');

// GET salary slips from Excel dynamically
router.get('/slips/:userId', (req, res) => {
  const { userId } = req.params;

  try {
    // Correct path to your Excel file
    const workbook = XLSX.readFile(path.join(__dirname, '../uploads/book1.xlsx'));
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    // Filter by Emp ID from Excel
    const userSlips = data.filter(row => row['Emp ID'] === userId);

    if (userSlips.length === 0) {
      return res.status(404).json({ message: 'No salary slips found for this user.' });
    }

    const slips = userSlips.map(row => ({
      month: row["Month"],
      netSalary: row["Net Salary"],
      details: [
        { component: "Basic Salary", amount: row["Basic Salary"] },
        { component: "HRA", amount: row["HRA"] },
        { component: "Conveyance", amount: row["Conveyance"] },
        { component: "Medical", amount: row["Medical"] },
        { component: "Provident Fund", amount: row["Provident Fund"] },
        { component: "Bonus", amount: row["Bonus"] },
        { component: "Deductions", amount: row["Deductions"] },
        { component: "Remarks", amount: row["Remarks"] }
      ]
    }));

    res.json(slips);
  } catch (error) {
    console.error('Error reading salary slips:', error);
    res.status(500).json({ message: 'Failed to read salary slips from Excel.' });
  }
});

module.exports = router;
