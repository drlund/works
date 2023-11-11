const getPrimGestor = use("App/Commons/Designacao/getPrimGestor");

const exception = use('App/Exceptions/Handler');

async function getAdminEmail(prefixo) {
  try {

    const admin = await getPrimGestor(prefixo);

    return admin.email;
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getAdminEmail;
