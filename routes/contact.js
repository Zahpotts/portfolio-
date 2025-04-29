const express = require('express');
const router = express.Router();

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
    .post((req, res) => {
        const { firstName, lastName, email } = req.body;
        // Here you would typically handle the form submission, e.g., save to a database or send an email
        console.log(`Name: ${firstName} ${lastName}, Email: ${email}`);
        res.render('thanks', {firstName, lastName, email}); // Redirect to the contact page after submission
    });

router.get('/thank-you', (req, res) => {
    res.render('thank-you'); // Render a thank you page after form submission
});

module.exports = router;
