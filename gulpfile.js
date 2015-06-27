// gulpfile.js
var gulp = require('gulp');  
var nodemon = require('gulp-nodemon'); // restart app on filechange  
var mocha = require('gulp-mocha-co');  
var exit = require('gulp-exit');

gulp.task('watch', function() {  
  gulp.watch(
    ['*.js', 'test/*.js'], // files to watch
    ['mocha'] // gulp task to run on file change
  );
});
gulp.task('nodemon', function() {  
  nodemon({
    script: 'server.js',
    env: {PORT: 8000}, // preventing conflicts
  }).on('restart');
});

gulp.task('mocha', function() {  
  process.env.PORT = 8001; // default would conflict with superset
  return gulp.src(['test/*.js']) // run all tests
  .pipe(mocha({           // pipe them into mocha
    reporter: 'nyan'      // report by nyan
  }));
});

gulp.task('test-once', function() {  
  gulp.tasks.mocha.fn().pipe(exit());
});
// default tasks to run if gulp is called without specific task
gulp.task('default', ['nodemon', 'mocha', 'watch']);  