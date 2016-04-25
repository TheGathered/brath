var port                = process.env.PORT || 3680;
var env                 = process.env.NODE_ENV || 'Development';
var pkg                 = require('./package.json');
const express           = require('express'),
      bodyParser        = require('body-parser'),
      favicon           = require('serve-favicon'),
      path              = require('path'),
      colors            = require('colors'),
      slugify           = require('slugify');

var app                 = express();

var menu = [
  ['Hem', 'Start sidan', '/'],
  ['Vilka är vi?', 'Vilka är vi?', '/vilka-ar-vi'],
  ['<abbr title="Search Engine Optimisation">SEO<abbr>', 'Search Engine Optimisation', '/sokmotoroptimering'],
  ['Adwords', 'Sökordsannonsering med Google Adwords', '/google-adwords'],
  ['Jobba hos Brath', 'Lediga jobb hos Brath', '/lediga-jobb-hos-brath'],
  ['<abbr title="Search Engine Optimisation">SEO<abbr> bloggen', 'SEO bloggen', '/blogg']
];


app.use(express.static('./public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(favicon(__dirname + '/src/images/favicon.png'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/img', express.static('./dist/images'));
app.use('/source', express.static('./src/styles'));
app.use('/source', express.static('./src/scripts'));
app.set('views', './src/views');
app.set('view engine', 'jade');

app.use(function(req, res, next) {
  if (env === 'Wireframes' && !req.query.debug) {
    res.redirect(req.url+'?debug=wireframes');
  }
  else if (!req.query.graphics) {
    res.redirect(req.url+'?graphics=trees');
  }
  next();
});

app.get('/', function (req, res, next) {
  res.render('index', { title: 'index', message: 'Bråth AB, index!', extras: req.query, menu:menu });
});
app.get('/:page?', function (req, res, next) {
  res.render(req.params.page, { title: req.params.page, type: req.params.page, message: 'Bråth AB, index', extras: req.query, menu:menu}, function(err, html) {
    if (err) {
      if (err.message.indexOf('Failed to lookup view') !== -1) {
        return res.render('404', { title: req.params.page, message: 'Bråth AB, 404!', extras: req.query, menu:menu });

      }
      throw err;
    }
    res.send(html);
  });
});
app.get('/blogg/:page?', function (req, res, next) {
  res.render('artikel', { title:req.params.page, type: req.params.page, message: 'Bråth AB, index', extras: req.query, menu:menu});
});




app.listen(port);
console.log(pkg.description +' version '+ pkg.version+'; in '+env+' mode on port ' + colors.red(port));