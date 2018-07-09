/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  'get /': 'HomeController.display',
  'post /': 'UserController.login',

  '/logout': 'UserController.logout',

  'get /menu': 'MenuController.display',

  'get /message': 'MessageController.display', //User Notifications
  'post /message': 'MessageController.search',

    'get /messageAdd': 'MessageController.addPage',
    'post /messageAdd': 'MessageController.addSubmit',

    'get /messageEdit/:id': 'MessageController.editPage',
    'post /messageEdit/:id': 'MessageController.editSubmit',

    '/messageDelete/:id': 'MessageController.delete',

  'get /provider': 'ProviderController.display',
  'post /provider': 'ProviderController.search',

    'get /providerEdit/:id': 'ProviderController.editPage',
    'post /providerEdit/:id': 'ProviderController.editSubmit',

  'get /forum': 'ForumController.display',
  'post /forum': 'ForumController.search',

    'get /forumFlagged': 'ForumController.displayFlagged',
    'post /forumFlagged': 'ForumController.searchFlagged',

    'get /forumRemoved': 'ForumController.displayRemoved',
    'post /forumRemoved': 'ForumController.searchRemoved',

    '/forumFlag/:id': 'ForumController.flag',

    '/forumWeakDelete/:id': 'ForumController.weakDelete',

    '/forumStrongDelete/:id': 'ForumController.strongDelete',

  'get /client': 'ClientController.display',
  'post /client': 'ClientController.search',

  'get /admin': 'UserController.display',

    'get /adminAdd': 'UserController.createPage',
    'post /adminAdd': 'UserCOntroller.createSubmit',

    'get /adminEdit/:id': 'UserController.editPage',
    'post /adminEdit/:id': 'UserController.editSubmit',

    '/adminDelete/:id': 'UserController.delete',

  'get /stripe_connection': 'StripeConnectionController.getCode'


  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
