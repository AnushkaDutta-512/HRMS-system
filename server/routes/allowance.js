const express = require('express');
const router = express.Router();
const AllowanceRequest = require('../models/AllowanceRequest');

router.get('/all', async (req, res) => {
  const requests = await AllowanceRequest.find().populate('userId', 'name email');
  res.json(requests);
});

router.post('/apply', async (req, res) => {
  try {
    const { userId, amount, type, reason } = req.body;
    const newRequest = new AllowanceRequest({ userId, amount, type , reason });
    await newRequest.save();
    res.json({ msg: 'Request submitted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error', err });
  }
});

router.put('/:id', async (req, res) => {
  const { status, remarks } = req.body;
  await AllowanceRequest.findByIdAndUpdate(req.params.id, { status, remarks });
  res.json({ msg: 'Updated successfully' });
});

module.exports = router;
