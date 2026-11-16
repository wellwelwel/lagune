import express from 'express';
import { download } from './download.js';
import { page } from './pages.js';

const app = express();

app.get('/download', download);
app.get('/pages/:name', page);

app.listen(3000);
