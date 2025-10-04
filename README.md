# Expense Management System
## A web-based Expense Management System that automates and streamlines expense reimbursements for companies, built with the MERN stack.

### Team Members:

- Om Chauhan
- Ansh Patel
- Trushar Patel
- Darshan Hotchandani

## 📖 Project Overview
### ExesMan addresses the common challenges associated with manual expense processes, which are often time-consuming, prone to errors, and lack transparency. This system provides a robust solution with:

- Role-Based Access Control (Admin, Manager, Employee)
- Configurable, Multi-Level Approval Workflows
- Support for Conditional Approval Rules
- OCR for automatic receipt scanning
- Multi-Currency support with automatic conversion

## ✨ Features

- Authentication & User Management
- Signup/Login for all user roles.
- The first signup automatically creates the Company and the first Admin account.

#### The Admin can:

- Create Employees & Managers.
- Assign and change user roles.
- Define manager-employee reporting relationships.

#### Expense Submission (Employee)

- Submit detailed expense claims (Amount, Category, Description, Date, Receipt).
- View a complete history of their expenses with their current status (Approved, Rejected, Pending).
- Utilize OCR to auto-read and pre-fill expense details from uploaded receipts.

#### Approval Workflow (Manager/Admin)

- Handle multi-level approvals (e.g., Manager → Finance → Director).
- Implement powerful conditional rules:
- Percentage rule (e.g., approved if 60% of approvers agree).
- Specific approver rule (e.g., auto-approved if the CFO approves).
- Hybrid rules that combine both percentage and specific approver logic.

#### Currency Handling

- The company's default currency is set on signup.
- Employees can submit expenses in any currency.
- The system uses an external API for real-time exchange rates to automatically convert and display amounts in the company's default currency for approvers.

## 🛠️ Tech Stack

- Category
- Technology
- Frontend : React, Vite, Tailwind CSS, Framer Motion
- Backend : Node.js, Express.js
- Database : MongoDB (managed via MongoDB Compass or Atlas)
- Authentication
- JSON Web Tokens (JWT), bcrypt.js
- OCR
- Tesseract.js (or similar client-side library)
- External APIs
- restcountries.com (for currencies), exchangerate-api.com (for conversions)

## 🚀 Installation & Setup
1. Clone the Repository
git clone <your-repo-url>
cd ExesMan

2. Setup Backend (server)
# Navigate to the server directory
cd server

## Install dependencies
npm install

- Create a .env file in the server root and add your MongoDB connection string and a JWT secret.

## Example for MongoDB Compass (local)
MONGO_URI="mongodb://127.0.0.1:27017/exesman"

## Example for MongoDB Atlas (cloud)
MONGO_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/exesman?retryWrites=true&w=majority"

JWT_SECRET="your_super_secret_key"
PORT=5000

- Then, start the backend server:

## In the /server directory
npm run dev

3. Setup Frontend (client)
## Navigate to the client directory from the root
cd ../client

## Install dependencies
npm install

Then, start the frontend development server:

## In the /client directory
npm run dev
