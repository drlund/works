'use strict'

const Form = use('App/Models/Form')

class FormController {
  async edit({ request, params }) {
    try {
      const { id } = params // Obtém o ID do registro a ser editado
      const { novoTexto } = request.post() // Obtém o novo texto do corpo da solicitação

      const form = await Form.findOrFail(id) // Recupera o registro existente

      form.texto += '\n' + novoTexto // Adiciona o novo texto ao final do texto existente
      await form.save() // Salva as alterações no banco de dados

      return response.status(200).json({ message: 'Formulário atualizado com sucesso' })
    } catch (error) {
      return response.status(500).json({ error: 'Ocorreu um erro ao atualizar o formulário' })
    }
  }
}

module.exports = FormController
