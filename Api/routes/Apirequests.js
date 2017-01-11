var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/fetchmovie', function (req, res) {

  console.log("route hämtad");
    var url = 'http://www.omdbapi.com/?s=';

    request(url + req.query.q, function (err, response, data) {

              console.log(url+req.query.q);
            if(err){
              console.log(err);
            }else{
              console.log(data);
              try{
                 var datares = JSON.parse(data);
              }catch(err){
                console.log(err);
              }
            }
            res.send(data);
    });

});

module.exports = router;
