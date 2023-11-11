const exception = use('App/Exceptions/Handler');
const Status = use('App/Models/Mysql/Designacao/Status');
const _ = require('lodash');

async function getStatus() {
  try {
    let status = await Status.all();

    status = status.toJSON();

    return status;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getStatus;
