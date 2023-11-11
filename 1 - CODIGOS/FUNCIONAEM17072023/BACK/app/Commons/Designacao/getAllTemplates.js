const exception = use('App/Exceptions/Handler');
const Template = use('App/Models/Mysql/Designacao/Template');
const _ = require('lodash');

async function getAllTemplates() {

  try {
    let templates = await Template.all();
    return templates;
  } catch(err) {
    throw new exception(err, 404);
  }

}

module.exports = getAllTemplates;