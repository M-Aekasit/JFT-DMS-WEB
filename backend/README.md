# Backend Node.js + SQL Server

# Tech Stack
- Node.js
- Express.js
- Microsoft SQL Server
- dotenv
- cors
- nodemon

# Project Structure
backend/
│
├── node_modules/         # Packages ที่ install
│
├── controllers/          # Logic การทำงานของ API
│   └── user.controller.js
│
├── routes/               # Route API
│   └── user.route.js
│
├── services/             # Business Logic (optional)
│
├── middleware/           # Middleware เช่น auth
│
├── .env                  # Environment Variables
├── .gitignore
├── db.js                 # SQL Server Connection
├── server.js             # Main Server
├── package.json
└── README.md