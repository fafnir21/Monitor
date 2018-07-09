/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  login: function(req, res) {
    var username = req.param('username');
    var password = req.param('password');
    User.findOne({
      username: username,
      password: password
    }).exec(function(err, user) {
      if (err) {
        return res.badRequest(err);
      } else {
        if (user) {
          req.session.username = username;
          req.session.role = user.role;
          return res.redirect('/menu');
        } else {
          return res.badRequest('Wrong User or Password');
        }
      }
    });
  },

  logout: function(req, res) {
    req.session.username = null;
    return res.redirect('/');
  },

  display: function(req, res) {
    User.find({}).exec(function(err, users) {
      if (err) {
        return res.badRequest(err);
      } else {
        if (users) {
          return res.view('admin', {
            data: users
          });
        } else {
          return res.badRequest('No Results');
        }
      }
    });
  },

  createPage: function(req, res) {
    return res.view('adminCreate');
  },

  createSubmit: function(req, res) {
    var username = req.param('username');
    var password = req.param('password');
    var Notification = req.param('Notification') ? 1 : 0;
    var Forum = req.param('Forum') ? 1 : 0;
    var Providers = req.param('Providers') ? 1 : 0;
    var Users = req.param('Users') ? 1 : 0;
    var role = Notification * 8 + Forum * 4 + Providers * 2 + Users;

    User.create({
      username: username,
      password: password,
      role: role
    }).exec(function(err, newUser) {
      if(err){
        return res.badRequest(err);
      } else {
        return res.redirect('/admin');
      }
    });
  },

  editPage: function(req, res) {
    User.findOne({
      id: req.params.id
    }).exec(function(err, user) {
      if (err) {
        return res.badRequest(err);
      } else {
        if (user) {
          return res.view('adminEdit', {
            data: user
          });
        } else {
          return res.badRequest('No Results');
        }
      }
    });
  },

  editSubmit: function(req, res) {
    var password = req.param('password');
    var Notification = req.param('Notification') ? 1 : 0;
    var Forum = req.param('Forum') ? 1 : 0;
    var Providers = req.param('Providers') ? 1 : 0;
    var Users = req.param('Users') ? 1 : 0;
    var role = Notification * 8 + Forum * 4 + Providers * 2 + Users;

    User.update({
      id: req.params.id
    },{
      password: password,
      role: role
    }).exec(function(err, newUser) {
      if(err){
        return res.badRequest(err);
      } else {
        return res.redirect('/admin');
      }
    });
  },

  delete: function(req, res) {
    User.destroy({
      id: req.params.id
    }).exec(function(err) {
      if(err){
        return res.badRequest(err);
      } else {
        return res.redirect('/admin');
      }
    });
  }

};