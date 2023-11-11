const { getListaComitesAdm } = use("App/Commons/Arh/dadosComites");

const getComitesAdm = async () => {
  const comite = await getListaComitesAdm(prefixo);

  return comite;
};

export { getComitesAdm };
