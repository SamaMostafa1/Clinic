
import express from 'express';
import staffRouter from './routers/staffRouter';
import userRouter from './routers/userRouter';
import patientRouter from './routers/patientRouter';
import loginRouter from './routers/loginRouter';
import cors from 'cors';

const verifyJWT = require('./middleWare/verifyJWT');

const app = express();
const port = process.env.PORT ||10000;

app.use(express.json());

app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // allowedHeaders: ['Content-Type'],
  credentials: true,
}));

app.use('/login', loginRouter);


app.use('/staff', staffRouter);

app.use(verifyJWT);
app.use('/user',userRouter );
app.use('/patient', patientRouter);

// app.use('/logedIn', logedIn);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});