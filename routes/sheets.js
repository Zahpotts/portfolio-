const express = require('express');
const router = express.Router();
const {getAuthUrl, handleAuthCallback} = require('../helper/sheets');

let oAuth2ClientTemp = null; // Temporary variable to store the OAuth2 client

router.get('/', async (req, res) => {
    try{
        const {authUrl, oAuth2Client} = await getAuthUrl();
        oAuth2ClientTemp = oAuth2Client; // Store the OAuth2 client in the temporary variable
        res.redirect(authUrl); // Redirect the user to the authentication URL
    }
    catch (err){
        console.error('Error getting auth URL:', err);
        res.status(500).send('Error getting auth URL');
    }
});

// Callback route - handles the OAuth2 redirect
router.get('/callback', async (req, res) => {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).send('Authorization code not provided');
    }
    
    try {
      await handleAuthCallback(code, oAuth2ClientTemp);
      res.send('Authorization successful! You can now use the Google Sheets API. <a href="/">Go back to home</a>');
    } catch (error) {
      console.error('Error handling auth callback:', error);
      res.status(500).send('Error handling authorization');
    }
  });
  
  module.exports = router;
