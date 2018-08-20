var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.get('/scrape', ((req, res) => {

  let url = 'https://www.fantasypros.com/nfl/rankings/ppr-cheatsheets.php';

  request(url, function(error, response, html) {
    if (!error) {
      console.log("no error so far");
      let $ = cheerio.load(html);
      let playerNames = [];

      $('tbody').children('.player-row').each(function(i, elem) {
        // console.log("elements in player row...", elem);
        // console.log("element", elem);
        if (elem.name === 'tr') {
          let tRow = $(this).children();
          let name = tRow.eq(2).children().children().eq(0).text();
          let position = tRow.eq(3).text();
          let bye = tRow.eq(4).text();
          let bestRank = tRow.eq(5).text();
          let worstRank = tRow.eq(6).text();
          let avgRank = tRow.eq(7).text();
          let adp = tRow.eq(9).text();

          console.log("-----Player-----");
          console.log("name: ", name)
          console.log("position: ", position);
          console.log("bye: ", bye);
          console.log("ranks...... ");
          console.log(" best: " + bestRank );
          console.log(" worst: " + worstRank );
          console.log(" avg: " + avgRank );
          console.log("ADP: ", adp);
        }
      })
    }
  })


}))

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Listening on port 5000');
})
