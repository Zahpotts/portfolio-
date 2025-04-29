const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is created
// automatically when the authorization flow completes for the first time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');


//READS PREVIOUSLY SAVED CREDENTIALS
async function loadSavedCredentials() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}
//SAVES CREDENTIALS TO TOKEN.JSON
async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content)
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    }); 
    await fs.writeFile(TOKEN_PATH, payload);
}
//AUTHENTICATES THE USER
async function authorize() {
    let client = await loadSavedCredentials();
    if (client) {
        return client;
    }
    throw new Error('No saved credentials found. Please authenticate first.');
}

//get the url to authenticate the user
function getAuthUrl() {
    return new Promise(async (resolve, reject) => {
        try{
            const content = await fs.readFile(CREDENTIALS_PATH);
            const keys = JSON.parse(content);
            const key = keys.installed || keys.web;
            const oAuth2Client = new google.auth.OAuth2(
                key.client_id,
                key.client_secret,
                key.redirect_uris[0]
            );
            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES,
            });
            resolve({authUrl, oAuth2Client});
        } catch (err) {
            reject(err);
        }
    });
}   

// handler for the callback URL after user authentication

async function handleAuthCallback(code, oAuth2Client) {
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        // Store the token to disk for later program executions
        await saveCredentials(oAuth2Client);
        return oAuth2Client;
      } catch (err) {
        throw err;
      }
    }
    async function addContactToSheet(spreadsheetId, contact) {
        try {
          const auth = await authorize();
          const sheets = google.sheets({version: 'v4', auth});
          
          // Format the current date
          const now = new Date();
          const date = now.toLocaleDateString();
          const time = now.toLocaleTimeString();
          
          // Create values array - adjust these columns to match your spreadsheet
          const values = [
            [date, time, contact.firstName, contact.lastName, contact.email || '']
          ];
          
          const resource = {
            values,
          };
          
          // Append the values to the spreadsheet
          const result = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A:F',  // Adjust this range to match your spreadsheet
            valueInputOption: 'USER_ENTERED',
            resource,
          });
          
          return result;
        } catch (err) {
          console.error('The API returned an error:', err);
          throw err;
        }
      }

module.exports = { authorize, getAuthUrl, handleAuthCallback, addContactToSheet };