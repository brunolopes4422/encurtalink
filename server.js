// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = 'mongodb+srv://brunolopes4422:290793290793@cluster0.9a7qjav.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const linkSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: String,
  expirationDate: Date,
  clicks: { type: Number, default: 0 },
});

const Link = mongoose.model('Link', linkSchema);

app.post('/shorten', async (req, res) => {
  const { originalUrl, expirationDate } = req.body;
  const shortUrl = Math.random().toString(36).substring(7);
  const link = new Link({ originalUrl, shortUrl, expirationDate });
  await link.save();
  res.json({ shortUrl });
});

app.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;
  const link = await Link.findOne({ shortUrl });

  if (link) {
    link.clicks++;
    await link.save();
    res.redirect(link.originalUrl);
  } else {
    res.status(404).send('Link not found');
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
