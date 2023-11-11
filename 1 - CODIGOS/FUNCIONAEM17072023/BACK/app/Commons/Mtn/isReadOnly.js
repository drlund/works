const hasPermission = use('App/Commons/HasPermission')


const isReadOnly = async (dadosUsuario) => {
  const isAdm = await hasPermission({
    nomeFerramenta: 'MTN',
    dadosUsuario,
    permissoesRequeridas: ['MTN_ADM'],      
  });

  const isReadOnly = await hasPermission({
    nomeFerramenta: 'MTN',
    dadosUsuario,
    permissoesRequeridas: ['MTN_READ_ONLY'],
    
  });

  return (isReadOnly && !isAdm);
}

module.exports = isReadOnly;
