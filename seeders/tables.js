const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

//TODO: please update this to access the credential form the .env file
// const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  const sequelize = new Sequelize('leptonGames', 'postgres', 'yes123', {
    host: DB_HOST,
    dialect: 'postgres',
    logging: false, // Set to true for debugging
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
