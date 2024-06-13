const express = require('express');
const { formSubmission } = require('../controllers/form');
const router = express.Router();


// send form data with email
router.post('/send-email', formSubmission);

module.exports = router;