# Setting up the crew schedule on Google

About 15 minutes, on a computer. Use a regular Google account (Gmail or a business account), not a school account, which often blocks public web apps.

## 1. Make the Sheet and add the code

1. Go to `sheets.new` and name the spreadsheet.
2. Click **Extensions → Apps Script**.
3. Replace everything in `Code.gs` with the contents of [`Code.gs`](Code.gs). Save.
4. Click **+** next to Files → **HTML**, name it `Index`, and replace its contents with [`Index.html`](Index.html). Save.

## 2. Run the one-time setup

1. Select **Code.gs** (the Run button only shows for `.gs` files).
2. Choose **setup** in the function drop-down and click **Run**.
3. Allow the permissions it asks for (**Advanced → Go to project → Allow**).

The Sheet now has **Events** (with sample events), **Crew** and **Settings** tabs. The editor passcode is in **Settings → B1**.

## 3. Deploy

1. **Deploy → New deployment →** gear icon → **Web app**.
2. Execute as **Me**, Who has access **Anyone**.
3. **Deploy** and copy the URL ending in `/exec`.

After changing the code later: **Deploy → Manage deployments →** edit → Version **New version** → **Deploy**. The URL stays the same.

## Troubleshooting

| Problem | Fix |
|---|---|
| "Sorry, unable to open the file at this time" | The browser is signed in to several Google accounts. Use a private window. |
| The link asks visitors to sign in | Set Who has access to **Anyone** and deploy a new version. |
| No Run button or no `setup` option | Select Code.gs. If it's still missing, paste Code.gs again. |
| The page shows a file name or is blank | Index.html didn't paste fully. Paste it again and deploy a new version. |
