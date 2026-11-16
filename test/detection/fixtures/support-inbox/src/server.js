import express from 'express';
import { attachments } from './routes/attachments.js';
import { avatars } from './routes/avatars.js';

const app = express();

app.use(express.static('public'));
app.use('/tickets', attachments);
app.use('/avatars', avatars);

app.listen(3000);
