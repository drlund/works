const exception = use("App/Exceptions/Handler");
const Template = use("App/Models/Mysql/Designacao/Template");
const _ = require("lodash");

async function getTemplate({id = null, id_tipo_historico = null, valido = null}) {
  try {
    let templates = Template.query()
      .with("tipo_historico")
      .with("matr_criacao")
      .with("matr_alteracao");

    if (id) {
      templates.where("id", parseInt(id));
    }

    if (id_tipo_historico) {
      templates.where("id_tipo_historico", parseInt(id_tipo_historico));
    }

    if (valido === 0 || valido === 1) {
      templates.where("valido", valido);
    }

    templates = await templates.fetch();

    templates = templates.toJSON();

    templates = templates.map((template) => {
      switch (template.valido) {
        case 1:
          template.valendo = "SIM";
          break;
        default:
          template.valendo = "NÃO";
      }

      return template;
    });

    return templates;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getTemplate;
