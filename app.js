const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

//database connection
const db = require('./config/database')

const app = express();

//HandleBars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine','handlebars');

//Body parse
app.use(bodyParser.urlencoded({extended:false}));

//Set static folder
app.use(express.static(path.join(__dirname,'public')));

//Test Db
db.authenticate().then(()=>console.log('Db connected'))
    .catch(err=>console.log(err));



const PORT = process.env.PORT || 5005;

app.get('/' , (req , res)=>{res.render('index',{layout: 'landing'})});

//Product Routes
app.use('/products', require('./routes/products'))

app.listen(PORT , console.log(`Server started on ${PORT}`));
