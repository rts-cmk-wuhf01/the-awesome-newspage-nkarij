const mysql = require('../config/mysql');

// async functions: man kan lave alle de lokale [variabler] til async functions.
// bruges til de tabeller man kalder flere gange..
// husk at du skal kalde funktionen nede i routes.

async function getCategories() {
   let database = await mysql.connect();
   let [categories] = await database.execute(`
      SELECT *
      FROM newscategories
      ORDER BY newsCategoryTitle ASC`);
   database.end();
   return categories;
}

async function getLatestPostsWidget() {
   let database = await mysql.connect();
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
   return latestpostswidget;
}

async function getMostPopularNews() {
   let database = await mysql.connect();
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
   return popularnews;
}

async function getEditorsPicks() {
   let database = await mysql.connect();
   let [editorspicks] = await database.execute(`
      SELECT
      *
      FROM newscategories
      INNER JOIN news ON fk_newscategoryID = newsCategoryID
      WHERE newsID = ( SELECT newsID FROM news WHERE fk_newscategoryID = newsCategoryID ORDER BY newsPostDate DESC LIMIT 1)` 
      // NOTE til subselect I SQL-noterne på desktop-skrivebordet
      );
   database.end();
   return editorspicks;
}

async function getCommentWidget() {

   let database = await mysql.connect();
   
   let [commentswidget] = await database.execute(`
      SELECT * FROM comments
      INNER JOIN users ON fk_userID = userID
      INNER JOIN news ON fk_newsID = newsID
      ORDER BY commentPostDate DESC
      LIMIT 4
   `);

   database.end();
   return commentswidget;
}

// eksempel på en async function

// async function getCategories() {
//    let database = await mysql.connect();
//    // skriv dit SQL kald her.
//    database.end();
//    return categories;
// }


module.exports = (app) => {

   app.get('/fisk/:antal/:type', async (req, res, next) => { 
      // res.send("Her er en fisk");

      // URL eksempel: /fisk/3/torsk

      // let antal = req.params.antal;

      // en mini-database, hvor fisk er tabellen og antal/type er rækker
      let fisk = {
         "antal" : req.params.antal,
         "type" : req.params.type,
      }

      // render sender til ejs.
      res.render('fisk', {
         "fisk" : fisk
      });

      
   });


   app.get('/', async (req, res, next) => {

      let database = await mysql.connect();

      let [categories] = await database.execute(`
         SELECT * FROM newscategories
      `);

      // NB BEMÆRK BACKTICKS FOR LINJESKIFT, sådan får man fat i de relaterede tabeller:
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
      let editorspicks = await getEditorsPicks();

      // WIDGETS
      let latestpostswidget = await getLatestPostsWidget()
      let popularnews = await getMostPopularNews();

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

   // husk at post-routen også skal være async
   app.post('/contact', async (req, res, next) => {
      // res.send(req.body);

      // FORM VALIDERING SERVERSIDE STARTER
      let name = req.body.contactformname;
      let email = req.body.contactformemail;
      let subject = req.body.contactformsubject;
      let message = req.body.contactformmessage;
      let contactDate = new Date();

      // håndter valideringen, alle fejl pushes til et array så de er samlet ET sted
      let returnMessageArray = [];

      if(name == undefined || name == '') {
         returnMessageArray.push('Navn mangler');
      }
      if(email == undefined || email == '') {
         returnMessageArray.push('Email mangler')
      }
      if(subject == undefined || subject == '') {
         returnMessageArray.push('Emne mangler')
      }
      if (message == undefined || message == '') {
         returnMessageArray.push('Beskedteksten mangler');
      }

      // hvis der er 1 eller flere elementer i `return_message`, så mangler der noget
      if (returnMessageArray.length > 0) {
         // der er mindst 1 information der mangler, returner beskeden som en string.
         let categories = await getCategories(); // async function

         res.render('contact', {
            'categories': categories,
            'returnMessageArray': returnMessageArray.join(', '),
            // læg mærke til vi "bare" sender req.body tilbage til formularen
            'values': req.body 
         });

      } else {
         // send det modtagede data tilbage, så vi kan se det er korrekt
         // res.send(req.body);
         let database = await mysql.connect();
         
         // HER SKAL JEG LAVE EN TRY AND CATCH.... SE NYESTE VIDEO.
         let result = await database.execute(`
            INSERT INTO messages
            SET
            message_name = ?, 
            message_email = ?, 
            message_subject = ?, 
            message_text = ?, 
            message_date = ?`
            , [name, email, subject, message, contactDate]
         );

         // affected rows er større end nul, hvis en (eller flere) række(r) blev indsat
         if (result[0].affectedRows > 0) {
            returnMessageArray.push('Tak for din besked, vi vender tilbage hurtigst muligt');

         } else {
            returnMessageArray.push('Din besked blev ikke modtaget.... ');
         }

         let categories = await getCategories(); 

         database.end();

         res.render('contact', {
            'categories': categories,
            // dette er ikke den helt korrekte løsning (push'en!)
            'returnMessageArray': returnMessageArray.join(', '),
            // values er kun til test, her. den skal udkommenteres når alt virker.
            // 'values': req.body
         });

         // FORM VALIDERING SERVERSIDE SLUTTER

      }

   });

   app.get('/about', async (req, res, next) => {

      let database = await mysql.connect();

      // NB BEMÆRK BACKTICKS FOR LINJESKIFT, sådan får man fat i de relaterede tabeller:
      let [categories] = await database.execute(`
         SELECT * FROM newscategories
      `);

      // WIDGETS
      let popularnews = await getMostPopularNews();
      let latestpostswidget = await getLatestPostsWidget();

      database.end();

      res.render('about', {
         "title" : "The News Paper - News & Lifestyle Magazine Template",
         "page" : "About",
         "categories" : categories,
         // widgets:
         "latestposts" : latestpostswidget,
         "mostpopular" : popularnews,
      });
   });

   // her tilføjes et ekstra endpoint til siden vha /:
   // fx: /categories-post/3. Her er 3 = parameter værdien, 
   // som er tilgængelig i route koden via req.params.category_id
   // app.get('/categories-post/:category_id', async (req, res, next) => {
   //    res.send(req.params.category_id); // for demonstrationens skyld! 
   //    // her kan alle kategoriens artikler hentes via parameter værdien (ID)...
   // });
   
   app.get('/categories-post/:categoryID', async (req, res, next) => {

      let database = await mysql.connect();

      let categories = await getCategories();

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
      let latestPostWidget = await getLatestPostsWidget()
      let popularnews = await getMostPopularNews();
      let latestCommentsWidget = await getCommentWidget();

      database.end();

      res.render('categories-post', {
         "title" : "The News Paper - News & Lifestyle Magazine Template",
         "page" : "Categories-post",
         "selectednews" : selectednews,
         "categories" : categories,
         // nb newspicks er begrænset til 4 i templaten.
         "popularnewspick" : popularnews,
         // widgets:
         "latestposts" : latestPostWidget,
         "mostpopular" : popularnews,
         "latestcommentswidget" : latestCommentsWidget,
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
      let popularnews = await getMostPopularNews();
      let latestpostswidget = await getLatestPostsWidget();
      let latestCommentsWidget = await getCommentWidget();

      database.end();

      res.render('author-posts', {
         "title" : "The News Paper - News & Lifestyle Magazine Template",
         "page" : "author-posts",
         "selectedauthor" : selectedauthor,
         // widgets:
         "latestposts" : latestpostswidget,
         "latestcommentswidget" : latestCommentsWidget,
         "mostpopular" : popularnews,
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

      let editorspicks = await getEditorsPicks();
      
      // widgets:
      let popularnews = await getMostPopularNews();
      let latestpostswidget = await getLatestPostsWidget();
      let latestCommentsWidget = await getCommentWidget();

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
         "latestcommentswidget" : latestCommentsWidget,
         "comments" : comments
      });
   });

};