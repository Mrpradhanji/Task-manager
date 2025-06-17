# RTASK - Modern Task Management Application

RTASK is a full-stack task management application built with React, Node.js, and MongoDB. It provides a modern, intuitive interface for managing tasks with features like task categorization and user authentication.

## 🌟 Features

- **User Authentication**
  - Secure login and registration
  - Password reset functionality
  - Profile management

- **Task Management**
  - Create, read, update, and delete tasks
  - Categorize tasks (Pending/Complete)
  - Set task priorities and deadlines

- **Modern UI/UX**
  - Responsive design
  - Dark mode interface
  - Intuitive navigation

## 🚀 Tech Stack

### Frontend
- React.js
- React Router for navigation
- Tailwind CSS for styling
- Vite for build tooling
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Resend for email services

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Mrpradhanji/Task-manager.git
cd Task-manager
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:

Create a `.env` file in the backend directory:
```env
PORT=4000
MONGO_USER=your_mongodb_username
MONGO_PASS=your_mongodb_password
MONGO_CLUSTER=your_mongodb_cluster
MONGO_DB=your_database_name
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=your_resend_api_key
FRONTEND_URL=https://task-manager-nine-hazel.vercel.app
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:4000
```

4. Start the development servers:

```bash
# Start backend server (from backend directory)
npm run start

# Start frontend server (from frontend directory)
npm run dev
```

## 🔧 Configuration

### MongoDB Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Set up database user and password
4. Whitelist your IP address
5. Get your connection string

### Email Service (Resend)
1. Sign up for Resend
2. Get your API key
3. Add it to your backend environment variables

## 🚀 Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Backend
1. Deploy to your preferred hosting service (e.g., Heroku, DigitalOcean)
2. Set up environment variables
3. Configure CORS to allow requests from your frontend domain

## 📝 API Endpoints

### Authentication
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - User login
- `POST /api/user/forgot-password` - Request password reset
- `POST /api/user/reset-password` - Reset password

### User
- `GET /api/user/me` - Get current user
- `PUT /api/user/password` - Update password
- `PUT /api/user/profile` - Update profile
- `POST /api/user/avatar` - Upload avatar

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Authors

- Rohit Kumar Singh - Initial work - [Mrpradhanji](https://github.com/Mrpradhanji)

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Resend](https://resend.com/)

## 📞 Support

For support, create an issue in the repository.
