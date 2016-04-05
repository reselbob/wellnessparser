/*
The purpose of this module is to determine
all the URLs that are defined as part of the Gemini
project. The way the module works is that the code
traverses all the directories in swagger directory,
as defined in the variable, swaggerDir, below.

The swagger directory contains directories that contain
JSON files. Each JSON file can be considered a mini-swagger spec
the describes endpoints. The code collects all this endpoint
definitions makes lists each endpoint URL and HTTP method into line that is
saved to the text file that is defined below in the variable, methodListFilespec
 */
var express = require('express');
var router = express.Router();
var fs = require("fs");
var dir = require('node-dir');

var swaggerDir = "/Users/reselbob/Documents/H2Wellness/swagger";
var methodListFilespec = "/Users/reselbob/Documents/H2Wellness/data/endpointList.csv";

/* GET users listing. */
router.get('/', function(req, res, next) {

    dir.files(swaggerDir, function(err, files) {
        files.forEach(function(path) {
            //traverse the directories, get the JSON files
            if(getExtension(path).toLowerCase() == '.json'){
                var contents = fs.readFileSync(path);
                //Create a JSON representation of the JSON file
                var jsonContent = JSON.parse(contents);

                //traverse the property, apis
                jsonContent.apis.forEach(function(api){
                    //Comma delimmit the end point URL and METHOD
                    api.operations.forEach(function(operation){
                        var str = api.path + "," + operation.method.toLowerCase() + "\n";
                        //append to file.
                        fs.appendFileSync(methodListFilespec, str)
                    });


                });
            }


        });
    });

    //send the created list back to the response, at no extra
    //charge to you, the consumer
    res.send(fs.readFileSync(methodListFilespec, 'utf8'));
});

function writeToFile(data){
    var fs = require('fs');
    var stream = fs.createWriteStream("my_cool_json.json");
    stream.once('open', function(fd) {
        stream.write(data);
        stream.end();
    });
}

function getExtension(filename) {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i);
}


module.exports = router;