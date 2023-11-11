/**
 * 3 - Lidar com o envio do formulário: na função handleSubmit, você normalmente fará uma chamada de API ou executará qualquer operação 
 * de banco de dados necessária para incrementar o valor do campo de texto. As especificidades desta etapa dependem da tecnologia de back-end que 
 * você está usando. Você pode usar estruturas como Express.js ou Django para lidar com a lógica do lado do servidor.
 * Se você estiver usando uma API RESTful, normalmente enviará uma solicitação POST para um endpoint específico com o valor atualizado. 
 * O código do lado do servidor manipulará a operação de incremento e atualizará o campo de banco de dados correspondente.
 * 
 * Aqui está um exemplo de como você pode usar a API de busca para fazer uma solicitação POST para um endpoint do servidor:
 */

// Update the handleSubmit function
const handleSubmit = (event) => {
    event.preventDefault();
  
    // Make a POST request to the server endpoint
    fetch('/api/increment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value: textFieldValue }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the server if needed
        console.log(data);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  
    // Reset the text field value
    setTextFieldValue('');
  };