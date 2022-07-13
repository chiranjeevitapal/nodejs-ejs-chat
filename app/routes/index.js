const express = require('express');
const router = express.Router();
const axios = require("axios");

router.get('/', (req, res) => {
    axios.get('https://jsonkeeper.com/b/DYUV')
        .then(function (response) {
            // handle success
            res.render('index', {
                pageTitle: 'Home',
                indexData: response.data,
                pageID: 'home'
            });
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
});

module.exports = router;
