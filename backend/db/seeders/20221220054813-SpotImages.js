'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://photos.zillowstatic.com/fp/3f5360b14e1700325df680f55f77161b-uncropped_scaled_within_1344_1008.webp',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://photos.zillowstatic.com/fp/991efe571b501b31dd1b9b40a303e995-uncropped_scaled_within_1536_1152.webp',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://photos.zillowstatic.com/fp/7fad1c29266e9259c41701dc7f966db3-uncropped_scaled_within_1536_1152.webp',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-21409981/original/a8fa243d-dac8-4238-93e5-f7aa33072ff8.jpeg?im_w=1440',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://a0.muscache.com/im/pictures/e4d2829b-08b3-412b-bc0b-5c633d998702.jpg?im_w=1200',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-633062972381554120/original/2c1db7a7-25db-431b-ab5d-4bdca5763546.jpeg?im_w=960',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://a0.muscache.com/im/pictures/f41f08e8-6318-4f7b-85a2-df4a18a9d214.jpg?im_w=960',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-46695796/original/9bd67185-dc83-4473-a191-9486c62aec66.jpeg?im_w=1200',
        preview: true
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
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8] }
    }, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
