const dotenv = require("dotenv");
dotenv.config();

const { google, Auth } = require("googleapis");

const auth = new Auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

const spreadsheetId = process.env.SPREADSHEET_ID;

let googleSheets = null;

let emails = [];

const initializeGoogleSheetsClient = async () => {
  console.log("Initialising google sheets client");

  const client = await auth.getClient();

  googleSheets = google.sheets({ version: "v4", auth: client });
};

const getAllEmails = async () => {
  if (!googleSheets) {
    await initializeGoogleSheetsClient();
  }

  const response = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Emails!A:A",
  });

  emails = [];
  console.log(`Fetched ${response.data.values.length} entries`);

  for (let i = 1; i < response.data.values.length; ++i) {
    emails.push(response.data.values[i][0]);
  }

  console.log({ emails });

  return emails;
};

module.exports = {
  initializeGoogleSheetsClient,
  getAllEmails,
  registeredEmails: emails,
};
