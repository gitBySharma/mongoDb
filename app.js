const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  User.findById('673eead2cfe2922d70f1e773')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect("mongodb+srv://fetchsubhankar:we87WCfEaxR3tzvX@cluster0.fcte2.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0")
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Subhankar',
          email: 'subhankar@gmail.com',
          cart: []
        });
        user.save();
      }
    });
    app.listen(3000);
    console.log("Server is live");
  })
  .catch(err => {
    console.log(err);
  });
