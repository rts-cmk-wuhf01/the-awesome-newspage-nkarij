module.exports = (app) => {

   let data = {
      // NB SÆT FLERE DATASÆT IND I NEWS
   "featured2" : [
      {
         "category" : "Finance",
         "text" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu metus sit amet odio sodales placerat. Sed varius leo ac..."
      },
      {
         "category" : "Finance",
         "text" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu metus sit amet odio sodales placerat. Sed varius leo ac..."
      },     
   ],
   "relatednews" : [
      {  
         "category" : "Finance",
         "text" : "Dolor sit amet, consectetur adipiscing elit. Nam eu metus sit amet odio sodales placer. Sed varius leo ac..."
      },
      {  
         "category" : "Finance",
         "text" : "Dolor sit amet, consectetur adipiscing elit. Nam eu metus sit amet odio sodales placer. Sed varius leo ac..."
      },
      {  
         "category" : "Finance",
         "text" : "Dolor sit amet, consectetur adipiscing elit. Nam eu metus sit amet odio sodales placer. Sed varius leo ac..."
      },
      {  
         "category" : "Finance",
         "text" : "Dolor sit amet, consectetur adipiscing elit. Nam eu metus sit amet odio sodales placer. Sed varius leo ac..."
      },
   ],
   "news" : [
      {
         "category" : "Finance",
         "title" : "Financial news: A new company is born today at the stock market",
         "datetime" : new Date('2019-01-14 07:00:14')
      }, 
      {
         "category" : "Politics",
         "title" : "Sed a elit euismod augue semper congue sit amet ac sapien.",
         "datetime" : new Date('2019-02-13 07:00:14')
      },
      {
         "category" : "Health",
         "title" : "Pellentesque mattis arcu massa, nec fringilla turpis eleifend id.", 
         "datetime" : new Date('2019-03-12 07:00:14')
      },
      {
         "category" : "Finance",
         "title" : "Augue semper congue sit amet ac sapien. Fusce consequat.",
         "datetime" : new Date('2019-04-11 07:00:14')
      },
      {
         "category" : "Travel",
         "title" : "Pellentesque mattis arcu massa, nec fringilla turpis eleifend id.", 
         "datetime" : new Date('2019-05-10 07:00:14')
      },
      {
         "category" : "Politics",
         "title" : "Augue semper congue sit amet ac sapien. Fusce consequat.",
         "datetime" : new Date('2019-06-09 07:00:14')
      }
   ],
   "popularnews" : [
      {
         "rank" : "1",
         "title" : "Financial news: A new company is born today at the stock market",
         "datetime" : new Date('2019-01-14 07:00:14')
      }, 
      {
         "rank" : "2",
         "title" : "Sed a elit euismod augue semper congue sit amet ac sapien.",
         "datetime" : new Date('2019-02-13 07:00:14')
      },
      {
         "rank" : "3",
         "title" : "Pellentesque mattis arcu massa, nec fringilla turpis eleifend id.", "datetime" : new Date('2019-03-12 07:00:14')
      },
      {
         "rank" : "4",
         "title" : "Augue semper congue sit amet ac sapien. Fusce consequat.",  
         "datetime" : new Date('2019-04-11 07:00:14')
      }
   ],
   "latestcomments" : [
      {
         "name" : "Jamie Smith",
         "title" : "Facebook is offering facial recognition.",
         "datetime" : new Date('2019-01-14 07:00:14')
      }, 
      {
         "name" : "Jamie Smith",
         "title" : "Facebook is offering facial recognition.",
         "datetime" : new Date('2019-02-13 07:00:14')
      },
      {
         "name" : "Jamie Smith",
         "title" : "Facebook is offering facial recognition.",
         "datetime" : new Date('2019-03-12 07:00:14')
      },
      {
         "name" : "Jamie Smith",
         "title" : "Facebook is offering facial recognition.",
         "datetime" : new Date('2019-04-11 07:00:14')
      }
   ]
} // data ended

   app.get('/', (req, res, next) => {
      
      let products = [
         {
            name : "Produkt 1",
            price : 100,
            image : "/img/IMG/food/cranberries-small.jpeg"
         },    
         {
            name : "Produkt 2",
            price : 200,
            image : "/img/IMG/food/abrikoser-small.jpeg"
         }
      ]
      
      res.render('home', {
         "allProducts" : products,
         "title" : "The News Paper - News & Lifestyle Magazine Template",
         "page" : "Home",
         "data" : data
      });
   });

   app.get('/contact', (req, res, next) => {
      res.render('contact', {
         "title" : "The News Paper - News & Lifestyle Magazine Template",
         "page" : "Contact"
      });
   });

   app.get('/about', (req, res, next) => {
      res.render('about', {
         "title" : "The News Paper - News & Lifestyle Magazine Template",
         "page" : "About"
      });
   });

   app.get('/categories-post', (req, res, next) => {
      // HER I SERVERFILEN ELLER APP.JS SKAL MAN ALTID BRUGE APP.LOCALS TIL  
      // DATEANDTIME MODULET. DET SKAL MAN IKKE I SIN EJS
      res.render('categories-post', {
         "title" : "The News Paper - News & Lifestyle Magazine Template",
         "page" : "Categories-post",
         "data" : data
      });

   });

   app.get('/single-post', (req, res, next) => {

      res.render('single-post', {
         "title" : "The News Paper - News & Lifestyle Magazine Template",
         "page" : "Single-post",
         "data" : data
      });
   });

};