# 📞 Caller Portal (MERN Stack)

The Caller Portal is a web-based application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It is designed for call center agents (callers) to view, verify, and update customer proposal reports and call outcomes.

---

## 🧰 Tech Stack

- **Frontend**: React.js, Axios, Tailwind CSS / Bootstrap (optional)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (optional)

---

## 🌐 Portal Features

- View assigned proposals and reports
- Update call status and IA (Investigation Agent) remarks
- Check verification outcomes (technical/medical)
- Track call attempts and final closure status
- Filter records by date, proposal number, and status

---

## 🛠 Installation

### Backend Setup

```bash
cd backend

npm install
cp .env.example .env
# Add your MONGO_URI and other environment variables
npm run dev
