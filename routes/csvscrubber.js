/**
 * The purpose of the module is to apply
 * the category to endpoint assignments defined
 * in a comma delimited file and them output that
 * assignment data to JSON file the describes the assignment
 */
var express = require('express');
var router = express.Router();
var fs = require("fs");

//The csv file containing the category to endpoint assignment
var dataToScrub = "/Users/reselbob/Documents/H2Wellness/data/non-na-data.csv";
//The filespec into which the JSON tree that is the result of the category(s) to endpoint
//assign is stored
var scrubbed = "/Users/reselbob/Documents/H2Wellness/data/scrubbed.json"

//The var for the JSON tree
var o = [];

/*Let's just make this a simple GET call from the entry point
described in app.js
 */
router.get('/', function(req, res, next) {
    /*
    * The important thing to understand when inspecting this
    * code is the expected structure of the csv file being processed.
    *
    * The expectation is that each line in the csv
    * file to be scrubbed contains a 7 fields defined
    * by comma separation. The first field describes the
    * endpoint URL. The second file describes the METHOD associated
    * to the endpoint. The remaining fields describe the categories
    * to which the endpoint/method can be assigned. Any fields that are marked
    * NA will be considered empty. NA fields will be transformed into an
    * empty field in the code.
    * */

    var lineByLine = require('n-readlines');
    var liner = new lineByLine(dataToScrub);

    var line;
    while (line = liner.next()) {
        var obj = {}; //Create an object to describes endpoint, method and categories
        var arr = line.toString('ascii').split(",");
        obj.endpoint = arr[0]; //The first field is the endpoint
        obj.operation = arr[1]; //The second field in an HTTP method related to the endpoint
        obj.categories = [];
        for(var i = 2;i<8;i++){
            //Assign the remaining fields to the an array, categories
            if(arr[i] != "" && arr[i].toLowerCase() != "na" && arr[i] != "\r") obj.categories.push(arr[i]);
        }
        obj.catIsGood = obj.categories.length !=0; //make the tree branch as good, just to save some cycle
                                                   //time later on. (A branch without categories is meaningless

        //put the branch on the tree
        o.push(obj);
    }

    //write the JSON to the file
    writeToFile(JSON.stringify(o),scrubbed);


    //return the JSON in the response, in case it is
    //useful.
    res.send(JSON.stringify(o));
});

module.exports = router;


/*
 Utility function to write data to disk
 Utility function to write data to disk
 data: the data in string format the write
 filespec: the filepath on the local machine where
 the data will be written.
 
 Yes, I know I am repeating myself. This method
 exists in other modules.
 I am bad.  I will become good later.
 */
function writeToFile(data, filespec) {

    var fs = require('fs');
    var stream = fs.createWriteStream(filespec);
    stream.once('open', function (fd) {
        stream.write(data);
        stream.end();
    });
}


