const mysql = require('../config/mysql');

module.exports = (app) => {


   // // EKSEMPEL PÅ EN REQUEST TIL DATABASE-INDHOLD
   // app.get('/products', async (req, res, next) => {
      
   //    let database = await mysql.connect();

   //    // NB BEMÆRK BACKTICKS FOR LINJESKIFT, sådan får man fat i de relaterede tabeller:
   //    let [productsandcategories] = await database.execute(`
   //       SELECT * FROM products
   //       INNER JOIN categories ON fk_categoryID = categoryID
   //    `);
   //    database.end();

   //    // PÅ REQUEST /PRODUCTS HENT FRA DATABASEN:
   //    res.render('products', {
   //       "productsandcategories" : productsandcategories,
   //    });
   // });


   app.get('/', async (req, res, next) => {

      let database = await mysql.connect();

      // NB BEMÆRK BACKTICKS FOR LINJESKIFT, sådan får man fat i de relaterede tabeller:
      let [categories] = await database.execute(`
         SELECT * FROM newscategories
      `);

      database.end();

      res.render('home', {
         "title" : "The News Paper - News & Lifestyle Magazine Template",
         "page" : "Home",
         "categories" : categories,
      });
   });

   app.get('/contact', async (req, res, next) => {

      let database = await mysql.connect();
      // NB BEMÆRK BACKTICKS FOR LINJESKIFT, sådan får man fat i de relaterede tabeller:
      let [categories] = await database.execute(`
         SELECT * FROM newscategories
      `);
      database.end();

      res.render('contact', {
         "title" : "The News Paper - News & Lifestyle Magazine Template",
         "page" : "Contact",
         "categories" : categories,
      });
   });

   app.get('/about', async (req, res, next) => {

      let database = await mysql.connect();

      // NB BEMÆRK BACKTICKS FOR LINJESKIFT, sådan får man fat i de relaterede tabeller:
      let [categories] = await database.execute(`
         SELECT * FROM newscategories
      `);
      database.end();

      res.render('about', {
         "title" : "The News Paper - News & Lifestyle Magazine Template",
         "page" : "About",
         "categories" : categories,
      });
   });

   // her tilføjes et endpoint til siden vha /:
   // fx: /categories-post/3. Her er 3 = parameter værdien, 
   // som er tilgængelig i route koden via req.params.category_id
   // app.get('/categories-post/:category_id', async (req, res, next) => {
   //    res.send(req.params.category_id); // for demonstrationens skyld! 
   //    // her kan alle kategoriens artikler hentes osv...
   // });
   app.get('/categories-post/:categoryID', async (req, res, next) => {

      let database = await mysql.connect();

      // NB BEMÆRK BACKTICKS FOR LINJESKIFT, sådan får man fat i de relaterede tabeller:
      let [categories] = await database.execute(`
      SELECT * FROM newscategories
      `);

      // NB BEMÆRK BACKTICKS FOR LINJESKIFT, sådan får man fat i de relaterede tabeller:
      let [selectednews] = await database.execute(`
         SELECT * FROM news
         INNER JOIN newscategories ON fk_newscategoryID = newsCategoryID
         INNER JOIN author ON fk_authorID = authorID
         WHERE fk_newscategoryID = ?
      `, [req.params.categoryID]);
      // nb sql vælger kun de news-artikler som tilhører en kategori..
      // men burde ? ikke være categoryID. skal jeg overhovedet bruge denne?
      database.end();
      console.log(selectednews[1].newsTitle);

      res.render('categories-post', {
         "title" : "The News Paper - News & Lifestyle Magazine Template",
         "page" : "Categories-post",
         "selectednews" : selectednews,
         "categories" : categories,
      });
   });

   app.get('/single-post/:singleID', async (req, res, next) => {

      let database = await mysql.connect();

      // NB BEMÆRK BACKTICKS FOR LINJESKIFT, sådan får man fat i de relaterede tabeller:
      let [selectednewspost] = await database.execute(`
         SELECT * FROM news
         INNER JOIN newscategories ON fk_newscategoryID = newsCategoryID
         INNER JOIN author ON fk_authorID = authorID
         WHERE newsID = ?
      `, [req.params.singleID] 
      );

      console.log(selectednewspost)
      database.end();

      res.render('single-post', {
         "title" : "The News Paper - News & Lifestyle Magazine Template",
         "page" : "Single-post",
         "selectedpost" : selectednewspost[0],
      });
   });

};