const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  const tendersPath = path.join(__dirname, '..', '..', 'data', 'tenders.json');
  
  try {
    const data = fs.readFileSync(tendersPath, 'utf8');
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error reading tenders data' }),
    };
  }
};
