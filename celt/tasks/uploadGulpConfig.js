const gulp = require('gulp');
//
const config = require(global.rootPath + '/gulp/config');
const { fileActionResolver } = require('../util/fileActionResolver');

module.exports = function uploadGulpConfig() {
	var conf = config.gulpConfig;
	var promises = [];
	return gulp.src(conf.path)
		.on('data', function (_file) {
			let file = _file;
			file.event = 'change';
			if (!conf.disableSourceUploading || file.path.indexOf(conf.cssOptimiserFileName) > -1) {
				promises.push(() => fileActionResolver(file));
			} else {
				if (process.env.debug == 'true') {
					console.log(`Uploading of ${file.basename} prevented because value disableSourceUploading:true`.yellow);
				}
			}
		})
		.on('end', async () => {
			for (const prom of promises) {
				await prom();
			}
		})
}; 