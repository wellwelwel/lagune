import express from 'express';
import { addContact, listContacts } from './contacts.js';
import { toCsv } from './export.js';

const app = express();

app.use(express.json({ limit: '10kb' }));

app.post('/contacts', (req, res) => {
  const { name, email, company } = req.body;

  res.status(201).json(
    addContact({
      name: String(name),
      email: String(email),
      company: String(company),
    })
  );
});

app.get('/contacts.json', (_req, res) => {
  res.json(listContacts());
});

app.get('/contacts.csv', (_req, res) => {
  res.type('text/csv').attachment('contacts.csv').send(toCsv(listContacts()));
});

app.listen(3000);
