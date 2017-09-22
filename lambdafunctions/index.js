'use strict';

const Alexa = require('alexa-sdk');
const shared = require('./shared.js');

const handlers = {
	// Search offline team database (teamdata.json)
	'SearchTeams': function() {
		// Check user has given a team name
		!this.event.request.intent.slots.igemteamnameslot.value ?
			this.emit(':elicitSlot', 'igemteamnameslot', 'Sure. What\'s the team name?', 'What\'s the iGEM team name, exactly as it appears on the team list?') :
			interpretActions(this, shared.getTeam(this.event.request.intent.slots.igemteamnameslot.value));
	},

	// Search online iGEM parts registry
	'SearchPartsRegistry': function() {
		// Check user has given a part ID
		!this.event.request.intent.slots.igempartnameslot.value ?
			this.emit(':elicitSlot', 'igempartnameslot', 'Sure. What\'s the part ID?', 'What\'s the iGEM Registry part ID?') :
			shared.getPart(this.event.request.intent.slots.igempartnameslot.value.replace(' ', ''), (returnValue) => interpretActions(this, returnValue));
	},

	// Protocol intents with checks for slots and attributes etc.
	'ProtocatSearch': function() {
		// Check user has given a protocol name
		!this.event.request.intent.slots.query.value ?
			this.emit(':elicitSlot', 'query', 'Ok. What protocol are you looking for?', 'Sorry, I didn\'t get that. For example you could ask for a ligation protocol. What synthetic biology protocol are you looking for?') :
			shared.getProtocol(this.event.request.intent.slots.query.value, (returnValue) => interpretActions(this, returnValue));
	},

	'ProtocolStepByStepMove': function(stepChange) {
		let protocol_step_state = this.attributes['protocol_step_state'] || {};

		if (typeof protocol_step_state.currentStep == 'number') {
			interpretActions(this, shared.protocolMove(protocol_step_state, stepChange));
		} else {
			typeof this.attributes['protocol'] !== 'undefined' ?
				this.emit('ProtocolBeginStepByStep') :
				this.emit(':tell', 'You need to search for a protocol before getting instructions for it.');
		}
	},

	// Step-by-step protocol moves
	'ProtocolStepNext': function() { this.emit('ProtocolStepByStepMove', 1); },
	'ProtocolStepBack': function() { this.emit('ProtocolStepByStepMove', -1);},
	'ProtocolStepRepeat':function(){ this.emit('ProtocolStepByStepMove', 0); },

	'ProtocolBeginStepByStep': function() { interpretActions(this, shared.protocolBegin(this.attributes['protocol'] || {})); },

	// Handling default AMAZON intents
	'LaunchRequest': function() { this.emit(':ask', 'Hi, I\'m Synthetic Biology. Would you like to lookup a part or search protocols?', 'Sorry, I didn\'t get that. Do you want to search the iGEM registry for a part or search Protocat for protocols?'); },
	'AMAZON.HelpIntent': function() { this.emit('LaunchRequest'); },

	'AMAZON.StopIntent': function() { this.emit(':tell', 'Ok, Bye!'); },
	'AMAZON.CancelIntent': function() { this.emit('AMAZON.StopIntent'); },

	'Unhandled': function() { this.emit(':ask', 'Sorry, I didn\'t get that. Please can you repeat it?', 'Sorry, what was that?'); }
};

const interpretActions = (self, actions) => {
	actions.forEach((action) => {
		action[0] == ':saveAttribute' ?
			self.attributes[action[1]] = action[2] :
			self.emit.apply(self, action);
	});
};

exports.handler = function(event, context) {
	const alexa = Alexa.handler(event, context);
	alexa.appId = process.env.APP_ID;
	alexa.registerHandlers(handlers);
	alexa.execute();
};
