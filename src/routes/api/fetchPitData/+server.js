import { google } from 'googleapis';
import { GOOGLE_PRIVATE_KEY, GOOGLE_CLIENT_EMAIL } from '$env/static/private';

const auth = new google.auth.GoogleAuth({
    credentials: {
        private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: GOOGLE_CLIENT_EMAIL,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

export async function GET({ url }) {
    try {
        // Extract spreadsheetID from query parameters
        const spreadsheetID = url.searchParams.get('spreadsheetID');
        if (!spreadsheetID) {
            return new Response(JSON.stringify({ error: 'Missing spreadsheetID' }), { status: 400 });
        }

        const range = 'Pitscouting!A31:V100'; // Adjust the range as needed
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetID,
            range,
        });

        const rows = response.data.values;

        if (!rows || rows.length === 0) {
            return new Response(JSON.stringify({ error: 'No data found in the spreadsheet' }), { status: 404 });
        }

        return new Response(JSON.stringify({ data: rows }), { status: 200 });
    } catch (error) {
        console.error('Error fetching data from Google Sheets:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch data from Google Sheets' }), { status: 500 });
    }
}