Workflow 1 — Review, organize, update, group current products
Goal: clean catalog, consistent titles/prices/copy, sane collections, no duplicates.
A) Intake + snapshot
1.	Export Square Catalog CSV (latest).
2.	Import into Catalog Console v1.1 (CSV import).
3.	Run Validate (fix criticals first: missing prices, busted variants, weird option names).
B) Normalize (consistency without destroying “keeper” copy)
4.	Identify “keeper” descriptions:
o	Mark in overlay overrides as copyLock: true (or “override description exists = locked”).
5.	Apply price ladders by product type (tee/hoodie/zip/hat/crewneck).
6.	Apply title format rule (Brand • Collection • Product Type • Color).
7.	Auto-fill copy only for blanks/weak copy (respect locks).
C) Organize + group
8.	Standardize Collections (your grouping system):
o	By brand line: AeroVista / EchoVerse / Synthetic Souls / CDA
o	By drop: Apex Draft, Aetherwatch, etc.
o	By product type: Tees, Hoodies, Hats, Stickers
9.	Apply tags consistently (search + filters):
o	brand, collection, type, color, style (drop/core/collector)
D) De-dupe + archive
10.	Find duplicates (same design, multiple “almost same” products):
•	Keep best SKU/variation set
•	Hide/Archive the rest in Square (don’t delete unless you must)
E) Publish retail updates to Square
11.	Export a Square Update CSV from Console (prices, optionally title/description).
12.	Import into Square → verify 3–5 spot checks (tee, hoodie, hat, 2XL).
13.	Re-export Square CSV (post-change) as your new baseline.
Outputs
•	Clean Square catalog
•	Updated square_products_latest.json
•	Updated overlay overrides (copyLock + curated copy)
________________________________________
Workflow 2 — Design → create → submit new apparel (Printful + QA)
Goal: produce a print-ready product that won’t create chaos in Square.
A) Design package (one folder per design)
1.	Create a design folder:
o	designs/{collection}/{designName}/
2.	Required files:
o	print.png (transparent, 300 DPI, correct template size)
o	mockup.jpg/png (for marketing)
o	notes.md (placement, colors, intended blanks)
B) Production choices (standard menu)
3.	Pick:
o	product type (tee/hoodie/zip/hat)
o	blank (ex: LS16001, 6606)
o	allowed colors + sizes
o	placement rules (front center, left chest, etc.)
C) Create in Printful (production authority)
4.	Build the product in Printful:
o	upload print file
o	set placements
o	generate mockups
o	choose variants (colors/sizes)
D) QA before publish
5.	Quality checklist:
o	art alignment
o	contrast on selected colors
o	mockup looks correct
o	no forbidden colors/variants
o	file naming matches designName
E) Publish to Square (one-time)
6.	Publish from Printful → Square (creates item + variations).
Outputs
•	Print-ready design package
•	Printful product created
•	Square item created (initial)
________________________________________
Workflow 3 — Add new items to the store (Square-first retail)
Goal: once a product exists in Square, retail polish happens in Square + Console.
A) Intake into Console
1.	Export Square CSV (after Printful publish).
2.	Import into Console.
3.	Console assigns productKey + runs consistency rules.
B) Retail polish (Square authority)
4.	Set:
o	final title (format)
o	final price ladder (base/2XL/3XL)
o	final descriptionShort + description (copyLock if curated)
o	categories/collections/tags
o	visibility (active/hidden)
C) Publish retail changes to Square
5.	Export Square Update CSV from Console.
6.	Import to Square.
7.	Verify:
o	each variation price correct
o	titles consistent
o	item visible in Square Online (if intended)
D) Storefront integration
8.	Refresh square_products_latest.json (or your live pull/export).
9.	Overlay overrides updated (for grouping + copy locks).
10.	Confirm storefront:
•	grid grouping right
•	filters/search correct
•	add-to-cart prices match ladder
•	checkout uses variationId mapping
Outputs
•	Square listing perfected
•	Storefront shows it correctly (Live and Edited)
________________________________________
Roles (so contributors don’t step on each other)
•	Catalog Curator: runs Workflow 1 (organize + group + copy locks)
•	Designer: runs Workflow 2 (art + Printful build)
•	Publisher: runs Workflow 3 (Square retail polish + storefront verification)
________________________________________
If you want, I’ll turn these into 3 short SOP pages with:
•	checklist boxes
•	“definition of done”
•	common failure modes (duplicates, overwritten names, 2XL price drift)
•	and exact file names/paths in your repo.
SOP-001 — Catalog Review, Organization, Updates, and Grouping
Owner: Catalog Curator
Frequency: Weekly (or after every batch of new products)
Systems: Square (retail truth), AV Catalog Console v1.1 (editor/validator), Storefront overlay (presentation consistency)
Purpose
Keep the existing catalog clean, consistent, searchable, and priced correctly—without overwriting “keeper” descriptions.
Inputs
•	Latest Square catalog export CSV
•	Current storefront_overlay.json (rules + overrides)
•	Optional: square_products_latest.json (site live feed)
Outputs
•	Updated Square catalog (prices/titles/descriptions/categories as intended)
•	Updated storefront_overlay.json overrides (grouping + copy locks)
•	Updated storefront catalog JSON for preview/live
Where things live
•	Console: AeroVista_Catalog_Console/v1.1/index.html
•	Storefront: index.html (root)
•	Overlay: storefront_overlay.json
•	Live catalog: square_products_latest.json
•	Edited catalog: square_products_edited.json (or localStorage)
________________________________________
Procedure
A) Snapshot + Import
•	Export Square catalog CSV (name it with date/time).
•	Open Console v1.1 → Import CSV.
•	Run Validate.
Fix immediately (P0):
•	Missing prices
•	Missing/invalid variation tokens/IDs
•	Broken Size/Color option naming (e.g., “size”, “Size ”, “S I Z E”)
•	Duplicates that will confuse checkout
B) Protect “keeper” descriptions
•	Identify products with copy you love (custom tone, not boilerplate).
•	Add to storefront_overlay.json → overrides[productKey] with:
o	copyLock: true OR
o	explicitly set descriptionShort + description (presence = lock)
Rule: Locked products never get auto-rewritten.
C) Normalize titles + pricing
•	Apply title rule: Brand • Collection • Product Type • Color
•	Apply ladders per type (tee/hoodie/zip/hat/crewneck)
•	Ensure 2XL/3XL price bumps apply at the variation level
D) Grouping + collections
•	Standardize Collections (one primary collection per product):
o	Brand line: AeroVista / EchoVerse / Synthetic Souls / CDA
o	Drop/Theme: Apex Draft, Aetherwatch, etc.
•	Standardize tags:
o	brand, collection, type, color, tier (core/drop/collector)
E) De-dupe + hide/archive
•	Identify duplicates:
o	Same design, multiple near-identical items
•	Keep the best (cleanest variants + best copy)
•	Hide/archive the rest in Square (don’t delete unless necessary)
F) Publish to Square
•	Export Square Update CSV from Console (prices always; titles/descriptions if desired).
•	Import into Square.
•	Spot-check 3–5 items:
o	tee + hoodie + hat + a 2XL + a 3XL
________________________________________
Definition of Done
•	No missing prices
•	Variation prices match ladders (including 2XL/3XL)
•	Titles consistent and sortable
•	Collections/tags clean
•	Keeper descriptions preserved
•	Duplicates handled (hidden/archived)
Common failure modes and fixes
•	Duplicate products after import: update CSV lacked stable IDs/SKUs → include variation token/ID mapping.
•	2XL/3XL not priced right: size not standardized → normalize size options (“2XL” not “XXL”) or map both.
•	Good copy overwritten: missing copyLock/override → add lock and rerun only-fill-missing mode.
________________________________________
________________________________________
SOP-002 — New Apparel Design → Create → Submit (Printful Production)
Owner: Designer + Production Operator
Frequency: As needed (new drop/design)
Systems: Printful (production truth), Square (retail truth after publish)
Purpose
Create print-ready products with clean variants, correct placements, and minimal catalog chaos.
Inputs
•	Design concept + naming
•	Print-ready artwork (transparent PNG)
•	Product spec (blank, placement, allowed colors/sizes)
Outputs
•	Printful product created (correct blanks/placements)
•	Product published to Square (initial listing created)
________________________________________
Design Package Standard
Create folder: designs/{collection}/{designName}/
Must include:
•	print.png (transparent, high-res, correct template size)
•	mockup.png/jpg (marketing)
•	notes.md:
o	product types intended
o	placement rules
o	allowed colors/sizes
o	any “do not use” constraints
________________________________________
Procedure
A) Name + taxonomy (before you build anything)
•	Design name (stable): e.g., Aetherwatch Sigil
•	Collection: e.g., Aetherwatch
•	Tier: core / drop / collector
•	Target products: tee/hoodie/zip/hat
B) Build in Printful
•	Choose blank/product type
•	Upload print.png
•	Set placement (front center / left chest / etc.)
•	Select only allowed colors/sizes
•	Generate mockups
C) QA checklist (don’t skip)
•	Alignment is centered and level
•	Contrast works on every selected color
•	No clipped edges / safe area respected
•	Mockups match the actual placement
•	Variants list is exactly what you intend (no surprise colors)
D) Publish to Square
•	Publish product to Square (creates items/variations)
•	Immediately export Square CSV (for Console intake next SOP)
________________________________________
Definition of Done
•	Print files correct and archived in design package
•	Printful product matches spec
•	Published to Square with correct variants
•	No unintended colors/sizes
Common failure modes and fixes
•	Wrong placement after publish: fix in Printful + republish (or create a new product if integration won’t update cleanly).
•	Too many variants created: restrict variants in Printful before publishing; otherwise hide variants in Square.
•	Design looks bad on some colors: remove those colors in Printful and republish; don’t “hope it’s fine.”
________________________________________
________________________________________
SOP-003 — Add New Items to Store (Retail Polish + Storefront Integration)
Owner: Publisher (Retail Ops)
Frequency: Every new product batch
Systems: Square (retail truth), Console v1.1 (normalize + export), Storefront (live/edited)
Purpose
Turn newly published Printful items into clean, priced, grouped, customer-ready listings and ensure storefront + checkout behave.
Inputs
•	Newly published product in Square (from Printful)
•	Square export CSV
•	Overlay rules + overrides
Outputs
•	Square updated: title/description/prices/categories/visibility
•	Storefront updated: live feed + overlay overrides
________________________________________
Procedure
A) Intake
•	Export Square CSV after publish
•	Import into Console v1.1
•	Validate
B) Retail polish rules (Square wins)
Set these in Console/overlay (then publish to Square):
•	Title (format): Brand • Collection • Product Type • Color
•	Price ladder (base/2XL/3XL)
•	DescriptionShort + Description
•	copyLock if curated copy
•	Collections/tags
•	Visibility (active/hidden)
C) Publish to Square
•	Export Square Update CSV
•	Import into Square
•	Spot-check:
o	base size price
o	2XL/3XL price
o	correct title/description appears
D) Storefront integration
•	Refresh square_products_latest.json (or your normal live export step)
•	Update storefront_overlay.json overrides for:
o	collection grouping
o	copyLock
o	any “hide/feature” rules
•	Verify storefront:
o	correct grouping/filtering
o	price display matches ladder
o	add-to-cart shows right variant
o	checkout resolves variationId correctly
________________________________________
Definition of Done
•	Square listing looks correct (price/copy/title/visibility)
•	Storefront shows correct grouping and pricing
•	Checkout passes (no “unknown SKU”, no mismatched variants)
•	Overlay updated so future exports remain consistent
Common failure modes and fixes
•	Checkout 400 unknown SKU: sku_map missing cartKey/variationId → regenerate map / add entry.
•	Price mismatch in UI vs checkout: UI ladder differs from Square price → align ladders or treat Square as authoritative display.
•	Printful republish overwrote Square edits: avoid republish unless production change; reapply Square updates via Console CSV.
________________________________________
Quick role handoff summary
•	Catalog Curator: SOP-001 (keep catalog clean)
•	Designer/Production: SOP-002 (build product correctly)
•	Publisher: SOP-003 (retail polish + storefront verification)
If you want, I can turn these into three repo files (docs/SOP-001.md, etc.) and also add a one-page “SOP Index” that links them and defines “Core vs Drop vs Collector” pricing policy.

