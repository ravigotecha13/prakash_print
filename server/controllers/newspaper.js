const Newspaper = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.getNewspaper = function(req, res) {
  const requestedNewspaperId = req.params.id;
  const user = res.locals.user;

  if (requestedNewspaperId === user.id) {
    Newspaper.findById(requestedNewspaperId, function(err, foundNewspaper) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      return res.json(foundNewspaper);
    })

  } else {
    Newspaper.findById(requestedNewspaperId)
      .select('-revenue -stripeCustomerId -password')
      .exec(function(err, foundNewspaper) {
        if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.json(foundNewspaper);
      })
  }
}




exports.auth =  function(req, res) {
  const { email, password } = req.body;

  if (!password || !email) {
    return res.status(422).send({errors: [{title: 'Data missing!', detail: 'Provide email and password!'}]});
  }

  Newspaper.findOne({email}, function(err, user) {
    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    if (!user) {
      return res.status(422).send({errors: [{title: 'Invalid Newspaper!', detail: 'Newspaper does not exist'}]});
    }

    if (user.hasSamePassword(password)) {
      const token = jwt.sign({
        userId: user.id,
        username: user.username
      }, config.SECRET, { expiresIn: '1h'});

      return res.json(token);
    } else {
      return res.status(422).send({errors: [{title: 'Wrong Data!', detail: 'Wrong email or password'}]});
    }
  });
}

exports.register =  function(req, res) {
  const { username, email, password, passwordConfirmation } = req.body;

  if (!password || !email) {
    return res.status(422).send({errors: [{title: 'Data missing!', detail: 'Provide email and password!'}]});
  }

  if (password !== passwordConfirmation) {
    return res.status(422).send({errors: [{title: 'Invalid passsword!', detail: 'Password is not a same as confirmation!'}]});
  }

  Newspaper.findOne({email}, function(err, existingNewspaper) {
    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    if (existingNewspaper) {
      return res.status(422).send({errors: [{title: 'Invalid email!', detail: 'Newspaper with this email already exist!'}]});
    }

    const user = new Newspaper({
      username,
      email,
      password
    });

    user.save(function(err) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      return res.json({'registered': true});
    })
  })
}

exports.authMiddleware = function(req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    const user = parseToken(token);

    Newspaper.findById(user.userId, function(err, user) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      if (user) {
        res.locals.user = user;
        next();
      } else {
        return notAuthorized(res);
      }
    })
  } else {
    return notAuthorized(res);
  }
}

exports.generateImageName = function(req, res, next) {
  const text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
  for (const i = 0; i < 5; i++)
  text += possible.charAt(Math.floor(Math.random() * possible.length));
  
  //return text;
    return res.json({'text': text});
//  return res.status(401).send({errors: [{title: 'Not authorized!', detail: 'You need to login to get access!'}]});

}


function parseToken(token) {
  return jwt.verify(token.split(' ')[1], config.SECRET);
}

function notAuthorized(res) {
  return res.status(401).send({errors: [{title: 'Not authorized!', detail: 'You need to login to get access!'}]});
}

