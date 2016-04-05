/*
The purpose of the module is to assign categories as Swagger
tags values to a given endpoint/method. An endpoint/method node
in a Swagger JSON definition can have one or many values defined in
the tags property, which is of type, array.

In the case of H2Wellness, each value assigned to
the tags array is a logical category. For example:

tags = ["Device, Tile]
 */
var express = require('express');
var router = express.Router();
var fs = require("fs");
var dir = require('node-dir');


//The file that contains the JSON tree that defines the logical
//categories for a given endpoint/method
var categoryData = "/Users/reselbob/Documents/H2Wellness/data/scrubbed.json";

//The Swagger 2.0 JSON file that has the H2Wellness Gemini API defined
var fullApi = "/Users/reselbob/Documents/H2Wellness/data/fullapi.json";

//The filespec where to put the API Tree with tag definitions
var processedTree = "/Users/reselbob/Documents/H2Wellness/data/processedApiTree.json"

//Let's run this as a simple request, the route of
//which is defined in app.js
router.get('/', function(req, res, next) {

    //Load the Swagger compliant JSON file that describes the
    //Gemini API
    var apiTree = JSON.parse(fs.readFileSync(fullApi));
    //Load the array of JSON objects in which each object
    //describes an endpoint/method along with relevant categories
    var validationArr = JSON.parse(fs.readFileSync(categoryData));

    //Create an array the will contains endpoint/methods that
    //have no categories. Such branches are of no interest
    //to the API
    var nukeArray = [];
    //clean out the garbage by goind through the paths in the JSON
    //tree. The paths property contains an array of path objects
    //A path object contains METHOD and TAGs information
    for (var path in apiTree.paths) {
        //get a path
        console.log(path); //I know, it's a cheap shot for visual testing

        //go over to the validationTree and match up the path in the
        // API tree with a relevant endpoint/method in the validation tree
        //if one exists
        validationArr.map( function(item) {
            if(item.endpoint == path){
                //take a look at the operation
                for (var operation in apiTree.paths[path]) {
                    if(operation == item.operation && !item.catIsGood){
                        //if categories are is not good, add it to the nuke array
                        nukeArray.push(path);
                    }
                }
            };
        });
    }
    //now remove the un-needed nodes from the tree
    nukeArray.map( function(item) {
        delete apiTree.paths[item];

     });

    //now let's retag, go through the the paths in the API
    for (var path in apiTree.paths){

        for (var operation in apiTree.paths[path]){
            //Get the releveant tag
            var tags = getTagsFromArray(validationArr,path,operation);
            //assign the tags to the method
            apiTree.paths[path][operation].tags = tags;
        }

    }

    //Write to file.
    writeToFile(JSON.stringify(apiTree),processedTree);

    //send back the work as part of the response
    res.send(JSON.stringify(apiTree));
});

module.exports = router;

/*
Utility function to write data to disk
data: the data in string format the write
filespec: the filepath on the local machine where
            the data will be written.
 */
function writeToFile(data, filespec) {

    var fs = require('fs');
    var stream = fs.createWriteStream(filespec);
    stream.once('open', function (fd) {
        stream.write(data);
        stream.end();
    });
}

/*
This method traverse the tags array
and assigned the discovered tags to the
endpoint.
 */
function getTagsFromArray(arr, path, operation) {
    var tags = [];
    arr.map( function(item) {
        if(item.endpoint == path && item.operation == operation){
            tags = item.categories;
        };
    });
    return tags;
}