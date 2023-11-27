const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const langdetect = require('langdetect');
const Sentiment = require('sentiment');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const TextModel = mongoose.model('Text', {
  content: String,
});

app.post('/analyze', async (req, res) => {
  const { content } = req.body;


  const newText = new TextModel({ content });
  await newText.save();


  const lang = langdetect.detect(content);

  
  const sentiment = new Sentiment();
  const result = sentiment.analyze(newText.content);

 
  let sentimentCategory, emoji;
  if (result.score > 0) {
    sentimentCategory = 'happy';
    emoji = '😊';
  } else if (result.score < 0) {
    sentimentCategory = 'sad';
    emoji = '😢';
  } else {
    sentimentCategory = 'neutral';
    emoji = '😐';
  }

  res.json({ sentiment: sentimentCategory, emoji });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
