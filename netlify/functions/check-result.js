const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { ctrl_no, roll_no } = JSON.parse(event.body);
  const resultsPath = path.join(__dirname, '..', '..', 'data', 'results.json');
  
  try {
    const data = fs.readFileSync(resultsPath, 'utf8');
    const results = JSON.parse(data);
    const result = results.find(r => 
      (ctrl_no && ctrl_no.trim() && r.ctrl_no === ctrl_no.trim()) || 
      (roll_no && roll_no.trim() && r.roll_no === roll_no.trim())
    );
    
    if (result) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      };
    } else {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Not found' })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};
