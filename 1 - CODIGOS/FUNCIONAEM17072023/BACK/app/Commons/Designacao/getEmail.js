const exception = use('App/Exceptions/Handler');
const Mstd503e = use('App/Models/Mysql/Mstd503e');

async function getEmail(uor) {
  try {
    let emails = await Mstd503e.query()
      .where('CodigodaUOR', uor)
      .fetch();

    emails = emails.toJSON();

    return emails;
  } catch(err) {
    throw new exception(err, 400);
  }
}

module.exports = getEmail;
