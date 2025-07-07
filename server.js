const express = require ('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app =express();
const PORT = Process.env.PORT ||3000;

app.use(bodyParser.json());
app.use(express.static('public'));
const DATA_FILE = path.join(__dirname, 'data', 'messages.json');

app.get('/api/messages', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading messages.');
    res.json(JSON.parse(data));
  });
});

app.post('/api/messages', (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) return res.status(400).send('Missing name or message.');

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    let messages = [];
    if (!err && data) messages = JSON.parse(data);

    const newMessage = { name, message, date: new Date().toISOString() };
    messages.push(newMessage);

    fs.writeFile(DATA_FILE, JSON.stringify(messages, null, 2), err => {
      if (err) return res.status(500).send('Error saving message.');
      res.status(201).json(newMessage);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});