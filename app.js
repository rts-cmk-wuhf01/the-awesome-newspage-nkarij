// indlæs express modulet, dette er vores serverprogram
const express = require('express');
// opret en express applikation 
const app = express();



/* aktiver serverside console.log af side indlæsninger. 
 * Dette sættes op så vi kan følge med i hvilke HTML filer 
 * og ROUTES der forsøges at blive indlæst */
const logger = require('morgan');
app.use(logger('dev', {
   // hvis ALLE requests skal ses i loggen, udkommenter næste linje
   skip: req => (!req.url.endsWith(".html") && req.url.indexOf('.') > -1)
}));



// sæt viewengine til ejs 
app.set('view engine', 'ejs');
// peg på den mappe hvor alle views filerne er placeret
app.set('views', './server/views');

/* indlæs alle de routes serveren skal håndtere
 * dette sker igennem en ny fil, for at splitte koden op i smartere blokke */
require('./server/routes/routes.js')(app);

/* sæt serveren op så den kan servere html/css/javascript
 * og billeder direkte fra public mappen, efter alle routes er kørt */
app.use(express.static('public'));


/* BRUG DATE-AND-TIME MODULE, den engelske version skal laves om til en dansk */
app.locals.dateAndTime = require('date-and-time');
app.locals.dateAndTime.locale('en');
app.locals.dateAndTime.setLocales('en', {
   'A': ['AM', 'PM'],
   'dddd': ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'],
   'ddd': ['søn', 'man', 'tirs', 'ons', 'tors', 'fre', 'lør'],
   'dd': ['sø', 'ma', 'ti', 'on', 'to', 'fr', 'lø'],
   'MMM': ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
   'MMMM': ['januar', ' februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december']
});


// start serveren på port 3001
const port = 3001;
app.listen(port, (error) => {
   if (error) console.log(error);
   console.log('\x1b[35m%s\x1b[0m', '================================================================'); // udskriver en lilla streg i konsol
   console.log('Server is listening on port %s, address: %s', port, 'http://localhost:' + port);
});
