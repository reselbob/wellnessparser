# TBD Transformation Utilities
## Installation
Type: `npm install`


## Execution
Type: `node bin/www`

##Documentation
URL `/`


##Project Description

The purpose of this little NodeJS/Express application is to provide operations that are required to build the TBD API.

This application is made up of 4 operations:

###Lister
URL: `/lister`

The purpose of this module is to determine all the endpoint URLs and associated methods that are defined as part of the TBD project.

The way the module works is that the code traverses all the directories in swagger directory, which is defined in code.

The swagger directory contains directories that contain JSON files. Each JSON file can be considered a mini-swagger spec the describes endpoints. The code collects all this endpoint definitions which it then makes into a list of comma delimited text entrie, with each endpoint URL and HTTP method a comma delimited line in that list. The list is then saved to the text file that is defined in code.

###CSV Scrubber
URL: `/csvscrubber`

The purpose of CSV Scrubber is to apply the category(s) to endpoint/methid assignments that are defined in a comma delimited file and then output the category(s) to endpoint/method assignment data to a JSON file that describes the assignments as a JavaScript object.

The comma delimited file that is processed was creted by Lister and imported into a spreadsheet. Then, a human Subject Matter Expert applies none, one or more categories to each endpoint/method entry in the spreadsheet file. Each category is a column cell in an endpoint row. The spreadsheet file that is the result is exported as a CSV file. That exported CSV file is the source processed by CSV Srubber.

###API Create

URL: `/apicreate`

The purpose of API Create is to create a Swagger 2.0 spec compliant JSON tree that describes the TBD API.

The way the module works is that the code traverses all the directories in a Swagger directory. (For now, the Swagger directory is defined in code. We'll refactor this shortcoming into a configuration file.). Each Swagger directory contains directories that contain JSON files. Each JSON file can be considered a mini-swagger spec that describes endpoints. The code collects all the endpoints and transforms each endpoint into a branch on the main TBD JSON API spec tree. Each branch on the tree, which is an API path and subordinate properties, is Swagger 2.0 compliant and thus can be rendered on any technology that can render a Swagger 2.0 compliant API spec written in JSON.

###Integrator
URL: `/integrator`

The purpose of Integrator is to assign categories as Swagger `tags` values to a given endpoint/method on the master JSON file that defines the overall Swagger specfication for the API. An endpoint/method node is a Swagger JSON definition that can have one or many values defined in the `tags` property.The `tags` property is of type, `array`.

In the case of TBD, each value assigned to the `tags` array is a logical category. For example:

`tags = ["Device", "Tile"]`

The way Integrator works is that the code loads the Swagger JSON created by the module, API Create into memory as a JavaScript object. Also, the JSON file created by CSV Scrubber is loaded into memory as JavaScript object. the CSV Scubber file is a definition of endpoint/method to category(s) assignments that were created using Human Intelligence. The code then does a logical join between the master API Json document and the document produced by CSV Scrubber, binding to the endpoint/url of each API call. The endpoint/url of each API call exists uniquely in both files. Upon joining, the `tags` values from the CSV Scrubber JSON are applied to the `tags` property in the TBD API document.
