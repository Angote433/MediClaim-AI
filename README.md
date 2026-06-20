# MediClaim AI 🏥

**AI-Powered Medical Insurance Fraud Detection**

Built for the IGNITE64 Global AI Hackathon 2026 — Fintech Track.

MediClaim AI analyzes uploaded medical receipts and flags potential insurance fraud in seconds. It combines image forensics, market-rate cost validation, and rule-based checks into a single explainable fraud score.

---

## What It Does

Upload a medical receipt — JPEG, PNG, PDF, or DOCX — and get back:

- A **fraud score (0–100)** with a clear risk category (Low / Medium / High / Critical)
- A **recommended action** (Approve / Request Review / Investigate / Reject)
- A **breakdown** showing exactly how much each signal contributed to the score
- A list of **specific red flags** with evidence (e.g. "Surgical Theatre Fee billed at KES 40,255 vs expected KES 2,500 — 1510% above market rate")
- Extracted receipt data: hospital, invoice number, date, total, and line items

---

## How It Works

The system runs every upload through a 6-stage pipeline:

1. **Document Ingestion** — converts any supported format (PDF, DOCX, image) into a standard image
2. **OCR Extraction** — pulls structured data from the receipt (hospital, date, amounts, line items) using Tesseract OCR and native PDF text extraction
3. **Image Forensics** — checks EXIF metadata and runs Error Level Analysis (ELA) to detect digital tampering or screenshot evasion
4. **Cost Validation** — compares each billed item against a Kenyan market-rate pricing database (KES)
5. **Business Rules** — flags duplicate billing, suspicious dates, round-number totals, and missing fields
6. **Fraud Scoring** — combines all signals into one weighted, explainable score

### Scoring Weights

| Signal | Weight | Why |
|---|---|---|
| Image Forensics | 35% | Manipulation is the strongest single fraud signal |
| Cost Deviation | 35% | Overpricing is the most common fraud vector |
| Business Rules | 20% | Catches duplicate billing & structural anomalies |
| Screenshot Flag | 10% | Screenshots strip metadata — a common evasion tactic |

### Risk Categories

| Score | Risk | Action |
|---|---|---|
| 0–24 | LOW | Approve |
| 25–54 | MEDIUM | Request Review |
| 55–79 | HIGH | Investigate |
| 80–100 | CRITICAL | Reject |

---

## Tech Stack

**Backend**
- Python + FastAPI
- Tesseract OCR / pdfplumber (text extraction)
- OpenCV (image forensics, ELA)
- pdf2image, docx2pdf (document conversion)

**Frontend**
- React
- Tailwind CSS
- react-dropzone (file upload)
- react-circular-progressbar (fraud score gauge)
- Axios

---

## Project Structure

```
MediClaim/
├── backend/
│   ├── main.py                  # FastAPI app & /api/analyze endpoint
│   ├── document_ingestion.py    # Converts PDF/DOCX/images → standard image
│   ├── ocr_service.py           # Text extraction & receipt parsing
│   ├── forensics_service.py     # EXIF & ELA manipulation detection
│   ├── cost_service.py          # Market-rate cost validation
│   ├── pricing_db.py            # KES pricing database (Nairobi rates)
│   ├── business_rules.py        # Rule-based fraud checks
│   ├── fraud_scoring.py         # Final weighted score calculation
│   └── requirements.txt
└── frontend/
    └── src/
        └── components/
            ├── UploadPage.jsx           # Drag & drop upload UI
            ├── ResultsPage.jsx          # Analysis results display
            ├── FraudScoreGauge.jsx      # Score gauge + breakdown bars
            ├── CostComparisonTable.jsx  # Line-item cost comparison
            └── ReceiptViewer.jsx        # Receipt + ELA image viewer
```

---

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 16+
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract) installed and in PATH
- [Poppler](https://github.com/oschwartz10612/poppler-windows/releases) (Windows) or `poppler-utils` (Linux/Mac) — required for PDF conversion

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

The API runs at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

> **Windows users:** if PDF uploads fail with a poppler error, download poppler, extract it, and set `POPPLER_PATH` in `document_ingestion.py` to point to the extracted `Library/bin` folder.

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The app runs at `http://localhost:3000`.

---

## Testing with Sample Data

A receipt generator script is included separately (`generate_receipts.py`) to create realistic synthetic medical receipts — both legitimate and fraudulent (inflated costs, duplicate services, phantom services, upcoding) — for testing the pipeline end-to-end without needing real patient data.

```bash
pip install reportlab pdf2image Pillow
python generate_receipts.py
```

This produces a `sample_receipts/` folder with PDFs, PNGs, and a manifest CSV showing which receipts are fraudulent and why.

---

## Roadmap

This is a hackathon prototype. Planned next steps:

- [ ] Partner with insurers for verified tariff schedules (replacing estimated market rates)
- [ ] Upgrade OCR to a production-grade document AI service
- [ ] Add claim history analysis across providers, not just single-receipt checks
- [ ] Build a reviewer feedback loop to improve scoring over time
- [ ] Expose as an API for integration into existing claims management systems

---

## Author

**Arnold Henry Angote (Ano)**
B.Sc. Information Technology, JKUAT
GitHub: [@Angote433](https://github.com/Angote433)

Built solo for IGNITE64 Global AI Hackathon 2026.
