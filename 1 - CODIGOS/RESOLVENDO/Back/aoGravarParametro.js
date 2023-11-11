async gravarParametro(novoParametro) {
    // Verifica se já existe um registro com os mesmos dados
    const registroExistente = await Parametro.findOne({  //essa função findOne não funciona no Adonis. Usar query(). etc.
        prefixoDestino: novoParametro.prefixoDestino, 
        comissaoDestino: novoParametro.comissaoDestino 
    });
  
    if (registroExistente) {
      // Verifica se o registro existente está ativo ou inativo
      if (registroExistente.ativo === '1') {
        // Registro existente está ativo, retornar erro de duplicidade
        throw new Error('O parâmetro existe e já está ativo.');
      } else {
        // Registro existente está inativo, reativá-lo
        registroExistente.ativo = '1';
        await registroExistente.save();
        return registroExistente;
      }
    } else {
      // Não existe um registro com os mesmos dados, salvar o novo parâmetro
      await novoParametro.save();
      return novoParametro;
    }
  }
  