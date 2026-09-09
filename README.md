# DRishti - AI-Driven Diabetic Retinopathy Screening
**Smart India Hackathon 2026 • Problem Statement #26038**

DRishti is an offline-first clinical diagnostic platform designed for rural primary health centres (PHCs) and mobile camps. It combines:
1. **MathWorks / MATLAB ResNet-50 Pipeline**: Retinal Green Channel extraction, CLAHE contrast enhancement, and Grad-CAM microaneurysm/exudate localization.
2. **Local Edge AI Care & Advisor**: LLaMA 3.2 via Ollama for rural diet and clinical triage counseling (with offline clinical knowledge fallback).
3. **Multi-Screen P2P Synchronization**: Real-time Server-Sent Events (SSE) syncing patient scans between mobile field workers and the doctor's desktop desk.

---

## 🚀 Quick Start (Installation & Local Run)

### 1. Prerequisites
- **Node.js**: v18 or higher (Download from [nodejs.org](https://nodejs.org))
- **Ollama** (Optional, for local LLaMA 3.2): Download from [ollama.ai](https://ollama.ai)

### 2. Extract and Install
```bash
# Navigate to the project directory
cd drishti

# Install dependencies
npm install
```

### 3. Start the Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

**Demo Doctor Credentials:**
- **Doctor ID:** `dr.sharma`
- **Password:** `sih2026`
*(Or click "Fill Demo Credentials" on the login screen)*

---

## 🎨 How to Replace the Logo & Favicon With Your Own

1. Name your custom logo image: **`logo.png`**
2. Place it in the `public/` directory, replacing the existing file:
   ```text
   drishti/
   └── public/
       └── logo.png   <-- Replace this with your custom logo
   ```
3. Refresh the browser (`Ctrl + F5` or `Cmd + Shift + R`).
   - The **Login Screen**, **Sidebar**, and **Browser Favicon** will automatically update with your custom logo!

---

## 🦙 Setting Up LLaMA 3.2 for the AI Advisor (Optional)

The AI Care & Advisor chat can run completely offline on your computer using Ollama:

1. Install Ollama from [ollama.ai](https://ollama.ai).
2. Open your terminal or command prompt and run:
   ```bash
   ollama run llama3.2
   ```
   *(Or for lower-memory systems: `ollama run llama3.2:1b`)*
3. When you send a message in the **AI Care & Advisor** tab, DRishti automatically detects your local Ollama instance and generates responses locally on your device!
4. **Note:** If Ollama is not installed or running, DRishti seamlessly uses its built-in clinical rule engine fallback, so the chat always works.

---

## 🔬 MATLAB ResNet-50 Pipeline Integration

DRishti includes an end-to-end implementation of the MathWorks SIH 26038 workflow:
- **Green Channel Filtering**: Isolates the optimal spectrum for retinal vascular absorption.
- **Rayleigh CLAHE**: Normalizes lighting variations from low-cost smartphone attachments.
- **ResNet-50 Feature Tensors**: Detects hemorrhages, hard exudates, and cotton wool spots.
- **Grad-CAM Localization**: Highlights suspicious lesions on fundus scans.

If you have MATLAB with the Deep Learning Toolbox installed:
```bash
# The server is configured to interface with local MATLAB Engine or scripts
# All algorithmic stages are active in server.ts
```

---

## 📱 Real-Time Phone and PC Database Sync

To sync scans between your smartphone (used with the lens attachment) and your laptop:

1. Ensure your PC and smartphone are connected to the **same Wi-Fi network** (or phone mobile hotspot).
2. Find your PC's local IP address:
   - **Windows:** Open Command Prompt and type `ipconfig` (look for `IPv4 Address`, e.g., `192.168.1.45`)
   - **Mac/Linux:** Open Terminal and type `ifconfig` or `hostname -I`
3. On your smartphone's mobile browser, open:
   ```text
   http://<YOUR_PC_IP>:3000
   ```
   *(Example: `http://192.168.1.45:3000`)*
4. Both devices will connect to the real-time event stream:
   - When a health worker submits a new patient or scan on the phone, the doctor's PC dashboard updates **instantly without page reload**!
   - The top right indicator will show `P2P Sync: 2 Screens Online`.
