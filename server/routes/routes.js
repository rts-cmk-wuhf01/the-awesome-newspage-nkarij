module.exports = (app) => {

   app.get('/', (req, res, next) => {
      res.render('home', {
         "title" : "Forside",
         "page" : "Home"
      });
   });

   app.get('/contact', (req, res, next) => {
      res.render('contact', {
         "title" : "Kontakt Os",
         "page" : "Contact"
      });
   });

   app.get('/about', (req, res, next) => {
      res.render('about', {
         "title" : "Om os",
         "page" : "About"
      });
   });

   app.get('/categories-post', (req, res, next) => {
      res.render('categories-post', {
         "title" : "Kategorier",
         "page" : "Categories-post"
      });
   });

   app.get('/single-post', (req, res, next) => {
      res.render('single-post', {
         "title" : "Post",
         "page" : "Single-post"
      });
   });

};