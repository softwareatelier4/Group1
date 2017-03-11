'use strict';

var mongoose = require('mongoose');
var JobListing = mongoose.model('Freelance');
var Review = mongoose.model('Review');
var ObjectId = mongoose.Types.ObjectId;

var freelancers = {
  name : 'Freelance', // this is the name of the model in mongoose
  data : [
      {
           "_id"        : "5837133bcb98f316ac47384",
           "name"       : "Freelance A",
           "address"    : "Caltgadira 116, 6883 Novazzano",
           "email"      : "noneme@icloud.com",
           "phone"      : "032 332 42 72",
           "avgScore"   : 0,
           "priceRange" : "12-24.-/h",
           "reviews"    : ["5866a6162d6c4804f847ea3b", ],
           "tags"       : ["testTag1", "testTag2", "testTag3"]
		  },
      {
           "_id"        : "5837133bcb98f316ac473850",
           "name"       : "Freelance B",
           "address"    : "Strickstrasse 64, 8005 Zuerich",
           "email"      : "mschilli@mac.com",
           "phone"      : "043 861 88 44",
           "avgScore"   : 2,
           "priceRange" : "12-24.-/h",
           "reviews"    : [""],
           "tags"       : ["testTag1", "testTag3", "testTag4"]
      },
      {
           "_id"        : "5837133bcb98f316ac473852",
           "name"       : "Freelance C",
           "address"    : "Postfach 139, 3473 Alchenstorf",
           "email"      : "thassine@gmail.com",
           "phone"      : "034 353 66 82",
           "avgScore"   : 4,
           "priceRange" : "12-24.-/h",
           "reviews"    : [""],
           "tags"       : ["testTag1", "testTag5", "testTag6"]
      }
  ]
}


var reviews = {
	name : 'Review', // this is the name of the model in mongoose
	data : [
    {
      "_id"     : "5866a6162d6c4804f847ea3b",
      "author"  : "Trinette C Favreau",
      "text"    : "One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections. The bedding was hardly able to cover it and seemed ready to slide off any moment. His many legs, pitifully thin compared with the size of the rest of him, waved about helplessly as he looked. 'What's happened to me?' he thought. It wasn't a dream. His room, a proper human room although a little too small, lay peacefully between its four familiar walls. A collection of textile samples lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame. It showed a lady fitted out with a fur hat and fur boa who sat upright, raising a heavy fur muff that covered the whole of her lower arm towards the viewer. Gregor then turned to look out the window at the dull weather.",
      "score"   : 0,
      "target"  : "5837133bcb98f316ac47384" //Freelance A
    },
    {
      "_id"     : "5866a5cc2d6c4804f847ea38",
      "author"  : "Sara M Becker",
      "text"    : "A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine. I am so happy, my dear friend, so absorbed in the exquisite sense of mere tranquil existence, that I neglect my talents. I should be incapable of drawing a single stroke at the present moment; and yet I feel that I never was a greater artist than now. When, while the lovely valley teems with",
      "score"   : 0,
      "target"  : "5837133bcb98f316ac47384" // Freelance A
    },
    {
      "_id"     : "5866a5cb2d6c4804f847ea37",
      "author"  : "Flordelis J Brian",
      "text"    : "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to",
      "score"   : 0,
      "target"  : "5837133bcb98f316ac473850" // Freelance B
    },
    {
      "_id"     : "5866a5cb2d6c4804f847ea36",
      "author"  : "Thorsten C König",
      "text"    : "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar,",
      "score"   : 0,
      "target"  : "5837133bcb98f316ac473850" // Freelance B
    },
    {
      "_id"     : "5866a41c2d6c4804f847ea33",
      "author"  : "Ute P Propst",
      "text"    : "",
      "score"   : 0,
      "target"  : "5837133bcb98f316ac473852" // Freelance C
    },

	]
}



var seedData = [];
seedData.push(freelancers);
seedData.push(reviews);

module.exports = seedData;
