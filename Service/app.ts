/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */

import express from 'express';
import staffRouter from './regestiration/src/routes/staffRoute';
import userRouter from './regestiration/src/routes/userRoute';
import patientRouter from './regestiration/src/routes/patientRoute';
import loginRouter from './regestiration/src/routes/loginRoute';
import hl7Route from './regestiration/src/routes/hl7Router'
import cors from 'cors';
import emrRouter from './EMR2/src/routes/emrRouter';
// const verifyToken = require('./middleWare/verifyToken');
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

app.use('/hl7Route',hl7Route);
app.use('/login', loginRouter);
app.use('/EMR', emrRouter);
app.use('/staff', staffRouter);
app.use('/patient', patientRouter);
app.use('/user',userRouter );
// app.use(verifyToken);
// EMR Paths



// app.use('/logedIn', logedIn);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});


/*
// ######################################### TCP SERVER #########################################

const server = http.createServer(app);

// Setup CORS
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",  // This should match the URL of your client app
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('sendData', async (data) => {

    const parsedData = JSON.parse(data);
    // console.log(parsedData);
    const scenario = parsedData.scenario;
    delete parsedData["scenario"];

    let response;

    if (scenario === "createAppointment") {
        const id = parsedData.id;
        delete parsedData["id"];
        response = await createAppointment(parsedData, id);
    } else {
        response = await registerPatient(parsedData);
        console.log(response)

    }

    socket.write(JSON.stringify(response));
    });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(8080, () => {
  console.log('Listening on port 8080');
});*/