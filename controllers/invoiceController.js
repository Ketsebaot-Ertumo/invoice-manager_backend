const {sequelize} = require('../models/index')
const DataTypes = require('sequelize')
const cloudinary= require('../utilis/cloudinary');
const Invoice = require('../models/invoiceModel')(sequelize, DataTypes);
const { Op } = require('sequelize');



//create invoice
exports.create = async (req, res) => {
    try{

        if(!req.body){
           return res.status(400).json({success: false, message:'Please provide an invoice detail!'})
        }

        const invoice = await Invoice.create(req.body);
        return res.status(201).json({success: true, message: 'Successfully registered.', invoice }); 
        }catch (error){
        console.log(error);
        return res.status(500).json({success: false, message: error.message, stack: error.stack });
        }
          }


//show an invoice
exports.singleShow = async (req, res) => {

    if(!req.params.invoice_number){
        return res.status(400).json({success:false, message:'Please use an invoice number!'})
    }

    try{
        const invoice = await Invoice.findOne({where: {invoice_number: req.params.invoice_number,}, });
        return res.status(200).json({success: true, invoice});
    }catch(err){
        console.error(err);
        return res.status(500).json({success: false, message:'Failed to show an invoice!', error:err.message});
    }  
}


//show all invoices
exports.getAll = async (req, res) => {
    try{
        const invoices = await Invoice.findAll();
        return res.status(200).json({success: true, invoices});
    }catch(err){
        console.error(err);
        return res.status(500).json({success: false, message:'Failed to show all invoices!', error:err.message});
    }  
}




//edit an invoice
exports.update = async (req, res, next) => {
    const { id, ...updates } = req.body;

    try {
        if (!req.params.invoice_number) {
            return res.status(400).json({ success: false, message: 'Please use an invoice number!' });
        }
        const invoice = await Invoice.findOne({where: {id: req.params.invoice_number}});
        if(!invoice){
            return res.status(404).json({success:false, message: 'Invoice not found!'});
        }
        const [updatedCount, [updatedInvoice]] = await Invoice.update(updates, { where: { invoice_number: req.params.invoice_number }, returning: true });

        if (updatedCount === 0) {
            return res.status(304).json({ success: false, message: 'Invoice has no update!' });
        }

        return res.status(200).json({ success: true, updatedInvoice});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message:'Unable to update an invoice!', error: err.message });
    }
};


//delete an invoice(s)
exports.deleteInvoice = async (req, res) => {

    const { invoice_numbers } = req.body;
    try {
        if (!req.body.invoice_numbers) {
            return res.status(400).json({ success: false, message: 'Please provide at least one invoice number or an array of invoice numbers!' });
        }

        let invoicesToDelete = [];
    
        // Check if invoice_numbers are provided in the request body
        if (req.body.invoice_numbers) {
            const invoices = await Invoice.findAll({
                where: {
                    invoice_number: {
                        [Op.in]: req.body.invoice_numbers
                    }
                }
            });
    
            if (invoices.length === 0) {
                return res.status(404).json({ success: false, message: "No invoices found with the given invoice numbers!" });
            }
    
            invoicesToDelete = [...invoicesToDelete, ...invoices];
        }
    
        await Promise.all(invoicesToDelete.map(invoice => invoice.destroy()));
    
        return res.status(200).json({ success: true, message: `Successfully deleted ${invoicesToDelete.length} invoice(s)!` });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
    };


// //delete an invoice
// exports.deleteInvoice = async (req, res) =>{
//     try{
//         if (!req.params.invoice_number) {
//             return res.status(400).json({ success: false, message: 'Please use an invoice number!' });
//         }
//         const current = await Invoice.findOne({where: {invoice_number: req.params.invoice_number} });

//         if (!current) {
//             return res.status(404).json({success: false, message: "An invoice not found!"});
//         }

//         await current.destroy();
//         return res.status(200).json({success: true, message: "Successfully deleted!"})
//     }catch (error){
//         return res.status(500).json({success:false, error:error.message});
//     }
// }
