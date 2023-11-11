/**
 * Lidar com a lógica do lado do servidor: No lado do servidor, você precisa lidar com a solicitação POST para o endpoint /api/increment. 
 * Dependendo da tecnologia de back-end que você estiver usando, a implementação será diferente. Aqui está um exemplo usando Express.js:
 */

const express = require('express');
const app = express();

// Parse JSON request body
app.use(express.json());

// Handle the POST request to /api/increment
app.post('/api/increment', (req, res) => {
  const { value } = req.body;

  // Increment the value in the database
  // Perform any necessary validation or security checks

  // Send a response back to the client
  res.json({ message: 'Value incremented successfully.' });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});