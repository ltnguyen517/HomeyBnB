'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '4615 Merwin St',
        city: 'Houston',
        state: 'Texas',
        country: 'USA',
        lat: 41.83,
        lng: -125.21,
        name: 'The Royce Home',
        description: 'Beautiful new construction at the heart of River Oaks',
        price: 950.50
      },
      {
        ownerId: 2,
        address: '27 Mott Ln',
        city: 'Houston',
        state: 'Texas',
        country: 'USA',
        lat: 35.67,
        lng: -130.49,
        name: 'Tara Mansion',
        description: 'Majestic modern architecture with view of Buffalo Bayou',
        price: 1200.99
      },
      {
        ownerId: 3,
        address: '1000 Kirby Dr',
        city: 'Houston',
        state: 'Texas',
        country: 'USA',
        lat: 50.70,
        lng: -150.31,
        name: 'The Adrian Estate',
        description: 'Gated estate with proximity to Downtown',
        price: 1400.99
      }
    ], {});
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['4615 Merwin St', '27 Mott Ln', '1000 Kirby Dr']}
    }, {});
  }
};
