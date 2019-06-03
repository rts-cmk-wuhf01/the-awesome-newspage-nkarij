module.exports = (app) => {

   let data = {
      // NB JEG BRUGER SAMME DATGA TIL BÅDE HOME OG CATEGORIES, MEN DER ER FLERE
      // ARTIKLER I CATEGORIES END I HOME. MEN NU ER DETTE BARE ET EKSEMPEL.
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
      // let date1 = app.locals.dateAndTime.parse('2015/01/02 23:14:05', 'YYYY/MM/DD HH:mm:ss');
      // let formattedDate = app.locals.dateAndTime.format(date1, 'YYYY/MM/DD HH:mm:ss');
      // console.log(formattedDate);
      res.render('categories-post', {
         "title" : "The News Paper - News & Lifestyle Magazine Template",
         "page" : "Categories-post",
         "data" : data
      });

   });

   app.get('/single-post', (req, res, next) => {
      res.render('single-post', {
         "title" : "The News Paper - News & Lifestyle Magazine Template",
         "page" : "Single-post"
      });
   });

};