const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  const resultsPath = path.join(__dirname, '..', '..', 'data', 'results.json');
  const pathParts = event.path.split('/');
  const rollNo = pathParts[pathParts.length - 1];
  
  try {
    const data = fs.readFileSync(resultsPath, 'utf8');
    const results = JSON.parse(data);
    const result = results.find(r => r.roll_no === rollNo);
    
    if (result) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Result not found' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' }),
    };
  }
};
