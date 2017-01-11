/**
 * Created by Johan on 2016-11-24.
 */

"use strict"


var destination = document.getElementById("divForm");

var id = 0;

var FetchMovie = React.createClass({

    getInitialState: function () {
        return {
            movies: []
        };
    },

    handleSearch: function (e) {
        e.preventDefault();
        var omdbURL = "/fetchmovie";
        var input = document.getElementById("searchfield").value;
        var form = document.getElementById("Form");

        var re = /^[A-Za-z0-9_ ]+$/;

        if (!re.test(input) || input == "") {
            alert("Please search by string.");
            form.reset();

        } else if (input.length < 2) {
            alert("Please provide more than one character.");
            form.reset();
        } else {

            fetch(omdbURL + '?q=' + input, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                return response.json();
            }).then((result) => {

                if (result.error) {
                    alert(result.error);
                } else {

                    var movie = [];

                    for (var i = 0; i < result.length; i++) {

                        movie.push({
                            key: id++,
                            Title: result[i].Title,
                            Year: result[i].Year,
                            Plot: result[i].Plot,
                            Poster: result[i].Poster,
                            Trailer: result[i].Trailer,
                            Runtime: result[i].Runtime,
                            Director: result[i].Director
                        });
                    }

                    this.setState({
                        movies: movie
                    });
                }
            }).catch(function (err) {
                console.log('Error: ', err);
            });
            input = "";
            form.reset();
        }

    },

    render: function () {
        return (
            <div className="MainDiv">
                <form id="Form">

                    <input id="searchfield" type="text" placeholder="Title" name="movietitle" autoFocus/>
                    <button id="submitform" onClick={this.handleSearch}>Search Movie</button>

                </form>

                <ListMovie movies={this.state.movies}/>

            </div>
        );
    }
});


var ListMovie = React.createClass({


    render: function () {
        var movies = this.props.movies.map(function (objects) {

            if (objects.Trailer != undefined && objects.Poster != undefined) {

                if (objects.Plot != undefined) {

                    if (objects.Runtime != undefined && objects.Director) {
                        return (
                            <div id="MovieDiv" key={objects.key}>
                                <h2>{objects.Title}</h2>
                                <p>{objects.Year}</p>
                                <img height="200" width="200" src={objects.Poster}/>
                                <p>Runtime: {objects.Runtime}</p>
                                <p>Director: {objects.Director}</p>
                                <p>{objects.Plot}</p>
                                <iframe width="300" height="200" src={'//www.youtube.com/embed/' + objects.Trailer}/>
                            </div>
                        );
                    }
                } else if (objects.Runtime != undefined && objects.Director != undefined) {
                    return (
                        <div id="MovieDiv" key={objects.key}>
                            <h2>{objects.Title}</h2>
                            <p>{objects.Year}</p>
                            <p>Runtime: {objects.Runtime}</p>
                            <p>Director: {objects.Director}</p>
                            <p>{objects.Plot}</p>
                        </div>
                    );
                } else {
                    return (
                        <div id="MovieDiv" key={objects.key}>
                            <h2>{objects.Title}</h2>
                            <p>{objects.Year}</p>
                        </div>
                    );
                }

            } else if (objects.Plot != undefined) {

                if (objects.Runtime != undefined && objects.Director != undefined) {
                    return (
                        <div id="MovieDiv" key={objects.key}>
                            <h2>{objects.Title}</h2>
                            <p>{objects.Year}</p>
                            <p>Runtime: {objects.Runtime}</p>
                            <p>Director: {objects.Director}</p>
                            <p>{objects.Plot}</p>
                        </div>
                    );
                } else {
                    return (
                        <div id="MovieDiv" key={objects.key}>
                            <h2>{objects.Title}</h2>
                            <p>{objects.Year}</p>
                        </div>
                    );
                }

            }

        }.bind(this));

        return <div>{movies}</div>
    }

});

ReactDOM.render(
    <FetchMovie/>, destination
);
