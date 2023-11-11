/**
 * Com base no lote, retorna o status do lote junto com o estado que os botões deveriam estar
 */
export const getStatus = (/** @type {import('.').LoteRevogacoes} */ lote) => {
  const allEnviados = lote.items.every((i) => i.cartorio);
  const { assinaturaDigital, videoconferencia } = lote.infoLote;

  if (!allEnviados) {
    return {
      status: 'Aguardando envio ao cartório',
      assinatura: false,
      video: false,
    };
  }

  if (!assinaturaDigital) {
    return {
      status: 'Aguardando assinatura',
      assinatura: true,
      video: false,
    };
  }

  if (!videoconferencia) {
    return {
      status: 'Aguardando videoconferência',
      assinatura: true,
      video: true,
    };
  }

  const allCadastrado = assinaturaDigital && videoconferencia && lote.items.every((i) => i.viaDigital && i.viaFisica);

  if (!allCadastrado) {
    return {
      status: 'Aguardando cadastros',
      assinatura: true,
      video: true,
    };
  }

  // teoricamente, nunca deve chegar aqui
  // porque quando estiver tudo cadastrado
  // o backend não retornaria o lote

  // talvez seja usado apenas se for implementado
  // algo para verificar lotes finalizados
  return {
    status: 'Finalizado',
    assinatura: true,
    video: true,
  };
};
