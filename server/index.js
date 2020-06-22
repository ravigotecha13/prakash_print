const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const FakeDb = require('./fake-db');
const Rental = require('./models/rental');
const cors = require('cors');

const Homenews = require('./models/homenews');
const Newspaper = require('./models/newspaper');
const Newschannel = require('./models/newschannel');
const Newslink = require('./models/newslink');
const City = require('./models/city');
const Category = require('./models/category');
const Directory = require('./models/directory');
const NewsLive = require('./models/newslive');
const Socialtalents = require('./models/socialtalent');
const CompetitiveExam = require('./models/competitiveexam');
const Division = require('./models/division');
const Material = require('./models/material');
const Farmercorner = require('./models/farmercorner');
const Blood = require('./models/blood');
const Advertise = require('./models/advertise');
const Pressnote = require('./models/pressnote');
const Agency = require('./models/agency');
const Sponsoredads = require('./models/sponsoredads');
const Notification = require('./models/notification');

const Videoad = require('./models/videoad');


const path = require('path');

const rentalRoutes = require('./routes/rentals'),
      userRoutes = require('./routes/users'),
      bookingRoutes = require('./routes/bookings'),
      paymentRoutes = require('./routes/payments'),
      imageUploadRoutes = require('./routes/image-upload'),

      homenewsRoutes=require('./routes/homenews')
      newspaperRoutes=require('./routes/newspaper')
      newschannelRoutes=require('./routes/newschannel')
      newslinkRoutes=require('./routes/newslink')
      cityRoutes=require('./routes/city')
      categoryRoutes=require('./routes/category')
      directoryRoutes=require('./routes/directory')
      newsliveRoutes=require('./routes/newslive')
      competitiveexamRoutes=require('./routes/competitiveexam')
      divisionRoutes=require('./routes/division')
      materialRoutes=require('./routes/material')
      farmercornerRoutes=require('./routes/farmercorner')
      socialtalentsRoutes=require('./routes/socialtalents')
      bloodRoutes=require('./routes/blood')
      advertiseRoutes=require('./routes/advertise')
      pressnoteRoutes=require('./routes/pressnote')
      historicalknowledgeRoutes=require('./routes/historicalknowledge')
      agencyRoutes=require('./routes/agency')
      sponsoredadsRoutes=require('./routes/sponsoredads')
      notificationRoutes=require('./routes/notification')
      videoadRoutes=require('./routes/videoad')
      videoinquiryRoutes=require('./routes/videoinquiry')





      ;
console.log(config.DB_URI);

mongoose.connect(config.DB_URI).then(() => {
  if (process.env.NODE_ENV !== 'production') {
    // const fakeDb = new FakeDb();
    // fakeDb.seedDb();
  }
});

const app = express();
// app.use(bodyParser.json());
var base = '';

app.use(bodyParser.urlencoded({ extended: true,limit:'500mb' }));
app.use(bodyParser.json({limit: '500mb'}));
app.use("/assets", express.static(path.join(__dirname, 'assets')));
app.use("/public", express.static(path.join(__dirname, 'public')));

app.use(base+'/api/v1/homenews', homenewsRoutes);
app.use(base+'/api/v1/newspaper', newspaperRoutes);
app.use(base+'/api/v1/newschannel', newschannelRoutes);
app.use(base+'/api/v1/newslink', newslinkRoutes);
app.use(base+'/api/v1/city', cityRoutes);
app.use(base+'/api/v1/category', categoryRoutes);
app.use(base+'/api/v1/newslive', newsliveRoutes);
app.use(base+'/api/v1/directory', directoryRoutes);
app.use(base+'/api/v1/competitiveexam', competitiveexamRoutes);
app.use(base+'/api/v1/division', divisionRoutes);
app.use(base+'/api/v1/material', materialRoutes);
app.use(base+'/api/v1/farmercorner', farmercornerRoutes);
app.use(base+'/api/v1/socialtalents', socialtalentsRoutes);
app.use(base+'/api/v1/blood', bloodRoutes);
app.use(base+'/api/v1/advertise', advertiseRoutes);
app.use(base+'/api/v1/pressnote', pressnoteRoutes);
app.use(base+'/api/v1/historicalknowledge', historicalknowledgeRoutes);
app.use(base+'/api/v1/agency', agencyRoutes);
app.use(base+'/api/v1/sponsoredads', sponsoredadsRoutes);
app.use(base+'/api/v1/notification', notificationRoutes);
app.use(base+'/api/v1/videoad', videoadRoutes);
app.use(base+'/api/v1/videoinquiry', videoinquiryRoutes);

//app.use(base+'/mobileapi/v1/', bloodRoutes);

app.use('/api/v1/rentals', rentalRoutes);
app.use(base+'/api/v1/users', userRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1', imageUploadRoutes);

const appPath = path.join(__dirname, 'dist');
app.use(express.static(appPath));
//app.enable("trust proxy");
// app.get('*', function(req, res) {
//   console.log(appPath);
//   if(!req.secure){
// //    res.redirect("http://" + req.headers.host + req.url);
//   }
//   res.sendFile(path.resolve(appPath, 'index.html'));
// });
if (process.env.NODE_ENV === 'production') {

}

const PORT = process.env.PORT || 30001;

app.listen(PORT , function() {
  console.log(PORT);
  console.log('App is running!');
});
