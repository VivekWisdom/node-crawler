var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var app = express();

app.get('/crawl', function(req, res) {
    //All the crawl code comes here.
    url = "https://futurism.com/";

    request(url, function(error, response, html) {
        var json = {};
        if (!error) {
            var $ = cheerio.load(html);
            var postTitle,postUrl, postCategory;
            
            var finalPosts = [];
            $('.daily .container .post-details').each(function(index, elem){
                var data = $(this);
                json = {
                postTitle: "",
                postUrl: "",
                postCategory: ""
                };
            
                json.postCategory= data.children().first().text().trim();
                json.postUrl = data.children().first().next().children().first().attr('href');
                json.postTitle = data.children().first().next().children().first().text().trim();
                
                finalPosts[index] = json;
            })
        }

        fs.writeFile('output.json', JSON.stringify(finalPosts, null, 4), function(err) {
            console.log('File Successfully Written Check your output.json file.');
        });

        res.send('Check your Console');
    })
})


app.listen(8080);

console.log('App is running on port 8080');

exports = module.exports = app;
