import { renderChart } from 'chart-kit';
import express from 'express';
import { layout } from 'pdf-layout';

const app = express();

app.use(express.json({ limit: '100kb' }));

app.post('/reports', (req, res) => {
  const chart = renderChart(req.body.series);
  const document = layout({ title: req.body.title, pages: [chart] });

  res.type('application/pdf').send(document);
});

app.listen(3000);
