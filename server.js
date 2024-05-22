require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const { sequelize } = require('./models/index');

app.use(express.json());

const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const invoiceRoute = require('./routes/invoiceRoute');


const PORT = process.env.PORT || process.env.DB_PORT;

sequelize
    .authenticate()
    .then(() => {
        console.log('Connected to the database');
        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

app.use(morgan('dev'));
app.use(bodyParser.json({ limit: "25mb" }));
app.use(bodyParser.urlencoded({
    limit: "25mb", extended: true
}));
app.use(cookieParser());

// Configure CORS
const corsOptions = {
    origin: ['http://localhost:3000', 'https://invoice-manager-ketsi.vercel.app'],
    methods: 'GET,PUT,POST,DELETE',
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  };
  app.use(cors(corsOptions));
  

app.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:3000', 'https://invoice-manager-ketsi.vercel.app'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });
  
app.use(errorHandler);

app.get("/", (req, res) => {
    res.send("Welcome to `Lepton Games`!");
});
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/invoice', invoiceRoute);
