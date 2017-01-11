var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var rp = require('request-promise');
var YouTube = require('youtube-node');


router.get('/', function (req, res) {
    res.render('home.html');
});

router.get('/searchmovie', function (req, res) {
    res.render('searchmovie.html');
});


router.get('/fetchmovie', function (req, res) {

    var frontObj = [];

    var Omdbrequest = [{
        url: 'http://www.omdbapi.com/?t=' + req.query.q + '&type=movie&plot=short'
    }];

    Promise.map(Omdbrequest, function (obj) {
        return rp(obj).then(function (data) {
            return JSON.parse(data);
        });
    }).then(function (results) {


        for (var i = 0; i < results.length; i++) {
            if (results[i].Response == "False") {
                console.log("Omdb response false");
                res.send({error: 'Movie does not exist'});
            } else {

                if (results[i].Poster != "N/A" && results[i].Plot != "N/A") {
                    if (results[i].Runtime != "N/A" && results[i].Director != "N/A") {
                        var movie = {
                            Title: results[i].Title,
                            Year: results[i].Year,
                            Poster: results[i].Poster,
                            Plot: results[i].Plot,
                            Runtime: results[i].Runtime,
                            Director: results[i].Director,
                        }
                    } else {
                        var movie = {
                            Title: results[i].Title,
                            Year: results[i].Year,
                            Poster: results[i].Poster,
                            Plot: results[i].Plot
                        }
                    }
                } else {
                    var movie = {
                        Title: results[i].Title,
                        Year: results[i].Year
                    }
                }

                frontObj.push(movie);
            }


        }

    }).then(function () {

        var youTube = new YouTube();

        youTube.setKey('AIzaSyB5N54g7mb1Z60qCTMpBhXUVLsj-dw1JQ8');

        var searchquery = req.query.q + 'Official Trailer';

        if (res.headersSent == true) {
            console.log('Headers has been sent!');
        } else {
            youTube.search(searchquery, 5, function (error, result) {
                if (error) {
                    console.log(new Error(error));
                }
                else {
                    finalMerge(result.items);
                }
            });
        }
        function finalMerge(data) {


            for (var i = 0; i < frontObj.length; i++) {
                for (var j = 0; j < data.length; j++) {
                    var title = data[j].snippet.title;
                    var description = data[j].snippet.description;
                    if (title.includes(req.query.q) || description.includes(searchquery)) {
                        frontObj[i]['Trailer'] = data[j].id.videoId;
                    }
                }
            }
            res.send(frontObj);
        }

    }), function (error) {
        console.log(error);
    };

});

module.exports = router;
