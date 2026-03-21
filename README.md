# 📷 Web Barcode & QR Scanner App

A full-stack web application that scans QR codes and EAN-13 barcodes directly from the browser, stores results in the cloud, and provides history, export, and analytics features.

---

## Features

### Scanner Engine
- Supports:
  - QR Codes
  - EAN-13 Barcodes (13-digit retail barcodes)
- Works entirely in the browser (no plugins/extensions)
- Compatible with:
  - iOS Safari
  - Android Chrome & Firefox
- Graceful camera permission handling
- Manual input fallback if camera is unavailable

---

### Data Storage
- Every scan is stored in a cloud database
- Stored fields:
  - Scanned value
  - Barcode format
  - Timestamp
  - Device and browser info 

---

### Scan History
- Displays all scans (latest first)
- Shows barcode type label for each entry
- Separate history per authenticated user

---

### Export
- Export scan history as:
  - CSV
  - PDF

---

### Authentication
- User login system
- Each user has isolated scan history

---

### Offline Support (PWA)
- Works offline using Service Workers
- Syncs data automatically when back online

---

### Analytics Dashboard
- Scans per day
- Most scanned codes
- Usage insights

---

## Tech Stack

**Frontend**
- React (TypeScript)
- Vite
- PWA (Service Worker)

**Backend**
- Node.js and Express
- Cloud Database (PostgreSQL)

---

## ⚙️ Setup Instructions (Frontend - React + TypeScript + Vite)

### 1. Clone the repository
```bash
git clone https://github.com/Swapno963/Scannify.git
cd Scannify
```


### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables

Create a .env file in the root directory:
```bash
VITE_API_URL=http://localhost:3000
```


### 4. Run the development server
```bash
npm run dev
```
App will be available at:

```bash
http://localhost:5173
```