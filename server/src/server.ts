import dotenv from 'dotenv';
import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

dotenv.config();
// Import the routes
import routes from './routes/index.js';
import logRequest from './middleware/logRequest.js';

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'dist' folder
app.use(express.static('dist'));
app.use('/db', express.static(path.join(__dirname, 'db')));
// Middleware to parse JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logRequest);
app.use(express.static('../client/dist'));
// Connect routes
app.use(routes);
// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
