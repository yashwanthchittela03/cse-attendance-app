# 📚 CSE Attendance Tracker

A modern, responsive web application designed for CVR College of Engineering (CSE-F) students to track their daily period-wise attendance, calculate overall percentages, and determine available/needed bunks.

## ✨ Features

- **Period-wise Attendance Marking**: Select specific dates and toggle attendance (`Present` / `Absent`) for scheduled subjects.
- **Dynamic Timetable Synchronization**: Automatically adjusts daily class schedules based on effective date periods throughout the semester.
- **Live Percentage Calculation**: Automatically calculates overall attendance percentage based on marked classes.
- **Bunk & Attendance Predictor**:
  - Highlights available bunks while maintaining a $\ge 75\%$ target.
  - Calculates consecutive classes required to recover attendance if below $75\%$.
- **Local Persistence**: Stores user accounts and attendance logs seamlessly in browser local storage.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## 🚀 Local Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_GITHUB_USERNAME/cse-attendance-app.git](https://github.com/YOUR_GITHUB_USERNAME/cse-attendance-app.git)
   cd cse-attendance-app