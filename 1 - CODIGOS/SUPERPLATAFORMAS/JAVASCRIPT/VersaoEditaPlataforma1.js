  const editarPlataforma = async (values, isPlataforma, fetchData) => {
    try {
      const payload = isPlataforma
        ? {
            id: values.id,
            nome: values.nome,
            matriculaResponsavel: values.responsavel.matriculaResponsavel,
            nomeResponsavel: values.responsavel.nomeResponsavel,
          }
        : {
            nucleos: values.nucleos.map((nucleo) => ({
              id: nucleo.id,
              nome: nucleo.nome,
              uor: nucleo.uor,
              nomeResponsavel: nucleo.responsavel,
              ativo: nucleo.ativo,
            })),
          };

      console.log('Matricula: ', values.responsavel.matriculaResponsavel);
      console.log('Responsável: ', values.responsavel.nomeResponsavel);

      await patchPlataforma(payload);

      setIsModalVisible(false);

      fetchData();
    } catch (error) {
      message.error('Erro ao salvar os dados da plataforma ', error);
    }
  };