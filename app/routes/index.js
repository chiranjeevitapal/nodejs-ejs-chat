const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const data = req.app.get('appData');
  let pagePhotos = [];
  const pageSpeakers = data.speakers;

  data.speakers.forEach((item) => {
    pagePhotos = pagePhotos.concat(item.artwork);
  });

  res.render('index', {
    pageTitle: 'Home',
    artwork: pagePhotos,
    speakers: pageSpeakers,
    pageID: 'home'
  });

});

module.exports = router;
