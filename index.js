var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

var json = [];
var half_ppr_json = [];
var dynastyRankings = [];

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.get('/scrape', function(req, res, next) {

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

// TEST IF THIS IS WORKING && SAFE over app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin,Content-Type, Authorization, x-id, Content-Length, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.get('/rankings', function(req, res, next) {
  var content;
  fs.readFile('./rankings.json', 'utf8', function read(err, data) {
    if (err) { throw err }
    content = JSON.parse(data);
    res.json({
      data: content
    })
  })
})

app.get('/rankings.json', function(req, res) {
  res.json({
    data: json
  })
})

app.get('/hpscrape', function(req, res, next) {
  let url = "https://www.fantasypros.com/nfl/rankings/half-point-ppr-cheatsheets.php";

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

      half_ppr_json.push(playerArr);

      fs.writeFile('./hprankings.json', JSON.stringify(half_ppr_json, null, 4), function(err) {
        console.log('File successfully written!');
      })
    }
    res.send("player data has been scraped!");
  })
})

app.get('/hprankings', function(req, res, next) {
  var content;
  fs.readFile('./hprankings.json', 'utf8', function read(err, data) {
    if (err) { throw err }
    content = JSON.parse(data);
    res.json({
      data: content
    })
  })
})

app.get('/hprankings.json', function(req, res) {
  res.json({
    data: json
  })
})

app.get('/dynastyscrape', function(req, res, next) {
  let url = "https://www.fantasypros.com/nfl/rankings/dynasty-overall.php";

  request(url,function(error, response, html) {
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
          let age = tRow.eq(5).text();
          let bestRank = tRow.eq(6).text();
          let worstRank = tRow.eq(7).text();
          let avgRank = tRow.eq(8).text();
          let stdDev = tRow.eq(9).text();
          let playerObj = {
            playerName,
            teamName,
            position,
            bye,
            age,
            bestRank,
            worstRank,
            avgRank,
            stdDev
          };
          playerArr.push(playerObj)
        }
      })

      dynastyRankings.push(playerArr);

      fs.writeFile('./dynastyRankings.json', JSON.stringify(dynastyRankings, null, 4), function(err) {
        console.log('File successfully written!');
      })
    }
    res.send("player data has been scraped!");
  })
})

app.get('/dynastyrankings', function(req, res, next) {
  var content;
  fs.readFile('./dynastyRankings.json', 'utf8', function read(err, data) {
    if (err) { throw err }
    content = JSON.parse(data);
    res.json({
      data: content
    })
  })
})

app.get('/dynastyRankings.json', function(req, res) {
  res.json({
    data: json
  })
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Listening on port 5000');
})
