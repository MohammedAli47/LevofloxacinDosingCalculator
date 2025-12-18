# LevoCalc - Levofloxacin Dosing Calculator

A clinical decision support tool designed to assist healthcare professionals in calculating Levofloxacin dosing, assessing safety parameters (QTc risk, contraindications), and managing patient history.

## Features

- **Renal Dosing Calculator**: Automatically calculates Creatinine Clearance (Cockcroft-Gault) and recommends dosing regimens (Oral/IV) based on renal function.
- **Pharmacokinetic Analysis**: Estimates CL, Vd, t½, AUC, and Cmax.
- **Safety Assessment**:
  - **Contraindication Check**: Age < 18, Pregnancy, Myasthenia Gravis, Epilepsy, Allergy.
  - **QT Prolongation Risk**: Tisdale-like risk scoring algorithm (Low, Moderate, High).
  - **Drug-Drug Interactions**: Checks for QT-prolonging meds, corticosteroids, NSAIDs, etc.
- **Patient History**: Local database (IndexedDB) to save and retrieve previous patient assessments.
- **Multi-language Support**: Full English and Professional Egyptian-style Arabic UI.
- **Print Friendly**: Dedicated print layout for medical records.

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Database**: IndexedDB (Client-side storage)
- **Icons**: Lucide React

## Local Development

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```

## Deployment on Netlify

This project is configured for easy deployment on Netlify.

1.  **Push to Git**: Push this repository to GitHub, GitLab, or Bitbucket.
2.  **Import to Netlify**:
    - Log in to Netlify and click "Add new site".
    - Select "Import an existing project".
    - Choose your repository.
3.  **Build Settings**:
    - **Build command**: `npm run build`
    - **Publish directory**: `dist`
4.  **Deploy**: Click "Deploy site".

## Disclaimer

**For educational and clinical decision support purposes only.**
This tool is intended to assist healthcare professionals. It does not replace clinical judgment. Always verify calculations and consult the latest prescribing information.
