'use strict'

class FormUseCase {
  constructor(formRepository) {
    this.formRepository = formRepository
  }

  async editForm(id, novoTexto) {
    const form = await this.formRepository.findById(id)

    form.texto += '\n' + novoTexto

    await this.formRepository.update(form)
  }
}

module.exports = FormUseCase
