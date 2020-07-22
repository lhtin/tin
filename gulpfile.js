let fs = require('fs');
let path = require('path');

const slash = require('slash')
var hljs = require('highlight.js');
let md = require('markdown-it')({
    html: true,
    highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    return '';
  }
});
let gulp = require('gulp');
let rimraf = require('gulp-rimraf');

let requireUncached = (module) => {
    delete require.cache[require.resolve(module)]
    return require(module)
};

let template = (title, content, comment) => {
    let c = '';
    if (comment) {
        c = `\
<div id="disqus_thread"></div>
<script>
var disqus_config = function () {
    this.page.url = localtion.href;
    this.page.identifier = '${comment.name}';
};
(function() {
    var d = document,
        s = d.createElement('script');
    s.src = 'https://lhtin.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
})();
</script>
`
    }

return `\
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="icon" type="image/png" href="//think/assets/ant.png">
  <link href="//styles.css" rel="stylesheet">
  <link href="//vs.css" rel="stylesheet">
  <!-- Global site tag (gtag.js) - Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=UA-131906119-1"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-131906119-1');
  </script>
  <script async src="//index.js"></script>
</head>
<body>
${content}
${c}
</body>
</html>
`};

let template2 = (title, desc, contents) => `\
  <h1 class="logo">${title}</h1>
  <p class="desc">${desc}</p>
  <ul class="contents">${contents}</ul>
`

gulp.task('clean', () => {
    return gulp.src('a/*')
        .pipe(rimraf());
})

gulp.task('compile', (finish) => {
    let contentsHTML = '';
    let config = requireUncached('./config');
    config.contents.map(function (data) {
        console.log((data.hide ? '- ' : '+ ') + data.title);
        let file = fs.readFileSync(data.filename, 'utf-8');
        let dirname = path.dirname(data.filename);
        let extname = path.extname(data.filename);
        let basename = path.basename(data.filename, extname);
        let html = template(data.title, md.render(file), false /*{name: data.filename}*/)
            .replace(/(href|src)="\.\//g, `$1="${slash(path.join('../', dirname, './'))}`)
            .replace(/(href|src)="\/\//g, `$1="../`)
        fs.writeFileSync(`./a/${basename}.html`, html, { flag: 'w' });
        if (!data.hide) {
          contentsHTML += `<li><a href="a/${basename}.html">${data.title}</a></li>`
        }
    });

    // 首页文章目录生成
    let temp = template(config.title,
        template2(config.title, config.subtitle, contentsHTML))
            .replace(/(href|src)="\/\//g, `$1="./`);
    fs.writeFileSync('./index.html', temp, { flag: 'w' });
    finish()
})

gulp.task('build', gulp.series('clean', 'compile'))

gulp.task('watch', () => gulp.watch(['contents.js', 'think/*.md', 'share/*/*.md'], ['build']))
