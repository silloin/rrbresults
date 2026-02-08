const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from root directory
app.use(express.static(path.join(__dirname, '..')));

// Route to check result
app.post('/check-result', (req, res) => {
  const { ctrl_no, roll_no } = req.body;

  console.log(`🔍 Searching for - Control No: '${ctrl_no}', Roll No: '${roll_no}'`);

  const resultsPath = path.join(__dirname, '..', 'data', 'results.json');
  fs.readFile(resultsPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }

    const results = JSON.parse(data);
    const result = results.find(r => 
      (ctrl_no && r.ctrl_no === ctrl_no.trim()) || 
      (roll_no && r.roll_no === roll_no.trim())
    );

    if (result) {
      console.log("✅ Found:", result.roll_no);
      res.redirect(`/a?roll_no=${result.roll_no}`);
    } else {
      console.log("❌ Not Found in Database");
      res.redirect('/notfound.html');
    }
  });
});

// Route to get tenders data
app.get('/api/tenders', (req, res) => {
  const tendersPath = path.join(__dirname, '..', 'data', 'tenders.json');
  fs.readFile(tendersPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error reading tenders data' });
    }
    res.json(JSON.parse(data));
  });
});

// Route to get result data as JSON (API)
app.get('/api/result/:roll_no', (req, res) => {
  const resultsPath = path.join(__dirname, '..', 'data', 'results.json');
  fs.readFile(resultsPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }

    const results = JSON.parse(data);
    const result = results.find(r => r.roll_no === req.params.roll_no);
    
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: 'Result not found' });
    }
  });
});

// Routes for clean URLs
app.get('/about-us', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'about_us.html'));
});

app.get('/employment-notices', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'employment_notices.html'));
});

app.get('/instructions', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'instructions.html'));
});

app.get('/tender', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'tender.html'));
});

app.get('/result', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Result.html'));
});

app.get('/check-result', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'CheckResult.html'));
});

app.get('/check-result-2', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'CheckResult-2.html'));
});

app.get('/archive', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'archieve.html'));
});

app.get('/contact-us', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'contact_us.html'));
});

app.get('/not-found', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'notfound.html'));
});

app.get('/delhi-result', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'delhiresult.html'));
});

app.get('/a', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'a.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
