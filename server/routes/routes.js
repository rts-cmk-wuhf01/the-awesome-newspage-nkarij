const mysql = require('../config/mysql');

module.exports = (app) => {

   app.get('/', async (req, res, next) => {

      let database = await mysql.connect();

      // NB BEMÆRK BACKTICKS FOR LINJESKIFT, sådan får man fat i de relaterede tabeller:
      let [categories] = await database.execute(`
         SELECT * FROM newscategories
      `);

      let [frontpagestory] = await database.execute(`
         SELECT * FROM news
         INNER JOIN newscategories ON fk_newscategoryID = newsCategoryID
         INNER JOIN author ON fk_authorID = authorID
         WHERE newsIsFeatured = ?
         ORDER BY newsPostDate DESC` 
         , [1]
      );
   

      let [featurednews] = await database.execute(`
         SELECT * FROM news
         INNER JOIN newscategories ON fk_newscategoryID = newsCategoryID
         INNER JOIN author ON fk_authorID = authorID
         WHERE newsIsFeatured = ?
         ORDER BY newsPostDate ASC
         LIMIT 2` 
         , [1]
      );
      
      // udskriver den nyeste artikel fra hver kategori.
      let [editorspicks] = await database.execute(`
         SELECT
         *
         FROM newscategories
         INNER JOIN news ON fk_newscategoryID = newsCategoryID
         WHERE newsID = ( SELECT newsID FROM news WHERE fk_newscategoryID = newsCategoryID ORDER BY newsPostDate DESC LIMIT 1)` 
         // NOTE til subselect I SQL-noterne på desktop-skrivebordet
      );

      // WIDGETS
      let [latestpostswidget] = await database.execute(`
         SELECT
         *
         FROM newscategories
         INNER JOIN news ON fk_newscategoryID = newsCategoryID
         INNER JOIN author ON fk_authorID = authorID
         WHERE newsID = (SELECT newsID FROM news 
                        WHERE fk_newscategoryID = newsCategoryID
                        ORDER BY newsPostDate DESC
                        LIMIT 1)
         ORDER BY newsPostDate DESC`
      );

      let [popularnews] = await database.execute(`
         SELECT
         *
         FROM news
         INNER JOIN newscategories ON fk_newscategoryID = newsCategoryID
         INNER JOIN author ON fk_authorID = authorID
         ORDER BY newsLikes DESC
         LIMIT 4`
      );


      database.end();

      res.render('home', {
         "title" : "The News Paper - News & Lifestyle Magazine Template",
         "page" : "Home",
         "categories" : categories,
         "frontpagestory" : frontpagestory[0],
         "featurednews" : featurednews,
         "editorspicks" : editorspicks,
         // nb newspicks er begrænset til 4 i templaten.
         "popularnewspick" : popularnews,
         // widgets:
         "latestposts" : latestpostswidget,
         "mostpopular" : popularnews
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

      let [news] = await database.execute(`
         SELECT *, 
         (SELECT COUNT(commentID)
         FROM comments 
         WHERE fk_newsID = newsID) AS articleComments
         FROM news 
         INNER JOIN newscategories ON newsCategoryID = fk_newscategoryID
         INNER JOIN author ON authorID = fk_authorID
         WHERE fk_newsCategoryID = ?`, [req.params.categoryID]
      );

      let [popularnews] = await database.execute(`
         SELECT
         *
         FROM news
         INNER JOIN newscategories ON fk_newscategoryID = newsCategoryID
         INNER JOIN author ON fk_authorID = authorID
         ORDER BY newsLikes DESC
         LIMIT 4`
      );

      // NB BEMÆRK BACKTICKS FOR LINJESKIFT, sådan får man fat i de relaterede tabeller:
      let [selectednews] = await database.execute(`
         SELECT * FROM news
         INNER JOIN newscategories ON fk_newscategoryID = newsCategoryID
         INNER JOIN author ON fk_authorID = authorID
         WHERE fk_newscategoryID = ?
      `, [req.params.categoryID]);
      // nb sql vælger kun de news-artikler som tilhører en kategori..
      // men burde ? ikke være categoryID. skal jeg overhovedet bruge denne?
      
      
      // WIDGETS
      let [latestpostswidget] = await database.execute(`
         SELECT
         *
         FROM newscategories
         INNER JOIN news ON fk_newscategoryID = newsCategoryID
         INNER JOIN author ON fk_authorID = authorID
         WHERE newsID = (SELECT newsID FROM news 
                        WHERE fk_newscategoryID = newsCategoryID
                        ORDER BY newsPostDate DESC
                        LIMIT 1)
         ORDER BY newsPostDate DESC`
      );


      database.end();

      res.render('categories-post', {
         "title" : "The News Paper - News & Lifestyle Magazine Template",
         "page" : "Categories-post",
         "selectednews" : selectednews,
         "categories" : categories,
         // nb newspicks er begrænset til 4 i templaten.
         "popularnewspick" : popularnews,
         // widgets:
         "latestposts" : latestpostswidget,
         "mostpopular" : popularnews,
         "news" : news,
      });
   });

   app.get('/author-posts/:authorID', async (req, res, next) => {

      let database = await mysql.connect();

      let [selectedauthor] = await database.execute(`
         SELECT * FROM news
         INNER JOIN newscategories ON fk_newscategoryID = newsCategoryID
         INNER JOIN author ON fk_authorID = authorID
         WHERE fk_authorID = ?
      `, [req.params.authorID]);

         // WIDGETS
         let [latestpostswidget] = await database.execute(`
         SELECT
         *
         FROM newscategories
         INNER JOIN news ON fk_newscategoryID = newsCategoryID
         INNER JOIN author ON fk_authorID = authorID
         WHERE newsID = (SELECT newsID FROM news 
                        WHERE fk_newscategoryID = newsCategoryID
                        ORDER BY newsPostDate DESC
                        LIMIT 1)
         ORDER BY newsPostDate DESC`
      );

      let [popularnews] = await database.execute(`
         SELECT
         *
         FROM news
         INNER JOIN newscategories ON fk_newscategoryID = newsCategoryID
         INNER JOIN author ON fk_authorID = authorID
         ORDER BY newsLikes DESC
         LIMIT 4`
      );

      database.end();

      res.render('author-posts', {
         "title" : "The News Paper - News & Lifestyle Magazine Template",
         "page" : "author-posts",
         "selectedauthor" : selectedauthor,
      });
   });


   app.get('/single-post/:singleID', async (req, res, next) => {

      let database = await mysql.connect();

      // NB BEMÆRK BACKTICKS FOR LINJESKIFT, sådan får man fat i de relaterede tabeller:
      let [selectednewspost] = await database.execute(`
         SELECT * FROM news
         LEFT OUTER JOIN newscategories ON fk_newscategoryID = newsCategoryID
         LEFT OUTER JOIN author ON fk_authorID = authorID
         WHERE newsID = ?
      `, [req.params.singleID] 
      );

      let [comments] = await database.execute(`
         SELECT * FROM comments
         INNER JOIN users ON fk_userID = userID
         WHERE fk_newsID = ? 
      `, [req.params.singleID])

      console.log(comments)

      // udskriver den nyeste artikel fra hver kategori.
      let [editorspicks] = await database.execute(`
         SELECT
         *
         FROM newscategories
         INNER JOIN news ON fk_newscategoryID = newsCategoryID
         WHERE newsID = ( SELECT newsID FROM news WHERE fk_newscategoryID = newsCategoryID ORDER BY newsPostDate DESC LIMIT 1)` 
         // NOTE til subselect I SQL-noterne på desktop-skrivebordet
      );

      
      // widgets:
      let [popularnews] = await database.execute(`
         SELECT
         *
         FROM news
         INNER JOIN newscategories ON fk_newscategoryID = newsCategoryID
         INNER JOIN author ON fk_authorID = authorID
         ORDER BY newsLikes DESC
         LIMIT 4`
      );

      // WIDGETS
      let [latestpostswidget] = await database.execute(`
         SELECT
         *
         FROM newscategories
         INNER JOIN news ON fk_newscategoryID = newsCategoryID
         INNER JOIN author ON fk_authorID = authorID
         WHERE newsID = (SELECT newsID FROM news 
                        WHERE fk_newscategoryID = newsCategoryID
                        ORDER BY newsPostDate DESC
                        LIMIT 1)
         ORDER BY newsPostDate DESC`
      );


      database.end();

      res.render('single-post', {
         "title" : "The News Paper - News & Lifestyle Magazine Template",
         "page" : "Single-post",
         "selectedpost" : selectednewspost[0],
         "editorspicks" : editorspicks,
         "popularnewspick" : popularnews,
         // widgets:
         "latestposts" : latestpostswidget,
         "mostpopular" : popularnews,
         "comments" : comments
      });
   });

};