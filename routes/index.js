// the main route navigation.
var express = require('express');
var router = express.Router();

// get autharization methods.
var login = require('./login.js');
var user = require('./users.js');
var _default = require('./default.js');
var core = require('./core.js');

/*
 * Defualt
 */
router.get('/', _default._default);

/*
 * Routes that can be accessed by any one
 */
router.post('/login', login.login);

/*
 * Routes that can be accessed only by authenticated & authorized users
 * the logic of who is authorized &/|| authenticated users are in middleware/authValidate.js
 */
router.get('/api/admin/users', user.getAll);
router.get('/api/admin/user/:id', user.getOne);
router.post('/api/admin/user/', user.create);
router.put('/api/admin/user/:id', user.update);
router.delete('/api/admin/user/:id', user.delete);

// core routes.
router.post('/api/core/create', core.create);
router.post('/api/core/get', core.getData);
router.post('/api/core/sort', core.sort);
router.post('/api/core/filter', core.filter);


/*
 * test routes
 */
var advertiser = require('./advertiser.js');
router.post('/api/admin/addSystem', advertiser.addSystem);
router.post('/api/admin/addAgency', advertiser.addAgency);
router.post('/api/admin/addClient', advertiser.addClient);
router.get('/api/admin/get', advertiser.get);


module.exports = router;