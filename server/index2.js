const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
//const FakeDb = require('./fake-db');
const Rental = require('./models/rental');
const exec = require('await-exec')

const Newspaper = require('./models/newspaper');
const Newschannel = require('./models/newschannel');
const Newslink = require('./models/newslink');
const City = require('./models/city');
const NewsLive = require('./models/newslive');


const path = require('path');

const rentalRoutes = require('./routes/rentals'),
      userRoutes = require('./routes/users'),
      bookingRoutes = require('./routes/bookings'),
      paymentRoutes = require('./routes/payments'),
      imageUploadRoutes = require('./routes/image-upload'),

      newspaperRoutes=require('./routes/newspaper')
      newschannelRoutes=require('./routes/newschannel')
      newslinkRoutes=require('./routes/newslink')
      cityRoutes=require('./routes/city')
      newsliveRoutes=require('./routes/newslive')




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
app.use("/public", express.static(path.join(__dirname, 'public')));

app.use(base+'/api/v1/newspaper', newspaperRoutes);
app.use(base+'/api/v1/newschannel', newschannelRoutes);
app.use(base+'/api/v1/newslink', newslinkRoutes);
app.use(base+'/api/v1/city', cityRoutes);
app.use(base+'/api/v1/newslive', newsliveRoutes);

app.use('/api/v1/rentals', rentalRoutes);
app.use(base+'/api/v1/users', userRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1', imageUploadRoutes);

  const appPath = path.join(__dirname, 'dist');
  app.use(express.static(appPath));

if (process.env.NODE_ENV === 'production') {

  app.get('*', function(req, res) {
    res.sendFile(path.resolve(appPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 30001;

app.listen(PORT , function() {
  console.log(PORT);
  console.log('App is running!');
});
