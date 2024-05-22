const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Use the DATABASE_URL from environment variables for production
const sequelize = new Sequelize('postgres://default:eGzkQbDH2ha4@ep-calm-mode-a4oityx9-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require', {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectModule: require('pg'),
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Adjust based on your SSL configuration
    },
  },
});


const bcryptjs = require('bcryptjs');
const User = require('../models/userModel')(sequelize, DataTypes);
const Invoice = require('../models/invoiceModel')(sequelize, DataTypes);
const data = [{client_name: 'Admin', client_phone: '+251987654321', client_email: 'admin@test.com', client_company: 'Test'}];


(async () => {
  try {
    // await sequelize.sync({ force: true }); // This will drop and recreate all tables on this db
    await User.sync({ force: true });
    
    const generateHashedPassword = async () => {
      return await bcryptjs.hash('Admin123.', 10);
    };

    const password = await generateHashedPassword();
    const seedData = [
      {
        fullName: 'Eraye Ketsi',
        email: 'ketsi@gmail.com',
        password: password,
        phone: '+2519876543215',
        role: 'admin'
      }
    ];

    await User.bulkCreate(seedData);
    await Invoice.sync({ force: true });
    await Invoice.bulkCreate(data);

    console.log('Seed data added successfully.');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await sequelize.close();
  }
})();
