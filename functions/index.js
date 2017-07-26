'use strict'

// Set up dependencies
const ApiAiApp = require('actions-on-google').ApiAiApp;
const functions = require('firebase-functions');
const parseXml = require('xml2js').parseString;
const https = require('https');

// Export firebase function
exports.synbiobot = functions.https.onRequest((request, response) => {
	const app = new ApiAiApp({request: request, response: response});

	// All these helper methods pretty much do what they say on the tin,
	// just make it easier to create responses

	function askWithSimpleResponseAndSuggestions(speech, suggestions) {
        app.ask(app.buildRichResponse()
            .addSimpleResponse(speech)
			.addSuggestions(suggestions)
        );
    }

	function askWithLinkAndSuggestions(speech, destinationName, suggestionUrl, suggestions) {
        app.ask(app.buildRichResponse()
            .addSimpleResponse(speech)
            .addSuggestionLink(destinationName, suggestionUrl)
			.addSuggestions(suggestions)
        );
    }

    function askWithList(speech, title, options) {
        let optionItems = [];
        options.forEach(function (option) {
            optionItems.push(app.buildOptionItem(option.selectionKey, option.synonyms).setTitle(option.title).setDescription(option.description));
        });

        app.askWithList(speech, app.buildList(title).addItems(optionItems));
    }

	function askWithBasicCardAndLinkAndSuggestions(speech, title, text, destinationName, suggestionUrl, suggestions) {
		app.ask(app.buildRichResponse()
			.addSimpleResponse(speech)
			.addBasicCard(app.buildBasicCard(text)
				.setTitle(title)
				.addButton(destinationName, suggestionUrl)
			)
			.addSuggestions(suggestions)
		);
	}
});

// Gets data from a HTTPS source. Currently supports 'JSON' and 'xml' parsing.
function getData(url, parser, callback) {
    let req = https.get(url, function(res) {
        let data = '';

        res.on('data', function(chunk) {
            data += chunk;
        });

        res.on('end', function() {
			if (parser == 'JSON') {
				callback(JSON.parse(data));
			} else if (parser == 'xml') {
				parseXml(data, function (err, result) {
	                callback(result);
	            });
			} else {
				throw new Error('Unknown parser type');
			}
        });
    });
}

// Useful for varying responses a bit
function randomFromArray(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}
