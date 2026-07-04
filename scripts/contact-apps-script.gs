/**
 * Ethereal Majic — contact form backend (Google Apps Script)
 *
 * Receives POSTs from the website's contact form, appends each submission
 * as a row in the attached Google Sheet, and forwards it by email.
 *
 * SETUP (one time, ~5 minutes, signed in as jbsario14@gmail.com):
 *  1. Go to https://sheets.google.com and create a new blank spreadsheet.
 *     Name it e.g. "Ethereal Majic — Contact Submissions".
 *  2. In the sheet: Extensions → Apps Script. Delete any starter code and
 *     paste this entire file. Click the save (disk) icon.
 *  3. Click Deploy → New deployment → gear icon → "Web app".
 *       - Description: contact form
 *       - Execute as: Me
 *       - Who has access: Anyone
 *     Click Deploy. Authorize when Google asks (Advanced → Go to project).
 *  4. Copy the "Web app" URL (ends in /exec) and paste it into
 *     CONTACT_WEBHOOK_URL in src/components/ContactSection.tsx.
 *
 * To update the script later: edit, then Deploy → Manage deployments →
 * pencil icon → Version: New version → Deploy (the URL stays the same).
 */

var EMAIL_TO = "jbsario14@gmail.com";

function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  var name = String(data.name || "").slice(0, 100);
  var email = String(data.email || "").slice(0, 255);
  var phone = String(data.phone || "").slice(0, 20);
  var message = String(data.message || "").slice(0, 1000);

  // 1) Append to the spreadsheet this script is attached to
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Name", "Email", "Phone", "Message"]);
  }
  sheet.appendRow([new Date(), name, email, phone, message]);

  // 2) Forward by email
  MailApp.sendEmail({
    to: EMAIL_TO,
    replyTo: email || EMAIL_TO,
    subject: "New website inquiry from " + (name || "a visitor"),
    body:
      "New contact form submission on the Ethereal Majic website:\n\n" +
      "Name: " + name + "\n" +
      "Email: " + email + "\n" +
      "Phone: " + phone + "\n\n" +
      "Message:\n" + message + "\n\n" +
      "— Saved to the Contact Submissions sheet as well.",
  });

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
