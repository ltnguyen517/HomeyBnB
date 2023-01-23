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
      },
      {
        ownerId: 1,
        address: '142 Poke Street',
        city: 'Rhinebeck',
        state: 'New York',
        country: 'USA',
        lat: 55.10,
        lng: -110.01,
        name: 'Architectural wonder in the woods',
        description: 'Enjoy a weekend or a few days eco-friendly retreat in an architectural, geometric masterpiece on 30 preserved acres just minutes from all that Rhinebeck and the Hudson Valley have to offer.',
        price: 600.99
      },
      {
        ownerId: 2,
        address: '189 River Oaks',
        city: 'Houston',
        state: 'Texas',
        country: 'USA',
        lat: 59.00,
        lng: 130.21,
        name: 'LaGalleria',
        description: 'Nestled on a quiet & safe tree lined street in the middle of the city.Walking distance to fine dining, shops, gym, book store & grocery stores. Less than 5 miles from Museums, Medical center, Downtown and the Galleria!',
        price: 400
      },
      {
        ownerId: 3,
        address: '72 Ala Moana',
        city: 'Honolulu',
        state: 'Hawaii',
        country: 'USA',
        lat: 15.15,
        lng: -200.50,
        name: 'Ala Moana',
        description: 'The Ala Moana Condo building offers a pool, gym and even Starbucks. Our guests can access to all the amenities offered by the hotel.',
        price: 230
      },
      {
        ownerId: 1,
        address: '12 Orleans',
        city: 'Orleans',
        state: 'Massachusetts',
        country: 'USA',
        lat: 38.70,
        lng: -103.31,
        name: 'Waterfront. Private beach. Heated Pool.',
        description: 'Chosen by Cape Cod Life as one of the top spots to stay on the Cape. The 17 rm estate is perfect for all water sports.',
        price: 800.50
      },
      {
        ownerId: 2,
        address: '32 Lac',
        city: 'Lac-Beauport',
        state: 'Quebec',
        country: 'Canada',
        lat: 12.21,
        lng: -330.31,
        name: 'Le Mica',
        description: 'Nothing can prepare you for the awe, beauty, and peace of this place!',
        price: 450
      },

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
      address: { [Op.in]: ['4615 Merwin St', '27 Mott Ln', '1000 Kirby Dr', '142 Poke Street', '189 River Oaks', '72 Ala Moana', '12 Orleans', '32 Lac']}
    }, {});
  }
};
