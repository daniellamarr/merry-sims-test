import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import routes from './src/routes/index'


// Set up the express app
const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Versioning and Routes

app.use('/api/v1', routes);



// Setup a default catch-all route
app.use('*', (req, res, next) => {
  res.status(404).json({
    message: 'Page not found',
  });
  next();
});

dotenv.config();

const port = process.env.PORT || 9090;
app.listen(port, () => {
  console.log(`App is running, check me out on http://localhost:${port}`);
});
export default app;
