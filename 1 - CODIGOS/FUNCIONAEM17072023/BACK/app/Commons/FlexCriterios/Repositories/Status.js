const StatusModel = use("App/Models/Mysql/FlexCriterios/Status");

class Status {
  async getStatus() {
    const consulta = await StatusModel.all();

    return consulta?.toJSON() ?? null;
  }
}

module.exports = Status;
