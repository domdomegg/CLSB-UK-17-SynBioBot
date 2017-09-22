const https = require('https');

module.exports = {
    getTeam: function(query) {
        const teamData = require('./teamdata.json');

        let fuseJs = require('fuse.js');
        let team = (new fuseJs(teamData, {
            shouldSort: true,
            threshold: 0.4,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 2,
            keys: ["n"]
        })).search(query)[0];

        if(team) {
            let title = 'Team ' + team.n.replace(/[-_]/g, ' ');

            let speech = title + ' is an iGEM team from ' + team.c;
            speech += (team.t ? ' on the ' + team.t + ' track. ' : '. ');
            speech += (team.s ? 'They have ' + team.s + ' team mebers.' : '');

            let text = '';
            text += (team.n ? 'Name: ' + team.n + '  \n' : '');
            text += (team.c ? 'Country: ' + team.c.replace('the ', '') + '  \n' : '');
            text += (team.t ? 'Track: ' + team.t + '  \n' : '');
            text += (team.s ? '# Members: ' + team.s + '  \n' : '');

            text += '  \nData sourced from iGEM';

            return [[':tellWithCard', speech, title, text]];
        } else {
            return [[':tell', 'Sorry, I couldn\'t find team ' + query]];
        }
    },
    getPart: function(part_id, returnFunc) {
        let url = 'https://parts.igem.org/cgi/xml/part.cgi?part=' + part_id;

        // NB: As https is asynchronous we use returnFunc as a callback to return data
        getData(url, 'xml', function(data) {
            // Check API responded with a part
            if (!data.rsbpml.part_list[0].part) {
                returnFunc([[':tell', 'Sorry, I couldn\'t find that part in the registry.']]);
            } else {
                let part = data.rsbpml.part_list[0].part[0];

                // There's a lot of use of ternary operators to check if a piece of
                // data exists, as data is not guaranteed for every part.
                let title = 'Part ' + part.part_name[0] + (part.part_nickname[0] ? ' (' + part.part_nickname[0] + ')' : '');

                let speech = '';
                speech += 'Part ' + part.part_short_name[0] + ' ';
                speech += (part.part_type[0] ? 'is a ' + part.part_type[0] : '');
                speech += (part.part_results[0] == "Works" ? ' that works' : '');
                speech += (part.part_author[0] ? ', designed by ' + clean(part.part_author[0]) + '.' : '.');

                let text = '';
                text += (part.part_type[0] ? 'Type: ' + part.part_type[0] + '  \n' : '');
                text += (part.part_short_desc[0] ? 'Desc: ' + part.part_short_desc[0] + '  \n' : '');
                text += (part.part_results[0] ? 'Results: ' + part.part_results[0] + '  \n' : '');
                text += (part.release_status[0] ? 'Release status: ' + part.release_status[0] + '  \n' : '');
                text += (part.sample_status[0] ? 'Availability: ' + part.sample_status[0] + '  \n' : '');
                // Tidies the author field; trims excess whitespace and remove fullstop, if present.
                text += (part.part_author[0] ? 'Designed by: ' + clean(part.part_author[0]) + '  \n' : '');
                text += '  \nData provided by the iGEM registry';

                returnFunc([[':tellWithCard', speech, title, text]]);
            }
        });
    },
    getProtocol: function(query, returnFunc) {
        let url = 'https://protocat.org/api/protocol/?format=json';

        // NB: As https is asynchronous we use returnFunc as a callback to return data
        getData(url, 'JSON', function(data) {
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
            let results = (new fuseJs(data, searchOptions)).search(query);

            if (results.length == 0) {
                // No protocols found
                let speech = 'I couldn\'t find any protocols matching your query on Protocat.';
                returnFunc([[':tell', speech]]);
            } else {
                returnFunc(showProtocol(results[0]));
            }
        });
    },
    protocolBegin: function(protocol) {
        if (protocol.protocol_steps) {
			let speech = 'Sure. Beginning the step-by-step instructions for ' + protocol.title + '. ';
			speech += 'To navigate through steps, just say \'next\', \'repeat\', or \'back\'. ';
			speech += (clean(protocol.protocol_steps[0].warning) ? 'Warning for step 1: ' + clean(protocol.protocol_steps[0].warning) + '.  \n  \n' : '');
			speech += 'Step 1: ' + clean(protocol.protocol_steps[0].action) + '. ';
			speech += 'Do you want to go to the next step or repeat this one?';

			let reprompt = 'Do you want to go to the next step or repeat this one?';

			let title = 'Step 1';

			let text = (clean(protocol.protocol_steps[0].warning) ? 'Warning for step 1: ' + clean(protocol.protocol_steps[0].warning) + '. ' : '');
			text += 'Step 1: ' + clean(protocol.protocol_steps[0].action);

			// currentStep is 0 indexed, so steps[currentStep] works
			let protocol_step_state = {
				"steps": protocol.protocol_steps,
				"currentStep": 0,
				"id": protocol.id
			};

			return [[':saveAttribute', 'protocol_step_state', protocol_step_state],
                    [':askWithCard', speech, reprompt, title, text]];
		} else {
			return [[':tell', 'You need to search for a protocol before getting instructions for it.']];
		}
    },
    protocolMove: function(protocol_step_state, stepChange) {
        let newCurrentStep = protocol_step_state.currentStep + stepChange;
        if (newCurrentStep > protocol_step_state.steps.length - 1) {
            // End instructions
            return [[':saveAttribute', 'protocol_step_state', protocol_step_state],
                    [':ask', 'There are no more steps in this guide. Do you want to quit or have me repeat the last step?']];
        } else if (newCurrentStep < 0) {
            // Not allowed to go back
            return [[':saveAttribute', 'protocol_step_state', protocol_step_state],
                    [':ask', 'You can\'t go back further than step 1! Do you want to repeat step 1 or move on to step 2?', 'I didn\'t get that - Should I repeat step 1 or move on to step 2?']];
        } else {
            // Valid move
            protocol_step_state.currentStep = newCurrentStep;
            return showProtocolStep(protocol_step_state);
        }
    }
};

// Gets data from a HTTP(S) source. Currently supports 'JSON' and 'xml' parsing.
function getData(url, parser, callback) {
    https.get(url, (res) => {
        let data = '';
        if (parser == 'xml') {
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
        console.warn('Error getting data: ', err);
        return [[':tell', 'There was an error connecting to the database. Please try again later.']];
    });
}

function showProtocol(protocol) {
    // There's a lot of use of ternary operators to check if a piece of
    // data exists, as data is not guaranteed for every protocol.

    let title = clean(protocol.title);
    let speech = '';
    speech += 'Ok, I\'ve found ' + clean(protocol.title) + '. ';
    speech += (protocol.description ? clean(protocol.description).split('.')[0] + '. ' : '');
    speech += 'Do you want a step-by-step guide or to exit?';

    let reprompt = 'Do you want a step-by-step guide or to exit?';

    let text = '';
    text += (clean(protocol.description) ? 'Description: ' + clean(protocol.description) + '  \n' : '');
    text += (clean(protocol.materials) ? 'Materials: ' + clean(protocol.materials) + '  \n' : '');
    text += (protocol.protocol_steps ? '# Steps: ' + protocol.protocol_steps.length + '  \n' : '');
    text += '  \nData provided by Protocat';

    return [[':saveAttribute', 'protocol', protocol],
            [':askWithCard', speech, reprompt, title, text]];
}

function showProtocolStep(protocol_step_state) {
    let step = protocol_step_state.steps[protocol_step_state.currentStep];

    let title = 'Step ' + step.step_number.toString();

    let speech = title + '. ';
    speech += (clean(step.warning) ? 'Warning: ' + clean(step.warning) + '. ' : '');
    // Regex replaces 'u' used to mean micro with actual micro
    speech += clean(step.action).replace(/([0-9]+)\s*u([lLg])+s*/g, '$1μ$2') + '. ';
    speech += 'Next step or repeat this one?';

    let reprompt = 'Do you want to go to the next step or repeat this one?';

    let text = '';
    text += (clean(step.warning) ? 'Warning: ' + clean(step.warning) + '.  \n  \n' : '');
    text += clean(step.action).replace(/([0-9]+)\s*u([lLg])+s*/g, '$1μ$2');

    return [[':saveAttribute', 'protocol_step_state', protocol_step_state],
            [':askWithCard', speech, reprompt, title, text]];
}

// Removes HTML tags, removes whitespace around string, removes trailing full stop
let clean = (str) => str.replace(/<(?:.|\n)*?>/g, '').trim().replace(/\.$/, "");
