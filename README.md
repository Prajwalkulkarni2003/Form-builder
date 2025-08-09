# Dynamic Form Builder 

This is a minimal working implementation of the Dynamic Form Builder assignment using:
- React + TypeScript (Vite)
- Redux Toolkit
- Material UI
- localStorage for saving form schemas


A web app where you can **create custom forms**, **preview and fill them**, and **see all submitted data** — built with React, Redux, TypeScript, and Material UI.

---

## 🚀 Features

- **Create Forms**: Add fields like Text, Number, Date, Select, Checkbox, etc.
- **Preview & Fill**: Try out your form before using it.
- **Save & Load**: Forms are saved in your browser's storage (localStorage).
- **View Submissions**: See all the data people have entered.
- **Persistent Data**: Even if you refresh the page, your forms and submissions stay.

---

## 📂 Project Structure (Simplified)

src/
├─ components/ # Small reusable UI parts
├─ pages/ # App pages (Create, My Forms, Preview, My Data)
├─ store/ # Redux store and slices
├─ types/ # TypeScript type definitions
├─ App.tsx # Main app entry
└─ main.tsx # React DOM render

yaml
Copy
Edit

---

## 🛠️ Technologies Used

- **React** – For building the UI
- **Redux Toolkit** – For managing app-wide state
- **TypeScript** – For type safety
- **Material UI (MUI)** – For prebuilt styled components
- **Vite** – For fast development and build
- **localStorage** – For saving data in the browser

## Run locally

1. Install:
   ```bash
   npm install
   ```
2. Dev server:
   ```bash
   npm run dev
   ```

