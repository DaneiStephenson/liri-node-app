//// NDM Requires /////
var Twitter = require('twitter');
var request = require('request');
var spotify = require('spotify');
var fs = require('fs');

///// Variables for liri commands /////
// Grab user's command: "node liri.js command"
var command = process.argv[2];
// Grab user's input after command: "node liri.js command input"
var input = "";
// For loop will grab multiple words for user input
for (var i = 3; i < process.argv.length; i++) {
	// Sets input = each word and adds a space
	input += process.argv[i] + " ";
}

///// Liri Commands /////
// If user types 'my-tweets', display tweets
if (command === 'my-tweets') {
	tweets();
}
// If user types 'spotify-this-song'
else if (command === 'spotify-this-song' && input) {
	spotifySong(input);
}
else if (command === 'spotify-this-song' && input === "") {
	spotifySong('ace of base - the sign');
}
// If user types 'movie-this', does an omdbapi call
// If user types a movie name, it will display that specific movie
else if (command === 'movie-this' && input) {
	omdbapi(input);
}
// If user doesn't type a movie name, it will display the movie mr nobody
else if (command === 'movie-this' && input === "") {
	omdbapi('mr+nobody');
}
// If user types 'do-what-it-says'
else if (command === 'do-what-it-says') {
	fs.readFile('random.txt', 'utf8', function (err,data) {
	var start;
	var txtinput;
	if (err) {
		return console.log(err);
	}
	else {
		var dataarray = data.split('\r\n');
		// console.log(dataarray);
		var rng = dataarray[Math.floor(Math.random() * (dataarray.length))]
		console.log(rng);
		if (rng.includes('spotify-this-song')) {
			start = 'spotify-this-song'.length +1;
			txtinput = "";
			for (var i = start; i < rng.length; i++) {
				txtinput += rng[i];
			}
			spotifySong(txtinput);
		}
		else if (rng.includes('my-tweets')) {
			tweets();
		}
		else if (rng.includes('movie-this')) {
			start = 'movie-this'.length +1;
			txtinput = "";
			for (var i = start; i < rng.length; i++) {
				txtinput += rng[i];
			}
			omdbapi(txtinput);
		}
	}
});
}
// If no recognized command is type
else {
	console.log('No recognized command, please try again.');
	console.log('You can try:');
	console.log('node liri.js my-tweets');
	console.log('node liri.js spotify-this-song');
	console.log('node liri.js spotify-this-song \'artist\' or \'song\' or \'album\' or \'artist - song title\'');
	console.log('node liri.js movie-this');
	console.log('node liri.js movie-this \'movie title\'');
	console.log('node liri.js do-what-it-says');
}

// Function for twitter tweets
function tweets() {
	// Twitter keys; Only grabs twitter key if my-tweets is ran
	var twitterjs = require('./keys.js');
	// Twitter NDM
	var twitterclient = new Twitter({
	  consumer_key: twitterjs.twitterKeys.consumer_key,
	  consumer_secret: twitterjs.twitterKeys.consumer_secret,
	  access_token_key: twitterjs.twitterKeys.access_token_key,
	  access_token_secret: twitterjs.twitterKeys.access_token_secret,
	});

	var params = {screen_name: 'Test_CodingCamp'};
	twitterclient.get('statuses/user_timeline', params, function(error, tweets, response) {
		// If there is no error go through tweets array and return all tweets in text form (limited to 20)
	 	if (!error) {
		  	for (var i = 0; i < tweets.length; i++) {
		  		console.log(tweets[i].text);
			}
	 	}
	 	// Else, error occurred: console log error
	 	else {
	 		console.log(error);
	 	}
	});
}

// Function for omdbapi call
function omdbapi(title) {
	var url = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&r=json&tomatoes=true";
	request(url, function (error, response, body) {
		// If no error run code in if {}
		if (!error && response.statusCode == 200) {
			// Checks if the movie exists; if so then displays movie info
			if (JSON.parse(body).Title != undefined && JSON.parse(body).Year != undefined) {
				console.log("Title: " + JSON.parse(body).Title);
				console.log("Year: " + JSON.parse(body).Year);
				console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
				console.log("Country: " + JSON.parse(body).Country);
				console.log("Plot: " + JSON.parse(body).Plot);
				console.log("Actors: " + JSON.parse(body).Actors);
				console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
				console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
			}
			// If movie doesn't exist then notifies user
			else {
				console.log('No movie found. Please try again');
			}
		}
		// If error occurrs, console.log the error
		else {
			console.log(error);
		}
	});
}

function spotifySong(song) {
	console.log(song);
	spotify.search({ type: 'track', query: song }, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    }
	 	else {
	 		// console.log(JSON.stringify(data, null, 2));
	 		// console.log(data.tracks.items[0]);
	 		for (var i = 0; i < data.tracks.items.length; i++) {
	 			for (var j = 0; j < data.tracks.items[i].artists.length; j++) {
	 				console.log('Artist(s): ' + data.tracks.items[i].artists[j].name);
	 			}
		 		console.log('Track name: ' + data.tracks.items[i].name);
		 		console.log('Preview: ' + data.tracks.items[i].preview_url);
		 		console.log('Album: ' + data.tracks.items[i].album.name);
		 		console.log('');
	 		}
		 		
	 	}
	});
}