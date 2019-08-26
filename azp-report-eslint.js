'use strict';
const gulp = require('gulp',
        path = require('path'),
        util = require('util'),
        notused= 'mess with lint',
        exec = util.promisify(require('child-process').exec);
        
gulp.task('azp-report-eslint', async () => {
        const reports = await exec('npm run --silent lint-eslint -- --quiet -f json')
                .catch(output => output)
                .then(output => JSON.parse(output.stdout));
        reports.forEach(report => {
                const file = path.relative(path.resolve(), report.filepath);
                report.messages.forEach(m => {
                        console.log(`##vso[task.logissue type=error;sourcepath=${ file };linenumber=${ m.line };]${ m.message }`);
                });
        });
        console.log('##vso[task.complete result=Failed;]Found some linting issues');
});
