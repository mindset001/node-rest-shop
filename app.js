const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser' );
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
mongoose.connect("mongodb+srv://mindset001:"+ process.env.MONGO_ATLAS_PW +"@node-rest-shop-joare.mongodb.net/test?retryWrites=true&w=majority",
{
    // useMongoClient: true,
     useNewUrlParser: true,
     useUnifiedTopology: true
     }
);
mongoose.Promise = global.Promise;

// app.use((req, res, next) => {
//     res.status(200).json({
//         message: 'It works!'
//     });
// });

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
// app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        "Access-Control-Allow-Headers",
        "origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTION') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({}); 
    }
    next();
});

//routes which should handle request
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

//handling error 
app.use((req, res, next) =>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    });
});

module.exports = app;