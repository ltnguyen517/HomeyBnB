'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        firstName: 'Royce',
        lastName: 'Nguyen',
        email: 'roycenguyen@gmail.com',
        username: 'RollsRoyce',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Tara',
        lastName: 'James',
        email: 'tjames@yahoo.com',
        username: 'TaraJ6',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Adrian',
        lastName: 'Rosario',
        email: 'rosario@gmail.com',
        username: 'ADRosario',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'Demo',
        lastName: 'lition',
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['RollsRoyce', 'TaraJ6', 'ADRosario', 'Demo-lition'] }
    }, {});
  }
};
