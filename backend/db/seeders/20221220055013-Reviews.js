// 'use strict';
// const {Spot, Review, User} = require('../models')

// const reviewsData = [
//       {
//         name: 'The Royce Home',
//         username: 'ADRosario',
//         review: 'Place was pristine clean with lots of sunlight.',
//         stars: 4
//       },
//       {
//         name: 'The Adrian Estate',
//         username: 'TaraJ6',
//         review: 'Real spacious and landlord accomodated us with loads of snacks.',
//         stars: 5
//       },
//       {
//         name: 'LaGalleria',
//         username: 'RollsRoyce',
//         review: 'Has a awesome infinity pool in the backyard.',
//         stars: 5
//       },
//       {
//         name: 'Ala Moana',
//         username: 'Demo-lition',
//         review: 'We had an absolutely wonderful time at this gem atop the mountain! The place is as gorgeous as the pictures, but no picture can do justice for the stunning view. This was a weekend my friends and I were able to relax and reconnect!',
//         stars: 4
//       },
//       {
//         name: 'Noku Beach House',
//         username: 'ADRosario',
//         review: 'Beautiful home with all the amenities. We felt at home, at peace, and very well relaxed in the home with breathtaking views. Highly recommend for those wanting to decompress with views to boot.',
//         stars: 4
//       }
// ]
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     for(let reviewIndex = 0; reviewIndex < reviewsData.length; reviewIndex++) {
//       let reviewData = reviewsData[reviewIndex]
//       let spot = await Spot.findOne({where:{name:reviewData.name}})
//       let user = await User.findOne({where:{username:reviewData.username}})

//       if(spot) {
//         delete reviewData.name
//         delete reviewData.username
//         let spotId = spot.id
//         let userId = user.id
//         await Review?.create({...reviewData, spotId, userId})
//       }
//     }
//   },

//   async down (queryInterface, Sequelize) {
//     for(let reviewIndex = 0; reviewIndex<reviewsData.length; reviewIndex++) {
//       let reviewData = reviewsData[reviewIndex]
//       let spot = await Spot.findOne({where:{name:reviewData.name}})
//       let user = await User.findOne({where:{username:reviewData.username}})

//       if(spot) {
//         delete reviewData.name
//         let spotId = spot.id
//         let userId = user.id
//         await Review.destroy({where:{...reviewData, spotId, userId}})
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
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 3,
        review: 'Place was pristine clean with lots of sunlight.',
        stars: 4
      },
      {
        spotId: 3,
        userId: 2,
        review: 'Real spacious and landlord accomodated us with loads of snacks.',
        stars: 5
      },
      {
        spotId: 5,
        userId: 1,
        review: 'Has a awesome infinity pool in the backyard.',
        stars: 5
      },
      {
        spotId: 6,
        userId: 4,
        review: 'We had an absolutely wonderful time at this gem atop the mountain! The place is as gorgeous as the pictures, but no picture can do justice for the stunning view. This was a weekend my friends and I were able to relax and reconnect!',
        stars: 4
      },
      {
        spotId: 18,
        userId: 3,
        review: 'Beautiful home with all the amenities. We felt at home, at peace, and very well relaxed in the home with breathtaking views. Highly recommend for those wanting to decompress with views to boot.',
        stars: 4
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 3, 5, 6, 18] }
    }, {});
  }
};
