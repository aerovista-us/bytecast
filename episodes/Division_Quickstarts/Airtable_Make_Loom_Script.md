# Loom Walkthrough — Airtable + Make Starter (5:00)

**Goal:** In 5 minutes, wire the No‑M365 variant: Airtable base → Make scenario → Google Doc → PDF → Email → writeback link.

**What you’ll need**
- The ZIP: `AeroVista_Airtable_Make_Starter.zip` (already downloaded)
- Airtable account (free is fine)
- Google Drive/Docs + Gmail (or SMTP) connected in **Make**

---

## 0:00 – 0:20 Hook & outcome
**On‑screen:** Title card “AeroVista: Owner Report in 60 minutes (demo in 5)”.  
**Voiceover:** “I’m going to turn Airtable records into owner‑ready PDFs with photos, email the link, and update Airtable—using the starter kit.”

---

## 0:20 – 2:05 Airtable base (import + links + views)
**On‑screen:** Airtable → “Create a base from CSV”.  
**Voiceover:** “Import the CSVs in this order: Properties, Units, Inspections, Photos, Issues.”

1) **Import Properties.csv**  
   - Primary field = `PropertyName`. Keep `PropertyID` as text.

2) **Import Units.csv**  
   - Primary field = `UnitID`. Add a field **Property** (Link to *Properties*). Map from `PropertyID`.

3) **Import Inspections.csv**  
   - Primary = `InspectionID`. Add **Property** (link to Properties) and **Unit** (link to Units).  
   - Change **Status** to *Single select*: `Draft`, `Submitted`, `PDF Generated`, `Closed`.  
   - Add optional formula field **DurationHours**:  
     ```
     DATETIME_DIFF({EndISO}, {StartISO}, 'minutes')/60
     ```

4) **Import Photos.csv**  
   - Add **Inspection** (Link to *Inspections*). Keep **Url** (URL).

5) **Import Issues.csv**  
   - Add **Inspection** (Link to *Inspections*).

6) **Create two views** in *Inspections*:  
   - **Submitted** → Filter `Status = Submitted`  
   - **Needs PDF** → Filter `Status = Submitted` AND `PDFUrl is empty`

**Callout:** If you see unmatched links, open the column menu → “Customize field type” → convert to **Link to another record** and re-map by ID.

---

## 2:05 – 2:35 Google Docs template
**On‑screen:** Google Drive → Upload `Templates/Owner_Report_Template_GDocs.docx`.  
**Voiceover:** “Upload the owner report template and grab the File ID from the URL. Create an output folder and copy its ID too.”

Placeholders in the doc are like `{{Property}}`, `{{Unit}}`, `{{Inspector}}`, `{{StartISO}}`, `{{EndISO}}`, `{{Issues}}`, `{{Photo1…PhotoN}}` (we’ll loop images).

---

## 2:35 – 4:45 Make scenario (8 modules)
**On‑screen:** Make.com → New Scenario.

**Module 1 — Airtable: Watch Records (trigger)**  
- Base: your base → Table: **Inspections** → View: **Submitted**  
- Event: *Created or Updated*  
- Run once to sample data.

**Module 2 — Airtable: Search Records (photos)**  
- Table: **Photos**  
- Filter by Formula: `{Inspection} = "{{1.recordId}}"` *(use output from step 1)*  
- Limit 10. Test to see photos.

**Module 3 — Google Docs: Create from Template**  
- Template file: the uploaded DOCX ID  
- Title: `Owner Report - {{Property}} {{Unit}} {{EndISO}}`

**Module 4 — Google Docs: Replace Text (batch or repeated)**  
- Replace placeholders with fields from Module 1:  
  `{{Property}}`, `{{Unit}}`, `{{Inspector}}`, `{{StartISO}}`, `{{EndISO}}`, `{{Issues}}`

**Module 5 — Iterator + Google Docs: Insert Image(s)**  
- Add **Iterator** over results from Module 2.  
- For each, **Insert Image** using `Url`. Position inline.

**Module 6 — Google Drive: Export File as PDF**  
- Source: Document from Module 3  
- Destination folder: your output folder ID  
- Capture `webViewLink`.

**Module 7 — Airtable: Update Record**  
- Table: **Inspections**  
- Record ID: from Module 1  
- Set `PDFUrl` = `webViewLink`; set `Status` = `PDF Generated`

**Module 8 — Gmail (or SMTP): Send Email**  
- To: `OwnerEmail` from *Inspections* (fallback to ops@ if empty)  
- Subject: `Owner Turn Report — {{Property}} {{Unit}}`  
- HTML body: include the link (use `EmailTemplates/Owner_Report_Email.html`).

**Run Once** → confirm a PDF is created, Airtable updates `PDFUrl`, and email lands.

---

## 4:45 – 5:00 Schedule + next steps
**On‑screen:** Scenario settings → Scheduling ON; 5-min interval.  
**Voiceover:** “Turn on scheduling. Next steps: customize the template branding, cap images to 10, and add a weekly digest scenario if you want rollups.”

---

## Troubleshooting (quick hits)
- **403 on Drive link:** Set sharing on the output folder or email a direct attachment.  
- **Airtable link fields empty:** Confirm you linked by ID or re-link manually.  
- **Images don’t show:** Verify the URLs are public or use Google Drive attachments instead.  
- **Time zones off:** Display dates with `DATETIME_FORMAT` or convert in Make before replacing.

## Wrap
**Voiceover:** “That’s it. You’ve got inspections → PDF → email → writeback, live. Duplicate the scenario per client or graduate them to M365 when ready.”