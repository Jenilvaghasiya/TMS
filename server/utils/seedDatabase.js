const bcrypt = require('bcryptjs');
const { User, Task, Courier, TaskAssignment, TaskUpdate } = require('../models');

async function seedDatabase() {
  try {
    const userCount = await User.count();
    
    // Only seed if database is empty
    if (userCount > 0) {
      console.log('Database already has data. Skipping seed.');
      return;
    }

    console.log('Seeding database with sample data...');

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@company.com',
      password: 'admin123',
      fullName: 'System Administrator',
      role: 'admin',
      isActive: true
    });
    console.log('✓ Admin user created: admin / admin123');

    // Create employee users
    const employees = await User.bulkCreate([
      {
        username: 'john.doe',
        email: 'john.doe@company.com',
        password: 'emp123',
        fullName: 'John Doe',
        role: 'employee',
        isActive: true
      },
      {
        username: 'jane.smith',
        email: 'jane.smith@company.com',
        password: 'emp123',
        fullName: 'Jane Smith',
        role: 'employee',
        isActive: true
      },
      {
        username: 'mike.johnson',
        email: 'mike.johnson@company.com',
        password: 'emp123',
        fullName: 'Mike Johnson',
        role: 'employee',
        isActive: true
      },
      {
        username: 'sarah.williams',
        email: 'sarah.williams@company.com',
        password: 'emp123',
        fullName: 'Sarah Williams',
        role: 'employee',
        isActive: true
      }
    ]);
    console.log('✓ 4 Employee users created (password: emp123)');

    // Create sample tasks
    const tasks = await Task.bulkCreate([
      {
        title: 'Fix Critical Production Bug',
        description: 'Database connection timeout issue affecting all users.',
        priority: 'Urgent',
        status: 'In-Progress',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        createdBy: admin.id
      },
      {
        title: 'Complete Q4 Financial Report',
        description: 'Prepare comprehensive financial analysis for Q4 2024.',
        priority: 'High',
        status: 'In-Progress',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdBy: admin.id
      },
      {
        title: 'Website Redesign Phase 2',
        description: 'Implement new UI/UX design for customer portal.',
        priority: 'Medium',
        status: 'Pending',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        createdBy: admin.id
      },
      {
        title: 'Update Employee Handbook',
        description: 'Revise company policies and update handbook.',
        priority: 'High',
        status: 'Completed',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        createdBy: admin.id
      },
      {
        title: 'Marketing Campaign Analysis',
        description: 'Analyze results from recent social media campaigns.',
        priority: 'Medium',
        status: 'Completed',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdBy: admin.id
      },
      {
        title: 'Office Supply Inventory',
        description: 'Count and order office supplies for next quarter.',
        priority: 'Low',
        status: 'Pending',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdBy: admin.id
      }
    ]);
    console.log('✓ 6 Sample tasks created');

    // Assign tasks to employees
    await TaskAssignment.bulkCreate([
      { taskId: tasks[0].id, userId: employees[0].id }, // John - Critical Bug
      { taskId: tasks[1].id, userId: employees[1].id }, // Jane - Financial Report
      { taskId: tasks[2].id, userId: employees[0].id }, // John - Website Redesign
      { taskId: tasks[2].id, userId: employees[2].id }, // Mike - Website Redesign
      { taskId: tasks[3].id, userId: employees[1].id }, // Jane - Handbook (Completed)
      { taskId: tasks[4].id, userId: employees[3].id }, // Sarah - Marketing (Completed)
      { taskId: tasks[5].id, userId: employees[2].id }  // Mike - Office Supply
    ]);
    console.log('✓ Tasks assigned to employees');

    // Add task updates (work logs)
    await TaskUpdate.bulkCreate([
      {
        taskId: tasks[0].id,
        userId: employees[0].id,
        comment: 'Started investigating the database issue. Checked server logs.',
        status: 'In-Progress',
        hoursWorked: 2.5
      },
      {
        taskId: tasks[1].id,
        userId: employees[1].id,
        comment: 'Gathered all financial data from accounting department.',
        status: 'In-Progress',
        hoursWorked: 4.0
      },
      {
        taskId: tasks[3].id,
        userId: employees[1].id,
        comment: 'Updated handbook with new policies and got approval.',
        status: 'Completed',
        hoursWorked: 4.5
      },
      {
        taskId: tasks[4].id,
        userId: employees[3].id,
        comment: 'Completed analysis report with recommendations.',
        status: 'Completed',
        hoursWorked: 5.0
      }
    ]);
    console.log('✓ Task updates added');

    // Create courier entries
    await Courier.bulkCreate([
      {
        senderName: 'ABC Suppliers Ltd',
        receiverName: 'John Doe',
        courierType: 'FedEx',
        trackingNumber: 'FDX123456789',
        status: 'Delivered',
        receivedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        deliveredDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        remarks: 'Office supplies - printer cartridges',
        createdBy: admin.id
      },
      {
        senderName: 'Tech Solutions Inc',
        receiverName: 'IT Department',
        courierType: 'DHL',
        trackingNumber: 'DHL987654321',
        status: 'Delivered',
        receivedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        deliveredDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        remarks: 'Server hardware components',
        createdBy: admin.id
      },
      {
        senderName: 'Office Depot',
        receiverName: 'Admin Department',
        courierType: 'FedEx',
        trackingNumber: 'FDX789456123',
        status: 'Received',
        receivedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        remarks: 'Stationery items - urgent',
        createdBy: admin.id
      },
      {
        senderName: 'Dell Technologies',
        receiverName: 'Mike Johnson',
        courierType: 'DHL',
        trackingNumber: 'DHL321654987',
        status: 'Received',
        receivedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        remarks: 'Laptop for new employee',
        createdBy: admin.id
      }
    ]);
    console.log('✓ 4 Courier entries created');

    console.log('\n========================================');
    console.log('✓ Database seeding completed successfully!');
    console.log('========================================');
    console.log('\nLogin Credentials:');
    console.log('Admin: admin / admin123');
    console.log('Employees: john.doe, jane.smith, mike.johnson, sarah.williams / emp123');
    console.log('========================================\n');

  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

module.exports = seedDatabase;
