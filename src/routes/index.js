const express = require('express');
const router = express.Router();

const indexController = require("../controllers/indexController");

/* GET home page. */
router.get('/', indexController.home);

/* GET detail page */
router.get('/detail', indexController.detail);

/* POST /biy */
router.post('/buy', indexController.buy);

/* GET callback_urls */
router.get('/callback', indexController.callback);

/* POST notification_url */
router.post('/notifications', indexController.notifications);

module.exports = router;
