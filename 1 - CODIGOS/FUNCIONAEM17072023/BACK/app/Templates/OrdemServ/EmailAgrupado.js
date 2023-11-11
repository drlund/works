const Env = use('Env');
const LINK_MINHAS_ORDENS = Env.get('FRONTEND_URL') + "ordemserv/minhas-ordens";
const LINK_ORDEM_ASSINAR = Env.get('FRONTEND_URL') + "ordemserv/assinar-ordem/";
const LINK_ORDEM_CIENCIA = Env.get('FRONTEND_URL') + "ordemserv/dar-ciencia-ordem/";

const Styles = {
  bgHeader: '#1890ff'
}

const { renderHeader, renderFooter } = use('App/Templates/OrdemServ/Commons');
const headerSection = renderHeader(Styles.bgHeader);
const footerSection = renderFooter();

function generateTemplateAgrupado({nomeGuerra, ocorrencias }) {
  let templateOcorrencias = "";

  function criaNomeSecao(nomeSecao) {
    return `
      <tr>
        <td style="padding-top: 15px;">
          <table style="border-collapse: collapse; width:95%; margin: 0 auto; color: #565656; border:none;" border="0">
            <tbody>
              <tr style="height: 26px; border-bottom: 1px solid #ccc;">
                <td style="width: 15%; height: 26px;"><span><strong>${nomeSecao}</strong></span></td>                
              </tr>
            </tbody>
          </table>  
        </td>
      </tr>`
  }

  function criaSeparacaoSecao() {
    return `
      <tr>
        <td style="padding-top: 15px;"></td>
      </tr>`
  }

  for (let ocorrencia of ocorrencias ) {
    templateOcorrencias += criaNomeSecao(ocorrencia.nomeSecao);

    for (let registro of ocorrencia.registros) {
      let informacoes = registro.informacao;
      //verifica se deve inserir o numero da ordem no final
      let inserirNumeroOrdem = informacoes.indexOf("{LINK_MINHAS_ORDENS}") === -1;
      
      informacoes = informacoes.replace("{LINK_MINHAS_ORDENS}", `<a href="${LINK_MINHAS_ORDENS}" target="_blank" rel="noopener noreferrer">clicando aqui.</a>`);
      informacoes = informacoes.replace("{LINK_ORDEM_ASSINAR}", `<a href="${LINK_ORDEM_ASSINAR}` + (inserirNumeroOrdem ? registro.id_ordem : '') + `" target="_blank" rel="noopener noreferrer">clicando aqui.</a>`);
      informacoes = informacoes.replace("{LINK_ORDEM_CIENCIA}", `<a href="${LINK_ORDEM_CIENCIA}` + (inserirNumeroOrdem ? registro.id_ordem : '') + `" target="_blank" rel="noopener noreferrer">clicando aqui.</a>`);

      templateOcorrencias += `
        <tr>
          <td>      
            <div style="border: 1px solid #ccc; background-color:#ffffff; width:93%; margin: 0 auto; padding: 10px;">
              <table style="border-collapse: collapse; width:100%; font-size: 14px; color: #565656; border:none;" border="0">
                <tbody style="font-family: helvetica, sans-serif;">

                  <tr style="height: 26px; border-bottom: 1px solid #ccc;">
                    <td style="width: 15%; height: 26px;"><span><strong>N&uacute;mero</strong>:</span></td>
                    <td style="width: 85%; height: 26px;"><span>${registro.numero}</span></td>
                  </tr>

                  <tr style="height: 26px; border-bottom: 1px solid #ccc;">
                    <td style="width: 15%; height: 26px;"><span><strong>T&iacute;tulo</strong>:</span></td>
                    <td style="width: 85%; height: 26px;"><span>${registro.titulo}</span></td>
                  </tr>

                  <tr style="height: 26px; border-bottom: 1px solid #ccc;">
                    <td style="width: 15%; height: 26px;"><span><strong>Responsável</strong>:</span></td>
                    <td style="width: 85%; height: 26px;"><span>${registro.responsavel}</span></td>
                  </tr>

                  <tr style="height: 26px; border-bottom: 1px solid #ccc;">
                    <td style="width: 15%; height: 26px;"><span><strong>Ação</strong>:</span></td>
                    <td style="width: 85%; height: 26px;"><span>${registro.acao}</span></td>
                  </tr>

                  <tr style="height: 26px; border-bottom: 1px solid #ccc;">
                    <td style="width: 15%; height: 26px;"><span><strong>Motivo</strong>:</span></td>
                    <td style="width: 85%; height: 26px;"><span>${registro.motivo}</span></td>
                  </tr>

                  <tr style="height: 26px; border-bottom: 1px solid #ccc;">
                    <td style="width: 15%; height: 26px;"><span><strong>Informações</strong>:</span></td>
                    <td style="width: 85%; height: 26px;"><span>${informacoes}</span></td>
                  </tr>

                </tbody>
              </table>
            </div>
          </td>
        </tr>`;

      templateOcorrencias += criaSeparacaoSecao()
    }

    templateOcorrencias += criaSeparacaoSecao()
  }


  return `
    <div style="padding-top: 30px;">

      ${headerSection}

      <div style="border:1px solid #ccc; border-bottom:none; width:80%; margin: 0 auto; top: 20px; background: #f9f9ff;">
        <table style="border-collapse: collapse; width: 100%;">
          <tbody style="font-size: 14px; color: #565656; font-family: helvetica, sans-serif;">
            <tr>
              <td style="padding-top: 15px;">
                <table style="border-collapse: collapse; width:95%; margin: 0 auto; color: #565656; border:none;" border="0">
                  <tbody>
                    <tr style="height: 27px;">
                      <td style="width: 100%; height: 27px;" colspan="2"><span style="">Caro(a) <strong>${nomeGuerra}</strong>,</span></td>
                    </tr>

                    <tr style="height: 26px;">
                      <td style="width: 100%; height: 26px;" colspan="2">
                        <span style="font-family: helvetica, sans-serif;">
                          A(s) Ordem(ns) de Servi&ccedil;o abaixo precisam de alguma ação da sua parte.
                        </span>
                      </td>
                    </tr>

                  </tbody>
                </table>  
              </td>
            </tr>

            ${templateOcorrencias}

          </tbody>
        </table>
      </div>

      <div style="width:80%; margin: 0 auto; background-color: #eaeaf2; height: 135px; font-family: helvetica, sans-serif; border: 1px solid #ccc; border-top: 2px solid #ccc;">
        ${footerSection}    
      </div>

    </div>`
}

module.exports = generateTemplateAgrupado