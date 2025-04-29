# Google Sheets Contact Portilo App 

This Node.js + Express app allows users to submit a contact form, which saves the submission directly to a Google Sheets spreadsheet using the Google Sheets API and OAuth2.

---

## Features

- Contact form that captures first name, last name, and email
- Data appended to a specified Google Sheet
- EJS templating for rendering views

---

## Project Structure 
├── helper/ │ └── sheets.js # Google Sheets API logic and OAuth ├── routes/ │ ├── contact.js # Handles contact form submission │ └── sheets.js # OAuth authorization flow ├── views/ │ ├── index.ejs │ ├── contact.ejs │ └── thanks.ejs ├── server.js # Main server entry point ├── token.json # (Auto-generated) OAuth2 access/refresh token ├── credentials.json # OAuth2 credentials (from Google Console)