const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const taskUpdateRoutes = require('./routes/taskUpdateRoutes');
const courierRoutes = require('./routes/courierRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/task-updates', taskUpdateRoutes);
app.use('/api/couriers', courierRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Task Management System API' });
});

const PORT = process.env.PORT || 5000;
const seedDatabase = require('./utils/seedDatabase');

async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established');
    
    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: false });
    console.log('Database synced');
    
    // Seed database with initial data
    await seedDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
}

startServer();
