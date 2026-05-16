const axios = require('axios');

async function testFloriography() {
  try {
    const res = await axios.post('http://localhost:5000/api/flower-language', {
      flowers: [{ name: 'Rose' }, { name: 'Lily' }],
      occasion: 'Birthday'
    });
    console.log('Response:', res.data);
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}

testFloriography();
