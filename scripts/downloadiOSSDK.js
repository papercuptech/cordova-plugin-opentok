#!/usr/bin/env node


module.exports = function (context) {
	var _exec = require('./exec/exec.js')
	function exec(cmd) {return new Promise(function(resolve) {_exec(cmd, resolve)})}

	var IosSDKVersion = "OpenTok-iOS-2.15.3";
	var downloadFile = require('./downloadFile.js')

	return new Promise(function(resolve, reject) {
		var tarUrl = 'https://s3.amazonaws.com/artifact.tokbox.com/rel/ios-sdk/' + IosSDKVersion + '.tar.bz2'
		var tarFileName ='./' + IosSDKVersion + '.tar.bz2'
		console.log('Downloading OpenTok iOS SDK');
		downloadFile(tarUrl, tarFileName, function(err) {
			if(err) return reject(err)
			console.log('downloaded');
			var frameworkDir = context.opts.plugin.dir + '/src/ios/';
			exec('tar -zxvf ./' + IosSDKVersion + '.tar.bz2')
			.then(function() {
				console.log('expanded');
				return exec('mv ./' + IosSDKVersion + '/OpenTok.framework ' + frameworkDir)
			})
			.then(function() {
				console.log('moved OpenTok.framework into ' + frameworkDir);
				return exec('rm -r ./' + IosSDKVersion)
			})
			.then(function() {
				console.log('Removed extracted dir');
				return exec('rm ./' + IosSDKVersion + '.tar.bz2')
			})
			.then(function() {
				console.log('Removed downloaded SDK');
				resolve();
			})
		})
	})
};
