var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var app = express();
var finalPosts = [];
app.get('/', function(req, res, next) {
    //All the crawl code comes here.
    url = "https://futurism.com/";
    request(url, function(error, response, html) {
        var json = {};
        
        if (!error) {
            var $ = cheerio.load(html);
            var postTitle,postUrl, postCategory;
            
            
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
        return res.redirect('/posts');
    })
});

app.get('/posts', function(req, res) {
    finalPosts.forEach(function(post,i) {
        request(post.postUrl, function(error, response, html){
            var allPosts = [];
            if (!error) {
            var $ = cheerio.load(html);
            var title, url, category, content=[], headings=[];
            
            var postSingle ={
                title:"",
                url:"",
                category:"",
                content:[],
                headings:[]
            };
            
            postSingle.title = post.postTitle;
            postSingle.url = post.postUrl;
            postSingle.category = post.postCategory;
            $('.post-container .post blog-content .post-content .summary p').each(function(index, elem){
                var data = $(this);
                
                var para;
                para = data.text().trim();
                content[index] = para;
            })
             $('.post-container .post blog-content .post-content .summary h2').each(function(index, elem){
                var data = $(this);
                var heading;
                heading = data.text().trim();
                headings[index] = heading;
            })
            postSingle.content = content;
            postSingle.headings = headings;

            allPosts[i] = postSingle;
        }
        console.log(allPosts);
        fs.writeFile('posts.json', JSON.stringify(allPosts, null, 4), function(err) {
            console.log('File Successfully Written Check your posts.json file.');
        });
        console.log('Control is here.');
        res.send('Check your Console.');
        })
    });
});


app.listen(8080);

console.log('App is running on port 8080');

exports = module.exports = app;
