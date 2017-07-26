'use strict'

// Set up dependencies
const ApiAiApp = require('actions-on-google').ApiAiApp;
const functions = require('firebase-functions');
const https = require('https');

// Export firebase function
exports.synbiobot = functions.https.onRequest((request, response) => {
	const app = new ApiAiApp({request: request, response: response});

    function getPart (app) {
		let url = 'https://parts.igem.org/cgi/xml/part.cgi?part=' + app.getArgument('iGEMPartName');

        getData(url, 'xml', function (data) {
			let part = data.rsbpml.part_list[0].part[0];

			// There's a lot of use of ternary operators to check if a piece of
			// data exists, as data is not guaranteed for every part.
			let title = 'Part ' + part.part_name[0] + (part.part_nickname[0] ? ' (' + part.part_nickname[0] + ')' : '');

			let speech = '';
			speech += 'Part ' + part.part_short_name[0] + ' ';
			speech += (part.part_type[0] ? 'is a ' + part.part_type[0] : '');
			speech += (part.part_results[0] == "Works" ? ' that works' : '');
			// Tidies the author field; trims excess whitespace and remove fullstop, if present.
			speech += (part.part_author[0] ? ', designed by ' + part.part_author[0].trim().replace(/\.$/, "") + '.' : '.');

			let text = '';
			text += (part.part_type[0] ? '**Type:** ' + part.part_type[0] + '  \n': '');
			text += (part.part_short_desc[0] ? '**Desc:** ' + part.part_short_desc[0] + '  \n': '');
			text += (part.part_results[0] ? '**Results:** ' + part.part_results[0] + '  \n': '');
			text += (part.release_status[0] ? '**Release status:** ' + part.release_status[0] + '  \n': '');
			text += (part.sample_status[0] ? '**Availability:** ' + part.sample_status[0] + '  \n': '');
			// Tidies the author field; trims excess whitespace and remove fullstop, if present.
			text += (part.part_author[0] ? '**Designed by:** ' + part.part_author[0].trim().replace(/\.$/, "") + '  \n': '');
			text += '  \nData provided by the iGEM registry';

			let destinationName = 'iGEM Registry';
			let suggestionUrl = (part.part_url[0] ? part.part_url[0] : 'https://parts.igem.org/Part:' + app.getArgument('iGEMPartName'));
			let suggestions = ['Search for another part', 'Exit'];

			// app.setContext('iGEM_part', 1, part);
			askWithBasicCardAndLinkAndSuggestions(speech, title, text, destinationName, suggestionUrl, suggestions);
        });
    }

	const actionMap = new Map();
	actionMap.set('get_part', getPart);
	app.handleRequest(actionMap);

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
				let parseXml = require('xml2js').parseString;
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
