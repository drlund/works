'use strict'

const Form = use('App/Models/Form')

class FormRepository {
  async findById(id) {
    return await Form.findOrFail(id)
  }

  async update(form) {
    await form.save()
  }
}

module.exports = FormRepository
