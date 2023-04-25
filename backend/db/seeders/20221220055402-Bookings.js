// 'use strict';
// const {User, Spot, Booking} = require('../models')

// const bookingData = [
//       {
//         name: 'The Royce Home',
//         username: 'ADRosario',
//         startDate: '2023-01-10',
//         endDate: '2023-01-15'
//       },
//       {
//         name: 'The Adrian Estate',
//         username: 'TaraJ6',
//         startDate: '2023-02-03',
//         endDate: '2023-02-15'
//       },
//       {
//         name: 'LaGalleria',
//         username: 'RollsRoyce',
//         startDate: '2023-05-15',
//         endDate: '2023-05-19'
//       },
//       {
//         name: 'Ala Moana',
//         username: 'Demo-lition',
//         startDate: '2023-07-11',
//         endDate: '2023-07-14'
//       },
//       {
//         name: 'Noku Beach House',
//         username: 'ADRosario',
//         startDate: '2023-09-20',
//         endDate: '2023-09-23'
//       }
// ]

// module.exports = {
//   async up (queryInterface, Sequelize) {
//     for(let bookingIndex = 0; bookingIndex<bookingData.length; bookingIndex++) {
//       let booking = bookingData[bookingIndex]
//       let spot = await Spot.findOne({where:{name:booking.name}})
//       let user = await User.findOne({where:{username:booking.username}})

//       if(spot && user) {
//         delete booking.name
//         delete booking.username
//         let userId = user.id
//         let spotId = spot.id
//         await Booking?.create({...booking, spotId, userId})
//       }
//     }
//   },

//   async down (queryInterface, Sequelize) {
//     for(let bookingIndex = 0; bookingIndex<bookingData.length; bookingIndex++) {
//       let booking = bookingData[bookingIndex]
//       let spot = await Spot.findOne({where:{name:booking.name}})
//       let user = await User.findOne({where:{username:booking.username}})

//       if(spot && user) {
//         delete booking.name
//         delete booking.username
//         let userId = user.id
//         let spotId = spot.id
//         await Booking.destroy({where:{...booking, spotId, userId}})
//       }
//     }

//   }
// };


'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 3,
        startDate: '2023-01-10',
        endDate: '2023-01-15'
      },
      {
        spotId: 3,
        userId: 2,
        startDate: '2023-02-03',
        endDate: '2023-02-15'
      },
      {
        spotId: 5,
        userId: 1,
        startDate: '2023-05-15',
        endDate: '2023-05-19'
      },
      {
        spotId: 6,
        userId: 4,
        startDate: '2023-07-11',
        endDate: '2023-07-14'
      },
      {
        spotId: 18,
        userId: 3,
        startDate: '2023-09-20',
        endDate: '2023-09-23'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 3, 5, 6, 18] }
    }, {});
  }
};
