// Eks. på at loope et serverside array og udskrive det.

// NB allProducts skal egentlig sendes med fra routet til den relevante side.
// der bruges ikke bindestreg eller lighedstegn, når der ikke skal udskrives,
// dvs når scriptet bare skal læses/udføres

<% allProducts.forEach(product => { %>

    // product-instansen skal udskrives, derfor skal der sættes lighedstegn
    <div> <%= product.name %> </div>
    <div> <%= product.price %> </div>

<% }); %>

<% if(data != 'undefined') { %>
    <% data.keyword.forEach(item => { %>
    <% })  %>
<% } %> 


// SÅDAN SER ROUTET UD (SKAL STÅ I MODULE.EXPORTS)

module.exports = (app) => {
    app.get('/', (req, res, next) => {
        
        // sender products-objektet med i res.render objektet
        let products = [
            {
                name : "Produkt 1",
                price : 100
            },    
            {
                name : "Produkt 2",
                price : 200
            }
        ]
        
        res.render('home', {
            "allProducts" : products,
            "title" : "The News Paper - News & Lifestyle Magazine Template",
            "page" : "Home"
        });

    });
}