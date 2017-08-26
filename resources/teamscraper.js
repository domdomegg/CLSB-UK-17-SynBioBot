const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

console.log("=== iGEM Team Scraper - " + (new Date()).toDateString() + " ===");
getStartingTeamsJSON();

function getStartingTeamsJSON() {
	fs.readFile(__dirname + '/teams.json', function(err, data) {
		if (err) {
			throw err;
		}
		scrapeTeams(JSON.parse(data.toString()));
	});
}

function scrapeTeams(teams) {
    teams.forEach((team) => {
        let j = request.jar();
        let team_ID = request.cookie('team_ID=' + team.id);
        j.setCookie(team_ID, 'http://igem.org/Team.cgi?team_id=' + team.id);

        request({
            url: 'http://igem.org/Team.cgi?team_id=' + team.id,
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*\/*;q=0.8',
                'Accept-Language': 'en-GB,en;q=0.8'
            }
        }, function (err, httpResponse, body) {
            let $ = cheerio.load(body);
            team.addresses = [];
            $('pre').text().split('\n\n').forEach((address) => {team.addresses.push(address.split('\n')[0].split(',')[0]);});
        });
    });

    saveJSON(teams);
}

function saveJSON(teams) {
    fs.writeFile(__dirname + "/output.json", JSON.stringify(teams, null, 4), 'utf8', function(err) {
        if (err) {
            return console.log(err);
        }

        console.log("Output.json saved");
    });
}
