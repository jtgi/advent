const { google } = require('googleapis');
const sheets = google.sheets('v4');

const credentials = JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'base64'));
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

async function getAuthToken() {
    const auth = new google.auth.GoogleAuth({
        scopes: SCOPES,
        credentials
    });
    const authToken = await auth.getClient();
    return authToken;
}

async function getSpreadSheet(spreadsheetId, auth) {
    const res = await sheets.spreadsheets.get({
        spreadsheetId,
        auth,
    });
    return res;
}

async function getSpreadSheetValues(spreadsheetId, sheetName, auth) {
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        auth,
        range: sheetName,
    });
    return res;
}

module.exports = {
    getAuthToken,
    getSpreadSheet,
    getSpreadSheetValues
}
