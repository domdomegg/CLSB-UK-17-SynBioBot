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
			speech += (part.part_author[0] ? ', designed by ' + part.part_author[0].clean() + '.' : '.');

			let text = '';
			text += (part.part_type[0] ? '**Type:** ' + part.part_type[0] + '  \n': '');
			text += (part.part_short_desc[0] ? '**Desc:** ' + part.part_short_desc[0] + '  \n': '');
			text += (part.part_results[0] ? '**Results:** ' + part.part_results[0] + '  \n': '');
			text += (part.release_status[0] ? '**Release status:** ' + part.release_status[0] + '  \n': '');
			text += (part.sample_status[0] ? '**Availability:** ' + part.sample_status[0] + '  \n': '');
			// Tidies the author field; trims excess whitespace and remove fullstop, if present.
			text += (part.part_author[0] ? '**Designed by:** ' + part.part_author[0].clean() + '  \n': '');
			text += '  \nData provided by the iGEM registry';

			let destinationName = 'iGEM Registry';
			let suggestionUrl = (part.part_url[0] ? part.part_url[0] : 'https://parts.igem.org/Part:' + app.getArgument('iGEMPartName'));
			let suggestions = ['Search for another part', 'Exit'];

			// app.setContext('iGEM_part', 1, part);
			askWithBasicCardAndLinkAndSuggestions(speech, title, text, destinationName, suggestionUrl, suggestions);
        });
    }

	function protocatSearch (app) {
		// TODO: Use HTTPS
		// https://github.com/MiBioSoft2017/ProtoCat4/issues/17
		let url = 'http://protocat.org/api/protocol/?format=json';

		getData(url, 'JSON', (data) => {
			// Use fuse.js to fuzzy-search through protcols by title
			// Uses var to load globally
			var fuseJs = require('fuse.js');
			let searchOptions = {
			  shouldSort: true,
			  threshold: 0.4,
			  location: 0,
			  distance: 100,
			  maxPatternLength: 32,
			  minMatchCharLength: 2,
			  keys: ["title"]
			};
			let results = (new fuseJs(data, searchOptions)).search(app.getRawInput());

			if (results.length == 0) {
				// No protocols found
				speech = 'I couldn\'t find any protocols about ' + app.getRawInput() + ' on Protocat. What would you like me to do instead?';
				suggestions = ['Search Protocat again', 'Find an iGEM Part', 'Go away'];
				askWithSimpleResponseAndSuggestions(speech, suggestions)
			} else if (results.length == 1) {
				// One protocol found
				showProtocol(results[0]);
			} else {
				// Multiple protocols found
				// Shows up to 10 results in a list
				let listOptions = [];
				for(let i = 0; (i < 10 && i < results.length); i++) {
					listOptions.push({
						selectionKey: results[i].id.toString(),
						title: results[i].title,
						description: results[i].description.clean().split('.')[0],
						synonyms: [results[i].title.split(/\s+/)[0], results[i].title.split(/\s+/).slice(0,2).join(' ')]
					});
				}

				let speech = 'Which of these looks right?';

				if (!app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
					speech = 'Which of these sounds right? ';
					listOptions.forEach(function (option) {
						speech += option.title + '. ';
					});
				}

				askWithList(speech, 'Protocat results', listOptions);
			};
		});
	}

	function protocatListSelect (app) {
		// TODO: Use HTTPS
		// https://github.com/MiBioSoft2017/ProtoCat4/issues/17
		let url = 'http://protocat.org/api/protocol/' + app.getSelectedOption() + '/?format=json';

		getData(url, 'JSON', (data) => {
			// Check we actually got a protocol, and the right protocol
			if(data && data.title && data.id == app.getSelectedOption()) {
				showProtocol(data);
			} else {
				let speech = 'Sorry, I couldn\'t open that protocol. What should I do instead?';
				let suggestions = ['Search Protocat again', 'Find an iGEM Part', 'Go away'];
				askWithSimpleResponseAndSuggestions(speech, suggestions);
			}
		});
	}

	// Protocol must be in Protocat format
	function showProtocol (protocol) {
		// There's a lot of use of ternary operators to check if a piece of
		// data exists, as data is not guaranteed for every protocol.

		let title = protocol.title;
		let speech = '';
		speech += (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT) ? 'Here\'s the protocol you asked for. ' : 'Ok, I\'ve opened ' + protocol.title.clean() + '. ');
		speech += (protocol.description ? protocol.description.clean().split('.')[0] + '. ' : '');
		speech += 'Do you want a step-by-step guide, to search Protocat again or exit?'

		let text = '';
		text += (protocol.description.clean() ? '**Description:** ' + protocol.description.clean() + '  \n' : '');
		text += (protocol.materials.clean() ? '**Materials:** ' + protocol.materials.clean() + '  \n': '');
		text += (protocol.protocol_steps ? '**# Steps:** ' + protocol.protocol_steps.length + '  \n': '');
		text += '  \nData provided by Protocat';

		let destinationName = 'View on Protocat';
		// TODO: Use HTTPS
		let suggestionUrl = 'http://protocat.org/protocol/' + protocol.id.toString() + '/';
		let suggestions = ['Step-by-step guide', 'Search Protocat again', 'Exit'];

		app.setContext('protocol', 1, protocol);
		askWithBasicCardAndLinkAndSuggestions(speech, title, text, destinationName, suggestionUrl, suggestions);
	}

	function protocolStepByStepBegin (app) {
		let protocol = (app.getContext('protocol') ? app.getContext('protocol').parameters : {});
		if (protocol.protocol_steps) {
			let speech = 'Sure. Beginning the step-by-step instructions for ' + protocol.title + '. ';
			speech += 'To navigate through steps, just say \'next\', \'repeat\', or \'back\'. ';
			speech += (protocol.protocol_steps[0].warning.clean() ? 'Warning for step 1: ' + protocol.protocol_steps[0].warning.clean() + '.  \n  \n' : '');
			speech += 'Step 1: ' + protocol.protocol_steps[0].action.clean();

			let title = 'Step 1';

			let text = (protocol.protocol_steps[0].warning.clean() ? '**Warning for step 1:** ' + protocol.protocol_steps[0].warning.clean() + '. ' : '');
			text += 'Step 1: ' + protocol.protocol_steps[0].action.clean();

			let destinationName = 'View on Protocat';
			// TODO: Use HTTPS
			let suggestionUrl = 'http://protocat.org/protocol/' + protocol.id.toString() + '/';

			let suggestions = ['Next', 'Repeat'];

			// currentStep is 0 indexed, so steps[currentStep] works
			let protocol_step_state = {
				"steps": protocol.protocol_steps,
				"currentStep": 0,
				"id": protocol.id
			};
			app.setContext('protocol_step_state', 1, protocol_step_state);

			askWithBasicCardAndLinkAndSuggestions(speech, title, text, destinationName, suggestionUrl, suggestions);
		} else {
			askWithSimpleResponseAndSuggestions('You need to search for a protocol before getting instructions for it. What do you want to do now?', ['Search Protocat', 'Exit']);
		}
	}

	function protocolStepByStepMove (stepChange) {
		let protocol_step_state = (app.getContext('protocol_step_state') ? app.getContext('protocol_step_state').parameters : {});

		if (typeof protocol_step_state.currentStep == 'number') {
			let newCurrentStep = protocol_step_state.currentStep + stepChange;
			if (newCurrentStep > protocol_step_state.steps.length - 1) {
				// End instructions
				app.setContext('protocol_step_state', 1, protocol_step_state);
				askWithSimpleResponseAndSuggestions('There are no more steps in this guide. Do you want me to exit or repeat the last step?', ['Exit', 'Repeat', 'Search Protocat again', 'Search iGEM Registry']);
			} else if (newCurrentStep < 0) {
				// Not allowed to go back
				app.setContext('protocol_step_state', 1, protocol_step_state);
				askWithSimpleResponseAndSuggestions('You can\'t go back further than step 1! Would you like me to repeat step 1 or move on to step 2?', ['Repeat step 1', 'Move on to step 2']);
			} else {
				// Valid move
				protocol_step_state.currentStep = newCurrentStep;
				protocolStepByStepShow(protocol_step_state);
			}
		} else {
			if(app.getContext('protocol') ? app.getContext('protocol').parameters : false) {
				protocolStepByStepBegin(app);
			} else {
				askWithSimpleResponseAndSuggestions('You need to search for a protocol before getting instructions for it. What do you want to do now?', ['Search Protocat', 'Exit']);
			}
		}
	}

	function protocolStepByStepShow (protocol_step_state) {
		let step = protocol_step_state.steps[protocol_step_state.currentStep];

		let title = 'Step ' + step.step_number.toString();

		let speech = title + '. ';
		speech += (step.warning.clean() ? 'Warning: ' + step.warning.clean() + '. ' : '');
		// Regex replaces 'u' used to mean micro with actual micro
		speech += step.action.clean().replace(/([0-9]+)\s*u([lLg])+s*/g, '$1μ$2') + '. ';

		let nextStepPhrases = [
			'Want the next step now?',
			'Ready for the next step?',
			'Should I get the next step?',
			'Are you ready for the next step?',
			'Do you want the next step?',
			'Ready to go ahead?'
		];

		speech = '<speak><sub alias="' + speech + '">Sure. Here\'s that step. </sub>' + randomFromArray(nextStepPhrases) + '</speak>';

		let text = '';
		text += (step.warning.clean() ? '**Warning:** ' + step.warning.clean() + '.  \n  \n' : '');
		text += step.action.clean().replace(/([0-9]+)\s*u([lLg])+s*/g, '$1μ$2');

		let destinationName = 'View on Protocat';
		// TODO: Use HTTPS
		let suggestionUrl = 'http://protocat.org/protocol/' + protocol_step_state.id + '/#step' + step.step_number.toString();

		let suggestions = ['Next', 'Repeat', 'Back'];

		app.setContext('protocol_step_state', 1, protocol_step_state);
		askWithBasicCardAndLinkAndSuggestions(speech, title, text, destinationName, suggestionUrl, suggestions);
	}

	const actionMap = new Map();
	actionMap.set('get_part', getPart);
	actionMap.set('protocat_search', protocatSearch);
	actionMap.set('protocat_list_select', protocatListSelect);

	actionMap.set('protocol_step_by_step_begin', protocolStepByStepBegin);
	actionMap.set('protocol_step_by_step_next', (app) => { protocolStepByStepMove(1); });
	actionMap.set('protocol_step_by_step_repeat', (app) => { protocolStepByStepMove(0); });
	actionMap.set('protocol_step_by_step_back', (app) => { protocolStepByStepMove(-1); });
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

	// Gets data from a HTTP(S) source. Currently supports 'JSON' and 'xml' parsing.
	function getData(url, parser, callback) {
		let requester = https;
		if (url.indexOf('http://') > -1) {
			requester = require('http');
		}
	    let req = requester.get(url, (res) => {
	        let data = '';
			if (parser == 'xml') {
				// If we know it's xml, we can load the library in advance for a
				// minor performance improvement. Uses var so it's defined globally
				var parseXml = require('xml2js').parseString;
			}

	        res.on('data', (chunk) => {
	            data += chunk;
	        });

	        res.on('end', () => {
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
	    }).on('error', (err) => {
			console.log('Error getting data: ', err)
			askWithSimpleResponseAndSuggestions('There was an error connecting to the database. Please try again later. What would you like to do instead?', ['Search Parts Registry', 'Search Protocat', 'Exit'])
		});
	}
});

// Removes HTML tags, removes whitespace around string, removes trailing full stop
String.prototype.clean = function(){
	return this.replace(/<(?:.|\n)*?>/g, '').trim().replace(/\.$/, "");
};

// Useful for varying responses a bit
function randomFromArray(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}
