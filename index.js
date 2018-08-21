var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

var json = [];

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.get('/scrape', function(req, res) {

  let url = 'https://www.fantasypros.com/nfl/rankings/ppr-cheatsheets.php';
  request(url, function(error, response, html) {
    if (!error) {
      console.log("no errors...");
      let $ = cheerio.load(html);
      let playerArr = [];

      $('tbody').children('.player-row').each(function(i, elem) {
        if (elem.name === 'tr') {
          let tRow = $(this).children();
          let playerName = tRow.eq(2).children().children().eq(0).text();
          let teamName = tRow.eq(2).children().eq(1).text();
          let position = tRow.eq(3).text().replace(/\d/g,'');
          let bye = tRow.eq(4).text();
          let bestRank = tRow.eq(5).text();
          let worstRank = tRow.eq(6).text();
          let avgRank = tRow.eq(7).text();
          let adp = tRow.eq(9).text();
          let playerObj = {
            playerName,
            teamName,
            position,
            bye,
            bestRank,
            worstRank,
            avgRank,
            adp
          };
          playerArr.push(playerObj)
        }
      })

      json.push(playerArr);

      fs.writeFile('rankings.json', JSON.stringify(json, null, 4), function(err) {
        console.log('File successfully written!');
      })
    }
    res.send("player data has been scraped!");
  })
})

app.get('/rankings', (req, res) => {
  var content;
  fs.readFile('./rankings.json', 'utf8', function read(err, data) {
    if (err) { throw err }
    content = JSON.parse(data);
    res.json({
      data: content
    })
  })
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Listening on port 5000');
})
