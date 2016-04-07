#!/usr/bin/env node

var fileSystem = require( "fs" );
var program = require( 'commander' );
var PatternMatch = require( "./PatternMatch" );

//Program module is for taking command line arguments
program
 .option('-p, --pattern <pattern>', 'Input Pattern such as . ,')
 .parse(process.argv);

// input 1: the pattern, validate if exists
if (!program.pattern) {
	program.help();
	process.exit();
}

// Create an input stream from the file system.
var inputStream = fileSystem.createReadStream( "input-sensor.txt" );

// input 2: the sensor file - validate if exists
inputStream.on("error", function(err) {
	if (err.code == 'ENOENT') {
		console.log("input-sensor.txt required but not found.");
	} else {
		console.log(err);
	}
	
	process.exit();
});

/******************** start reading stream ******************/
// Create a Pattern Matching stream that will run through the input and find matches
// for the given pattern - "." and “,”.
var patternStream = inputStream.pipe( new PatternMatch(program.pattern));
// Read matches from the stream.

var data = [];
patternStream.on("readable", function() {
	var content = null;

	while ( content = this.read() ) {
		data.push(content);
	}

});

patternStream.on("end", function() {
	console.log(data);
	data = []; // reset 
});