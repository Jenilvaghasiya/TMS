# Task Management System (SERN Stack)

A comprehensive task management system built with SQL, Express, React, and Node.js featuring role-based access control, task tracking, daily updates, and courier management.

## Features

### 1. Login & User Role Management
- Secure authentication with JWT
- Two roles: Admin and Employee
- Session management

### 2. Task Creation & Assignment (Admin)
- Create tasks with title, description, priority, and due date
- Assign tasks to multiple employees
- Edit, update, and delete tasks
- Priority levels: Low, Medium, High, Urgent

### 3. Daily Task Updates (Employee)
- Update task status (Pending, In-Progress, Completed)
- Add work logs and comments
- Track hours worked
- View assigned tasks

### 4. Dashboard
- **Admin Dashboard**: Total tasks, pending, completed, overdue alerts, employee productivity charts
- **Employee Dashboard**: Assigned tasks, high-priority alerts, progress tracking

### 5. Reports & Notifications
- Real-time task statistics
- Employee productivity analytics
- Visual charts and graphs

### 6. Courier/Inward Entry Module
- Add courier entries with sender, receiver, type, tracking number
- Mark as Received or Delivered
- Search and filter courier records
- Maintain inward history

## Tech Stack

- **Frontend**: React 18, React Router, Recharts, React Icons, React Toastify
- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Custom CSS with modern UI design

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure `.env` file:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_management
JWT_SECRET=your_secret_key_here
```

5. Create MySQL database:
```sql
CREATE DATABASE task_management;
```

6. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000` and automatically create database tables.

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will run on `http://localhost:3000`

## Default Users

After the database is created, you need to manually create the first admin user:

```sql
INSERT INTO Users (username, email, password, fullName, role, isActive, createdAt, updatedAt)
VALUES ('admin', 'admin@example.com', '$2a$10$YourHashedPasswordHere', 'Admin User', 'admin', 1, NOW(), NOW());
```

Or use the application to create users after logging in as admin.

**Demo Credentials:**
- Admin: `admin` / `admin123`
- Employee: `employee` / `emp123`

## Project Structure

```
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       │   └── Layout.jsx
│       ├── pages/          # Page components
│       │   ├── Login.jsx
│       │   ├── AdminDashboard.jsx
│       │   ├── EmployeeDashboard.jsx
│       │   ├── TaskManagement.jsx
│       │   ├── MyTasks.jsx
│       │   ├── UserManagement.jsx
│       │   └── CourierManagement.jsx
│       ├── services/       # API services
│       │   └── api.js
│       ├── utils/          # Utilities
│       │   └── AuthContext.js
│       ├── App.js
│       └── index.js
│
└── server/                 # Node.js backend
    ├── config/
    │   └── database.js     # Database configuration
    ├── controllers/        # Route controllers
    │   ├── authController.js
    │   ├── userController.js
    │   ├── taskController.js
    │   ├── taskUpdateController.js
    │   ├── courierController.js
    │   └── dashboardController.js
    ├── models/             # Sequelize models
    │   ├── User.js
    │   ├── Task.js
    │   ├── TaskAssignment.js
    │   ├── TaskUpdate.js
    │   ├── Courier.js
    │   └── index.js
    ├── routes/             # API routes
    │   ├── authRoutes.js
    │   ├── userRoutes.js
    │   ├── taskRoutes.js
    │   ├── taskUpdateRoutes.js
    │   ├── courierRoutes.js
    │   └── dashboardRoutes.js
    ├── middleware/         # Custom middleware
    │   ├── auth.js
    │   └── upload.js
    └── server.js           # Entry point
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/employees` - Get all employees
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Deactivate user

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/my-tasks` - Get my assigned tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create task (Admin)
- `PUT /api/tasks/:id` - Update task (Admin)
- `DELETE /api/tasks/:id` - Delete task (Admin)

### Task Updates
- `POST /api/task-updates` - Add task update
- `GET /api/task-updates/:taskId` - Get task updates

### Couriers
- `GET /api/couriers` - Get all couriers
- `POST /api/couriers` - Create courier entry
- `PUT /api/couriers/:id` - Update courier
- `DELETE /api/couriers/:id` - Delete courier

### Dashboard
- `GET /api/dashboard/admin` - Get admin dashboard stats

## Features in Detail

### Admin Features
- Create and manage users
- Create and assign tasks to employees
- View all tasks and their status
- Monitor employee productivity
- Manage courier entries
- View comprehensive dashboard with analytics

### Employee Features
- View assigned tasks
- Update task status and progress
- Add daily work logs
- Track time spent on tasks
- View personal dashboard
- Manage courier entries

## Security Features
- Password hashing with bcrypt
- JWT-based authentication
- Protected routes with middleware
- Role-based access control
- Session management

## Future Enhancements
- Email notifications for task assignments
- SMS alerts for overdue tasks
- File upload for task attachments
- Advanced reporting with PDF export
- Real-time notifications with WebSockets
- Mobile responsive design improvements

## License
MIT

## Support
For issues and questions, please create an issue in the repository.
