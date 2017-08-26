'use strict';

const Alexa = require('alexa-sdk');
const https = require('https');

const handlers = {
	'LaunchRequest': function() {
		this.emit(':ask', 'Hi, I\'m Synthetic Biology. Would you like to lookup a part or search protocols?', 'Sorry, I didn\'t get that. Do you want to search the iGEM registry for a part or search Protocat for protocols?');
	},
	'SearchPartsRegistry': function() {
		this.emit('GetPart');
	},
	'ProtocolStepNext': function() {
		this.emit('ProtocolStepByStepMove', 1);
	},
	'ProtocolStepRepeat': function() {
		this.emit('ProtocolStepByStepMove', 0);
	},
	'ProtocolStepBack': function() {
		this.emit('ProtocolStepByStepMove', -1);
	},
	'GetPart': function() {
		// Check we have a part ID in slot
		if (!this.event.request.intent.slots.igempartnameslot.value) {
			this.emit(':elicitSlot', 'igempartnameslot', 'Sure. What\'s the part ID?', 'What\'s the iGEM Registry part ID?');
		} else {
			let url = 'https://parts.igem.org/cgi/xml/part.cgi?part=' + this.event.request.intent.slots.igempartnameslot.value.replace(' ', '');
			let self = this;

			getData(url, 'xml', function(data) {
				// Check API responded with a part
				if (!data.rsbpml.part_list[0].part) {
					self.emit(':tell', 'Sorry, I couldn\'t find that part in the registry.');
				} else {
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
					text += (part.part_type[0] ? 'Type: ' + part.part_type[0] + '  \n' : '');
					text += (part.part_short_desc[0] ? 'Desc: ' + part.part_short_desc[0] + '  \n' : '');
					text += (part.part_results[0] ? 'Results: ' + part.part_results[0] + '  \n' : '');
					text += (part.release_status[0] ? 'Release status: ' + part.release_status[0] + '  \n' : '');
					text += (part.sample_status[0] ? 'Availability: ' + part.sample_status[0] + '  \n' : '');
					// Tidies the author field; trims excess whitespace and remove fullstop, if present.
					text += (part.part_author[0] ? 'Designed by: ' + part.part_author[0].clean() + '  \n' : '');
					text += '  \nData provided by the iGEM registry';

					self.emit(':tellWithCard', speech, title, text);
				}
			});
		}
	},
	'ProtocatSearch': function() {
		if (!this.event.request.intent.slots.query.value) {
			this.emit(':ask', 'query', 'Ok. What protocol are you looking for?', 'Sorry, I didn\'t get that. For example you could ask for a ligation protocol. What synthetic biology protocol are you looking for?');
		} else {
			let url = 'https://protocat.org/api/protocol/?format=json';

			let self = this;

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
				let results = (new fuseJs(data, searchOptions)).search(self.event.request.intent.slots.query.value);

				if (results.length == 0) {
					// No protocols found
					let speech = 'I couldn\'t find any protocols matching your query on Protocat.';
					self.emit(':tell', speech);
				} else {
					self.emit('ShowProtocol', results[0]);
				}
			});
		}
	},
	'ShowProtocol': function(protocol) {
		// There's a lot of use of ternary operators to check if a piece of
		// data exists, as data is not guaranteed for every protocol.

		let title = protocol.title;
		let speech = '';
		speech += 'Ok, I\'ve found ' + protocol.title.clean() + '. ';
		speech += (protocol.description ? protocol.description.clean().split('.')[0] + '. ' : '');
		speech += 'Do you want a step-by-step guide or to exit?';

		let reprompt = 'Do you want a step-by-step guide or to exit?';

		let text = '';
		text += (protocol.description.clean() ? 'Description: ' + protocol.description.clean() + '  \n' : '');
		text += (protocol.materials.clean() ? 'Materials: ' + protocol.materials.clean() + '  \n' : '');
		text += (protocol.protocol_steps ? '# Steps: ' + protocol.protocol_steps.length + '  \n' : '');
		text += '  \nData provided by Protocat';

		this.attributes['protocol'] = protocol;
		this.emit(':askWithCard', speech, reprompt, title, text);
	},
	'ProtocolBeginStepByStep': function() {
		let protocol = (this.attributes['protocol'] ? this.attributes['protocol'] : {});
		if (protocol.protocol_steps) {
			let speech = 'Sure. Beginning the step-by-step instructions for ' + protocol.title + '. ';
			speech += 'To navigate through steps, just say \'next\', \'repeat\', or \'back\'. ';
			speech += (protocol.protocol_steps[0].warning.clean() ? 'Warning for step 1: ' + protocol.protocol_steps[0].warning.clean() + '.  \n  \n' : '');
			speech += 'Step 1: ' + protocol.protocol_steps[0].action.clean() + '. ';
			speech += 'Do you want to go to the next step or repeat this one?';

			let reprompt = 'Do you want to go to the next step or repeat this one?';

			let title = 'Step 1';

			let text = (protocol.protocol_steps[0].warning.clean() ? 'Warning for step 1: ' + protocol.protocol_steps[0].warning.clean() + '. ' : '');
			text += 'Step 1: ' + protocol.protocol_steps[0].action.clean();

			// currentStep is 0 indexed, so steps[currentStep] works
			let protocol_step_state = {
				"steps": protocol.protocol_steps,
				"currentStep": 0,
				"id": protocol.id
			};
			this.attributes['protocol_step_state'] = protocol_step_state;

			this.emit(':askWithCard', speech, reprompt, title, text);
		} else {
			this.emit(':tell', 'You need to search for a protocol before getting instructions for it.');
		}
	},
	'ProtocolStepByStepMove': function(stepChange) {
		let protocol_step_state = (this.attributes['protocol_step_state'] ? this.attributes['protocol_step_state'] : {});

		if (typeof protocol_step_state.currentStep == 'number') {
			let newCurrentStep = protocol_step_state.currentStep + stepChange;
			if (newCurrentStep > protocol_step_state.steps.length - 1) {
				// End instructions
				this.attributes['protocol_step_state'] = protocol_step_state;
				this.emit(':ask', 'There are no more steps in this guide. Do you want to quit or have me repeat the last step?');
			} else if (newCurrentStep < 0) {
				// Not allowed to go back
				this.attributes['protocol_step_state'] = protocol_step_state;
				this.emit(':ask', 'You can\'t go back further than step 1! Do you want to repeat step 1 or move on to step 2?', 'I didn\'t get that - Should I repeat step 1 or move on to step 2?');
			} else {
				// Valid move
				protocol_step_state.currentStep = newCurrentStep;
				this.emit('ProtocolStepByStepShow', protocol_step_state);
			}
		} else {
			if (this.attributes['protocol'] ? this.attributes['protocol'] : false) {
				this.emit('ProtocolBeginStepByStep');
			} else {
				this.emit(':tell', 'You need to search for a protocol before getting instructions for it.');
			}
		}
	},
	'ProtocolStepByStepShow': function(protocol_step_state) {
		let step = protocol_step_state.steps[protocol_step_state.currentStep];

		let title = 'Step ' + step.step_number.toString();

		let speech = title + '. ';
		speech += (step.warning.clean() ? 'Warning: ' + step.warning.clean() + '. ' : '');
		// Regex replaces 'u' used to mean micro with actual micro
		speech += step.action.clean().replace(/([0-9]+)\s*u([lLg])+s*/g, '$1μ$2') + '. ';
		speech += 'Next step or repeat this one?';

		let reprompt = 'Do you want to go to the next step or repeat this one?';

		let text = '';
		text += (step.warning.clean() ? 'Warning: ' + step.warning.clean() + '.  \n  \n' : '');
		text += step.action.clean().replace(/([0-9]+)\s*u([lLg])+s*/g, '$1μ$2');

		this.attributes['protocol_step_state'] = protocol_step_state;
		this.emit(':askWithCard', speech, reprompt, title, text);
	},
	'AMAZON.HelpIntent': function() {
		this.emit('LaunchRequest');
	},
	'AMAZON.CancelIntent': function() {
		this.emit(':tell', 'Ok, Bye!');
	},
	'AMAZON.StopIntent': function() {
		this.emit(':tell', 'Ok, Bye!');
	},
	'SessionEndedRequest': function() {
		this.emit(':saveState', true);
	},
	'Unhandled': function() {
		this.emit(':ask', 'Sorry, I didn\'t get that. Please can you repeat it?', 'Sorry, what was that?');
	}
};

// Gets data from a HTTP(S) source. Currently supports 'JSON' and 'xml' parsing.
function getData(url, parser, callback) {
	let requester = https;
	if (url.indexOf('http://') > -1) {
		requester = require('http');
	}
	requester.get(url, (res) => {
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
				parseXml(data, function(err, result) {
					callback(result);
				});
			} else {
				throw new Error('Unknown parser type');
			}
		});
	}).on('error', (err) => {
		console.log('Error getting data: ', err);
		this.emit(':tell', 'There was an error connecting to the database. Please try again later.');
	});
}

// Removes HTML tags, removes whitespace around string, removes trailing full stop
String.prototype.clean = function() {
	return this.replace(/<(?:.|\n)*?>/g, '').trim().replace(/\.$/, "");
};

exports.handler = function(event, context) {
	const alexa = Alexa.handler(event, context);
	alexa.appId = process.env.APP_ID;
	alexa.registerHandlers(handlers);
	alexa.execute();
};
