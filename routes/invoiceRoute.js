const express = require('express');
const { update, create, getAll, deleteInvoice, singleShow } = require('../controllers/invoiceController');
const router = express.Router();


router.post('/create', create);
router.get('/all', getAll);
router.get('/show/:invoice_number', singleShow);
router.put('/edit/:invoice_number', update);
router.delete('/delete', deleteInvoice)


module.exports = router;

