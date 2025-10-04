# ExesMan – Expense Management System

**Team Members:**  
- Om Chauhan  
- Ansh Patel  
- Trushar Patel  
- Darshan Hotchandani  

---

## Project Overview

**ExesMan** is a web-based **Expense Management System** that automates expense reimbursements for companies.  
It addresses common challenges with manual expense processes:  

- Time-consuming approvals  
- Error-prone workflows  
- Lack of transparency  

The system provides:  

- Role-based access (Admin, Manager, Employee)  
- Multi-level approval workflows  
- Conditional approval rules  
- OCR for automatic receipt scanning  
- Multi-currency support  

---

## Features

### Authentication & User Management
- Signup/Login for employees, managers, and admins  
- First signup auto-creates the company and admin  
- Admin can:
  - Create Employees & Managers  
  - Assign/change roles  
  - Define manager relationships  

### Expense Submission (Employee)
- Submit expenses (Amount, Category, Description, Date, Receipt)  
- View expense history (Approved, Rejected, Pending)  
- OCR auto-read receipts  

### Approval Workflow (Manager/Admin)
- Multi-level approvals (Manager → Finance → Director)  
- Conditional rules:
  - **Percentage rule** (e.g., 60% approval)  
  - **Specific approver rule** (e.g., CFO approval)  
  - **Hybrid rules** combining both  

### Currency Handling
- Company default currency on signup  
- Employee can submit in any currency  
- Automatic conversion to company currency using APIs  

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (managed via MongoDB Compass)  
- **Authentication:** JWT / token-based auth  
- **OCR:** Tesseract.js (or similar)  
- **APIs:**  
  - Country & currency: `https://restcountries.com/v3.1/all?fields=name,currencies`  
  - Currency conversion: `https://api.exchangerate-api.com/v4/latest/{BASE_CURRENCY}`  

---

## Folder Structure (Frontend)

src/
├─ components/ # Reusable UI components
├─ pages/ # Login, Signup, Dashboard pages
├─ routes/ # Protected Routes / React Router setup
├─ utils/ # Helpers (auth, API calls, OCR)
└─ App.jsx # Main app with routing

yaml
Copy code

---

## Installation & Setup

1. Clone the repository:

```bash
git clone <repo-url>
cd ExesMan
Install frontend dependencies:

bash
Copy code
cd client
npm install
npm run dev
Install backend dependencies:

bash
Copy code
cd server
npm install
Setup MongoDB:

Open MongoDB Compass

Create a database exesman

Update .env with your MongoDB connection string:

env
Copy code
MONGO_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/exesman?retryWrites=true&w=majority"
Start backend server:

bash
Copy code
npm run dev
Usage
First signup → Admin account auto-created → redirected to Admin Dashboard

Admin can create Employee and Manager accounts

Employees submit expenses → Managers/Admins approve

Role-based dashboards:

/admin → Admin Dashboard

/manager → Manager Dashboard

/employee → Employee Dashboard

Future Enhancements
Email notifications on approvals/rejections

Export expense reports as PDF/Excel

Advanced OCR for multi-line receipts

Real-time currency rate integration

yaml
Copy code

---

If you want, I can also **add a table of contents and badges** to make it look like a **professional GitHub README** ready to publish.  

Do you want me to do that next?