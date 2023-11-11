'use strict';
const Evento = use("App/Models/Mysql/Ambiencia/Evento.js");

class EventoRepository {
  async getEventoById(idEvento) {
    const evento = await Evento.find(idEvento)

    if(evento) {
      return evento.toJSON();
    }
    return evento;
  }
}

module.exports = EventoRepository;