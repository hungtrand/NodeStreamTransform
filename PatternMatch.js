var Transform = require('stream').Transform;
var util = require("util");

// For Node 0.8 users
if (!Transform) {
	Transform = require('readable-stream/transform');
}

var PatternMatch = function(pattern) {
	this.pattern = pattern;
	Transform.call(this, { objectMode: true });
}

util.inherits(PatternMatch, Transform);

PatternMatch.prototype._transform = function(chunk, encoding, next) {
	var data = chunk.toString()
	if (this._lastLineData) data = this._lastLineData + data;

	var bits = data.split(this.pattern);
	this._lastLineData = bits.splice(bits.length - 1, 1)[0]

	bits.forEach(this.push.bind(this))
	next();
}

PatternMatch.prototype._flush = function(done) {
	if (this._lastLineData) this.push(this._lastLineData)
	this._lastLineData = null;
	done();
}

module.exports = PatternMatch;