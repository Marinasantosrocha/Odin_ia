const { src, dest, series, parallel, watch } = require('gulp');
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

// Caminhos dos arquivos
const paths = {
  styles: {
    src: 'src/styles/**/*.scss',
    dest: 'public/css/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'public/js/'
  },
  images: {
    src: 'src/images/**/*',
    dest: 'public/images/'
  }
};

// Tarefa para compilar SASS
function compileSass() {
  return src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// Tarefa para minificar JavaScript
function minifyJS() {
  return src(paths.scripts.src)
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

// Tarefa para otimizar imagens
function optimizeImages() {
  return src(paths.images.src)
    .pipe(imagemin())
    .pipe(dest(paths.images.dest));
}

// Tarefa para iniciar o servidor de desenvolvimento
function serve() {
  browserSync.init({
    server: {
      baseDir: './',
      index: 'index.html'
    },
    port: 3000
  });

  // Observar mudanças nos arquivos
  watch(paths.styles.src, compileSass);
  watch(paths.scripts.src, minifyJS);
  watch('*.html').on('change', browserSync.reload);
}

// Tarefa padrão
const build = parallel(compileSass, minifyJS, optimizeImages);
const dev = series(build, serve);

// Exportar tarefas
exports.compileSass = compileSass;
exports.minifyJS = minifyJS;
exports.optimizeImages = optimizeImages;
exports.serve = serve;
exports.build = build;
exports.dev = dev;
// Tarefa padrão
exports.default = dev;
