const express = require('express');
const router = express.Router();
const { addContactToSheet } = require('../helper/sheets'); // Import the function to add contact to Google Sheets

// Middleware to log request time
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
})
// Chained route handlers for /contact
router.route('/')
    .get((req, res) => {
        res.render('contact');
    })
    .post(async(req, res) => {
        const { firstName, lastName, email } = req.body;
        // Here you would typically handle the form submission, e.g., save to a database or send an email
        try{

         const spreadsheetId = req.spreadsheetId; // Get the spreadsheet ID from the request object
         await addContactToSheet(spreadsheetId, { firstName, lastName, email }); // Call the function to add contact to Google Sheets 
        console.log(`Name: ${firstName} ${lastName}, Email: ${email}`);
        res.render('thanks', {firstName, lastName, email}); // Redirect to the contact page after submission
        }
        catch (err) {
            console.error('Error adding contact to sheet:', err);
            res.status(500).send('Error adding contact to sheet');
        }
    });

router.get('/thank-you', (req, res) => {
    res.render('thank-you'); // Render a thank you page after form submission
});

module.exports = router;
