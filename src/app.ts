
import express from 'express';
import staffRouter from './routes/staffRoute';
import userRouter from './routes/userRoute';
import patientRouter from './routes/patientRoute';
import loginRouter from './routes/loginRoute';
import cors from 'cors';

const verifyJWT = require('./middleWare/verifyJWT');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT ||10000;

//built-in middleware for json
app.use(express.json());



// app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // allowedHeaders: ['Content-Type'],
  credentials: true,
}));

app.use('/login', loginRouter);


app.use('/staff', staffRouter);
app.use('/patient', patientRouter);

app.use(verifyJWT);
// EMR Paths
app.use('/user',userRouter );


// app.use('/logedIn', logedIn);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});