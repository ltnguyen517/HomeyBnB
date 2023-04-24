// 'use strict';

// let options = {};
// if (process.env.NODE_ENV === 'production') {
//   options.schema = process.env.SCHEMA;  // define your schema in options object
// }

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     options.tableName = 'SpotImages';
//     return queryInterface.bulkInsert(options, [
//       {
//         spotId: 1,
//         url: 'https://photos.zillowstatic.com/fp/3f5360b14e1700325df680f55f77161b-uncropped_scaled_within_1344_1008.webp',
//         preview: true
//       },
//       {
//         spotId: 2,
//         url: 'https://photos.zillowstatic.com/fp/991efe571b501b31dd1b9b40a303e995-uncropped_scaled_within_1536_1152.webp',
//         preview: true
//       },
//       {
//         spotId: 3,
//         url: 'https://photos.zillowstatic.com/fp/7fad1c29266e9259c41701dc7f966db3-uncropped_scaled_within_1536_1152.webp',
//         preview: true
//       },
//       {
//         spotId: 4,
//         url: 'https://a0.muscache.com/im/pictures/miso/Hosting-21409981/original/a8fa243d-dac8-4238-93e5-f7aa33072ff8.jpeg?im_w=1440',
//         preview: true
//       },
//       {
//         spotId: 5,
//         url: 'https://a0.muscache.com/im/pictures/e4d2829b-08b3-412b-bc0b-5c633d998702.jpg?im_w=1200',
//         preview: true
//       },
//       {
//         spotId: 6,
//         url: 'https://a0.muscache.com/im/pictures/miso/Hosting-633062972381554120/original/2c1db7a7-25db-431b-ab5d-4bdca5763546.jpeg?im_w=960',
//         preview: true
//       },
//       {
//         spotId: 7,
//         url: 'https://a0.muscache.com/im/pictures/f41f08e8-6318-4f7b-85a2-df4a18a9d214.jpg?im_w=960',
//         preview: true
//       },
//       {
//         spotId: 8,
//         url: 'https://a0.muscache.com/im/pictures/miso/Hosting-46695796/original/9bd67185-dc83-4473-a191-9486c62aec66.jpeg?im_w=1200',
//         preview: true
//       },
//       {
//         spotId: 9,
//         url: 'https://a0.muscache.com/im/pictures/8d9afde8-3412-4ca5-92a3-de1c8c628360.jpg?im_w=1200',
//         preview: true
//       },
//       {
//         spotId: 10,
//         url: 'https://a0.muscache.com/im/pictures/miso/Hosting-523783410417354397/original/a0517e76-4d5a-4ead-b69a-a9acfcffab26.jpeg?im_w=1440',
//         preview: true
//       },
//       {
//         spotId: 11,
//         url: 'https://a0.muscache.com/im/pictures/miso/Hosting-48766928/original/01c3131c-c07f-4151-b72a-c908f0a3f2dc.jpeg?im_w=1440',
//         preview: true
//       },
//       {
//         spotId: 12,
//         url: 'https://a0.muscache.com/im/pictures/87f909e9-7c78-4561-bf4c-81dc0d4087bc.jpg?im_w=1200',
//         preview: true
//       },
//       {
//         spotId: 13,
//         url: 'https://a0.muscache.com/im/pictures/a7c4c78b-2b3e-4d46-9e31-2ab3e46a908e.jpg?im_w=1200',
//         preview: true
//       },
//       {
//         spotId: 14,
//         url: 'https://a0.muscache.com/im/pictures/miso/Hosting-640411639154517733/original/52de873e-7da2-4e41-be62-e69cc5bbad8b.jpeg?im_w=1200',
//         preview: true
//       },
//       {
//         spotId: 15,
//         url: 'https://a0.muscache.com/im/pictures/3519a978-e885-4d8a-afc7-0bfb3d663e3d.jpg?im_w=1440',
//         preview: true
//       },
//       {
//         spotId: 16,
//         url: 'https://a0.muscache.com/im/pictures/bef74f25-cf5c-4c0b-be9e-542a844d10e9.jpg?im_w=1200',
//         preview: true
//       },
//       {
//         spotId: 17,
//         url: 'https://a0.muscache.com/im/pictures/miso/Hosting-752943099290902616/original/a00f8cfd-591b-48d4-a7ca-4c9427ef54d2.jpeg?im_w=1440',
//         preview: true
//       },
//       {
//         spotId: 18,
//         url: 'https://a0.muscache.com/im/pictures/monet/Luxury-28540017/original/42cde801-3346-41c6-a63a-40bd5a2d5867?im_w=1440',
//         preview: true
//       }
//     ], {});
//   },

//   async down (queryInterface, Sequelize) {
//     options.tableName = 'SpotImages';
//     const Op = Sequelize.Op;
//     return queryInterface.bulkDelete(options, {
//       spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] }
//     }, {});
//   }
// };
'use strict';
const {Spot, SpotImage} = require('../models')

const imagesData = [
  {
    url:'https://a0.muscache.com/im/pictures/prohost-api/Hosting-39283022/original/8e07d34d-eb2b-45f6-8c75-353ff6a588cb.jpeg?im_w=960',
    name:'Eagles Nest at Bass Lake near Yosemite',
    preview: true
  },
]
module.exports = {
  async up (queryInterface, Sequelize) {
    for(let imageIndex = 0; imageIndex<imagesData.length; imageIndex++) {
      let imageData = imagesData[imageIndex]
      let spot = await Spot.findOne({where:{name:imageData.name}})
      if(spot) {
        delete imageData.name
        let spotId = spot.id
        await SpotImage.create({...imageData,spotId})
      }
    }
  },

  async down (queryInterface, Sequelize) {

    for(let imageIndex = 0; imageIndex<imagesData.length; imageIndex++) {
      let imageData = imagesData[imageIndex]
      let spot = await Spot.findOne({where:{name:imageData.name}})
      if(spot) {
        delete imageData.name
        let spotId = spot.id
        await SpotImage.destroy({where:{...imageData,spotId}})
      }
    }

  }
};
