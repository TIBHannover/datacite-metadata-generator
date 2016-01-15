var gulp = require('gulp');
var inject = require('gulp-inject');
var wrap = require('gulp-wrap');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');

function injectContent(stream) {
  return inject(stream, {
    transform : function(filePath, file) {
      return file.contents.toString('utf8');
    }
  });
}

gulp.task("default", function() {
  var js = gulp.src(['node_modules/jquery/jquery.js','src/dmg.js','src/load.js'])
    .pipe(uglify())
    .pipe(wrap("<script type=\"text/javascript\">\n<%= contents %>\n</script>"));
  var css = gulp.src(['src/dmg.css'])
    .pipe(minifyCss())
    .pipe(wrap("<style>\n<%= contents %>\n</style>"));

  gulp.src('src/dmg.html')
    .pipe(injectContent(js))
    .pipe(injectContent(css))
    .pipe(rename("datacite_metadata_generator.html"))
    .pipe(gulp.dest('./'));
});
