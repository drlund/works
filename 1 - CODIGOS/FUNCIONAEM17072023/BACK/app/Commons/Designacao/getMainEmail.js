const exception = use('App/Exceptions/Handler');
const Mstd503e = use('App/Models/Mysql/Mstd503e');

async function getMainEmail(uor) {
  try {
    const emails = await Mstd503e.query()
      .where('CodigodaUOR', uor)
      .where('IndEmailPrincipal', 'S')
      .first();

    if (emails) {
      return emails.toJSON();
    }

    return [];
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getMainEmail;
