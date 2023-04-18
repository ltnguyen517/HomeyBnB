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
      {
        ownerId: 4,
        address: '11 Hancock Ave',
        city: 'Hancock',
        state: 'New York',
        country: 'USA',
        lat: 70.11,
        lng: 32.01,
        name: 'The Catskill A-Frame',
        description: 'Our fully-restored 1964 built A-Frame cabin is the perfect getaway from the everyday. Nestled up in the western Catskill Mountains, on 1/4 acre, with lake views from the main, and third floor, as well as a forest & stream in our backyard, you will find yourself immersed in tranquility.',
        price: 333
      },
      {
        ownerId: 4,
        address: '200 Madison',
        city: 'Madison',
        state: 'New Hampshire',
        country: 'USA',
        lat: 75.21,
        lng: 89.51,
        name: 'Chalet in the Clouds',
        description: 'Relax & Rejuvenate w/ panoramic views of White Mountains from any of the 4 decks of Kailaśa Chalet! Perched on top of a mountain overlooking Mt Chocorua & Silver Lake w/ majestic views of Mt Washington Valley. So easy to get lost in the beauty of Kailaśa!',
        price: 501
      },
      {
        ownerId: 2,
        address: '51 York St',
        city: 'York',
        state: 'Maine',
        country: 'USA',
        lat: 31.62,
        lng: 90.31,
        name: 'Paradise in York',
        description: 'This vast 6 bedroom property offers you everything you need for your dream vacation: Superb 180 degree ocean view, 3 terrasses, grill, heated pool, hot tub, pool and air hockey tables, fire pit, interior fireplace, fenced area for dogs, 9 tvs, 2 sets of dishwashers, 2 sets of washer/dryer, Keurig machine on every floor, main floor adapted for wheelchairs, etc.',
        price: 2080
      },
      {
        ownerId: 1,
        address: '4040 Stamford',
        city: 'Stamford',
        state: 'New York',
        country: 'USA',
        lat: 51.13,
        lng: 142.41,
        name: 'The A-Frame at Harvest Moon Acres',
        description: 'Come, give peace a chance…escape the city and breathe in some mountain air and take in nature  on our very private six acres.  Enjoy our Mountain View, amazing sunsets and magical stargazing.',
        price: 334
      },
      {
        ownerId: 4,
        address: '49 Ick Ave',
        city: 'Brigantine',
        state: 'New Jersey',
        country: 'USA',
        lat: 120.21,
        lng: 78.41,
        name: 'Mediterranean Mansion by the Sea',
        description: 'Location, location, location!!  This 6500 SF luxury Mediterranean-style beach mansion is located in the heart of the prestigious "A-zone" of Brigantine and is literally a few steps from the pristine Brigantine beach.  Located on a double lot just 3 homes from the ocean, this huge mansion boasts direct, unobstructed ocean views.',
        price: 898
      },
      {
        ownerId: 1,
        address: '21 Clinton Blvd',
        city: 'Clinton',
        state: 'Connecticut',
        country: 'USA',
        lat: 62.41,
        lng: 12.11,
        name: 'Oceanfront Paradise',
        description: 'This updated ocean front luxurious 4 bedroom 3 bath is a dream home in a high-end community located in Clinton, Connecticut.',
        price: 650
      },
      {
        ownerId: 2,
        address: '23 Prescott',
        city: 'Prescott',
        state: 'Arizona',
        country: 'USA',
        lat: 75.41,
        lng: 42.01,
        name: 'The Majestic Mountain Retreat',
        description: 'Unplug and recharge at The Majestic Mountain Retreat, as seen on Cash Pad on CNBC! Also known as the Walker Getaway, it is a wonderful place to relax and enjoy epic views from the patio. With no neighbors in sight in a quiet serene setting situated at 6500 elev.',
        price: 195
      },
      {
        ownerId: 4,
        address: '31 Payson',
        city: 'Payson',
        state: 'Arizona',
        country: 'USA',
        lat: 75.11,
        lng: 39.01,
        name: 'Payson Perfection',
        description: 'Escape the hustle and bustle of the city! There is something for everyone to enjoy on this 2.5 acre property. Although located in town, youll feel like youre in the middle of the forest with all the right amenities.',
        price: 433
      },
      {
        ownerId: 3,
        address: '12 Moore St',
        city: 'Mooresville',
        state: 'North Carolina',
        country: 'USA',
        lat: 42.41,
        lng: 91.81,
        name: 'Hidden Harbor',
        description: 'This oasis is tucked away in the trees on picturesque Lake Norman. The open-concept interior features ample space for the whole gang to spread out. A screened-in deck is the perfect place to savor an al fresco meal with a fresh breeze and the hum of nature. Vintage lights glow in the twilight as you soak in the hot tub. A games room keeps the fun rolling. Take the kayaks for a peaceful paddle.',
        price: 1261
      },
      {
        ownerId: 2,
        address: '74 Bali Bali',
        city: 'Kabupaten Badung',
        state: 'Bali',
        country: 'Indonesia',
        lat: 170.11,
        lng: 36.31,
        name: 'Noku Beach House',
        description: 'A 30-foot infinity pool reaches toward the sea at this wood-clad villa on Seminyak Beach. A walled garden and attentive staff look onto the scene, with interiors by Alex Zabotto-Bentley adding potted plants, maritime sculptures, and designer furnishings. Order drinks at the wet bar, soak up views from the balcony, and splurge on a session in the private spa. Gado Gado Restaurant is steps away.',
        price: 4200
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
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['4615 Merwin St', '27 Mott Ln', '1000 Kirby Dr', '142 Poke Street', '189 River Oaks', '72 Ala Moana', '12 Orleans', '32 Lac', '11 Hancock Ave', '200 Madison', '51 York St', '4040 Stamford', '49 Ick Ave', '21 Clinton Blvd', '23 Prescott', '31 Payson', '12 Moore St', '74 Bali Bali' ]}
    }, {});
  }
};
