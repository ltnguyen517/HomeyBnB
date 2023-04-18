'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: 'modernliving.url'
      },
      {
        reviewId: 2,
        url: 'forestystay.url'
      },
      {
        reviewId: 3,
        url: 'rusticstay.url'
      },
      {
        reviewId: 4,
        url: 'luxurybeachfront.url'
      },
      {
        reviewId: 5,
        url: 'cozyarea.url'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
