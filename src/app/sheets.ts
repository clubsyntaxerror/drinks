import { google, sheets_v4 } from "googleapis";

let cachedClient: sheets_v4.Sheets | null = null;

function getSheetsClient() {
    if (cachedClient) {
        return cachedClient;
    }

    const jwt = new google.auth.JWT(
        process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        undefined,
        (process.env.GOOGLE_SHEETS_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
        ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    );

    cachedClient = google.sheets({ version: "v4", auth: jwt });
    return cachedClient;
}

// Returns raw rows for a given tab name, header row included. Throws on any auth/network/config
// problem so callers can decide how to fall back (see drinksData.ts).
export async function getSheetRows(tab: string): Promise<string[][]> {
    const sheets = getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.DRINKS_SPREADSHEET_ID,
        range: tab,
    });

    return (response.data.values ?? []) as string[][];
}
