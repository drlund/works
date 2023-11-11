'use strict'

const FormUseCase = use('App/UseCases/FormUseCase')

class FormController {
  constructor() {
    this.formUseCase = new FormUseCase(use('App/Repositories/FormRepository'))
  }

  async edit({ request, response, params }) {
    try {
      const { id } = params
      const { novoTexto } = request.post()

      await this.formUseCase.editForm(id, novoTexto)

      return response.status(200).json({ message: 'Formulário atualizado com sucesso' })
    } catch (error) {
      return response.status(500).json({ error: 'Ocorreu um erro ao atualizar o formulário' })
    }
  }
}

module.exports = FormController
