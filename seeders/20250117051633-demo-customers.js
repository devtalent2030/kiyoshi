'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Generate hashed passwords for all customers
    const hashedPasswords = await Promise.all(
      Array.from({ length: 20 }, (_, i) => bcrypt.hash(`password${i + 1}`, 10))
    );

    // Insert 20 demo customers
    return queryInterface.bulkInsert(
      'Customers',
      Array.from({ length: 20 }, (_, i) => ({
        FirstName: `FirstName${i + 1}`,
        LastName: `LastName${i + 1}`,
        PhoneNumber: `123-456-78${i}`,
        EmailAddress: `user${i + 1}@example.com`,
        PaymentInfo: i % 2 === 0 ? 'VISA' : 'MasterCard',
        Password: hashedPasswords[i], // Store hashed password
        DateCreated: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all demo customers
    return queryInterface.bulkDelete('Customers', null, {});
  },
};
