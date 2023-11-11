'use strict'

module.exports = {
  AdvertenciaNormal = '#confidencial<p>' +
  'Sr. Gerente Geral/Superintendente,<p>' +
  `Seguem orientações para a impressão do Comunicado de Advertência, a ser aplicado ao funcionário <strong>{1} {2}</strong>, conforme encaminhamento da Dipes.<p>` +
  'Pontos a serem observados:<br>' +
  'a) O comunicado deverá ser impresso em duas vias: 1º do funcionário, 2º via do Banco. O comunicado deve ser acessado em ' +
  '<a href="https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas" target="_blank">https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas</a>;<br>' +
  'b) Deverá ser enviado, via malote e via aplicativo Demandas Gedip (<a href="https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas" target="_blank">' +
  'https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas</a>), a 2ª via do comunicado assinada pelo envolvido, ' +
  'imediatamente após o cumprimento, a fim de compor o dossiê;<br>' +
  'c) Observar as consequências da sanção aplicada a(o)  funcionário(a) conforme a IN 383-1 - seção Soluções do controle Disciplinar.<p>' +
  'O não cumprimento tempestivo das decisões deliberadas e a quebra de confidencialidade podem gerar riscos para o Banco e são passíveis de avaliação sob o aspecto disciplinar.<p>' +
  'Observar: A solução disciplinar aplicada a(o) funcionário(a) em afastamento regulamentar (licenças e cessões) ou férias, com exceção de demissão, ' +
  'deverá ser cumprida quando do seu retorno, após seu ciente no comunicado, inclusive para eventual aplicação de Responsabilização Pecuniária.<p><p>' +
  'Atenciosamente,<p><p>' +
  '__________________________<br>' +
  '<strong>Gerência de Riscos/MTN</strong><br>' +
  '<strong>Superintendência Administrativa</strong>', // 1=matricula, 2=NomeFuncionário,
  AdvertenciaCobranca = '#confidencial<p>' +
  'Sr. Gerente Geral/Superintendente,<p>' +
  'Informamos que, até a presente data, a medida, que vence em {1} não foi aplicada. Pedimos vossos préstimos em aplicar a medida julgada.<p>' +
  `Seguem orientações para a impressão do Comunicado de Advertência, a ser aplicado ao funcionário <strong>{2} {3}</strong>, conforme encaminhamento da Dipes.<p>` +
  'Pontos a serem observados:<br>' +
  'a) O comunicado deverá ser impresso em duas vias: 1º do funcionário, 2º via do Banco. O comunicado deve ser acessado em ' +
  '<a href="https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas" target="_blank">https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas</a>;<br>' +
  'b) Deverá ser enviado, via malote e via aplicativo Demandas Gedip (<a href="https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas" target="_blank">' +
  'https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas</a>), a 2ª via do comunicado assinada pelo envolvido, ' +
  'imediatamente após o cumprimento, a fim de compor o dossiê;<br>' +
  'c) Observar as consequências da sanção aplicada a(o)  funcionário(a) conforme a IN 383-1 - seção Soluções do controle Disciplinar.<p>' +
  'O não cumprimento tempestivo das decisões deliberadas e a quebra de confidencialidade podem gerar riscos para o Banco e são passíveis de avaliação sob o aspecto disciplinar.<p>' +
  'Observar: A solução disciplinar aplicada a(o) funcionário(a) em afastamento regulamentar (licenças e cessões) ou férias, com exceção de demissão, ' +
  'deverá ser cumprida quando do seu retorno, após seu ciente no comunicado, inclusive para eventual aplicação de Responsabilização Pecuniária.<p><p>' +
  'Atenciosamente,<p><p>' +
  '__________________________<br>' +
  '<strong>Gerência de Riscos/MTN</strong><br>' +
  '<strong>Superintendência Administrativa</strong>', // 1=prazoVencimento, 2=matricula, 3=NomeFuncionário
  AdvertenciaRetorno = '#confidencial<p>' +
  'Sr. Diretor/Gerente,<p>' +
  `Segue, em anexo, cópia digitalizada do Comunicado de Advertência, processo GEDIP nº {1} referente à aplicação da medida disciplinar ao funcionário <strong>{2} {3}</strong>.<p>` +
  'Atenciosamente,<p><p>' +
  '__________________________<br>' +
  '<strong>{4} {5}</strong><br>', // 1= numero Gedip, 2=Matrícula, 3=NomeFuncionário, 4=matrículaResponsável, 5=nomeResponsável
  TermoCienciaNormal = '#confidencial<p>' +
  'Sr. Gerente Geral/Superintendente,<p>' +
  `Seguem orientações para a impressão do Termo de Ciência, a serem aplicados ao funcionário <strong>{1} {2}</strong>, conforme encaminhamento da Dipes.<p>` +
  'Pontos a serem observados:<br>' +
  'a) A solução disciplinar aplicada a(o) funcionário(a) em afastamento regulamentar (licenças e cessões) ou férias, com exceção de demissão, deverá ser ' +
  'cumprida quando do seu retorno, após seu ciente no comunicado, inclusive para eventual aplicação de Responsabilização Pecuniária.<br>' +
  'b) O comunicado deverá ser impresso em duas vias: 1º do funcionário, 2º via do Banco. O comunicado deve ser acessado em ' +
  '<a href="https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas" target="_blank">https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas</a>;<br>' +
  'c) Deverá ser enviado, via malote e via aplicativo Demandas Gedip (<a href="https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas" target="_blank">' +
  'https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas</a>), a 2ª via do comunicado assinada pelo envolvido, ' +
  'imediatamente após o cumprimento, a fim de compor o dossiê;<br>' +
  'd) Observar as consequências da sanção aplicada a(o)  funcionário(a) conforme a IN 383-1 - seção Soluções do controle Disciplinar.<p>' +
  'O não cumprimento tempestivo das decisões deliberadas e a quebra de confidencialidade podem gerar riscos para o Banco e são passíveis de avaliação sob o aspecto disciplinar.<p><p>' +
  'Atenciosamente,<p><p>' +
  '__________________________<br>' +
  '<strong>Gerência de Riscos/MTN</strong><br>' +
  '<strong>Superintendência Administrativa</strong>', // 1=matricula, 2=NomeFuncionário,
  TermoCienciaCobranca = '#confidencial<p>' +
  'Sr. Gerente Geral/Superintendente,<p>' +
  'Informamos que, até a presente data, a medida, que vence em {1} não foi aplicada. Pedimos vossos préstimos em aplicar a medida julgada.<p>' +
  `Seguem orientações para a impressão do Termo de Ciência, a serem aplicados ao funcionário <strong>{2} {3</strong>, conforme encaminhamento da Dipes.<p>` +
  'Pontos a serem observados:<br>' +
  'a) A solução disciplinar aplicada a(o) funcionário(a) em afastamento regulamentar (licenças e cessões) ou férias, com exceção de demissão, deverá ser ' +
  'cumprida quando do seu retorno, após seu ciente no comunicado, inclusive para eventual aplicação de Responsabilização Pecuniária.<br>' +
  'b) O comunicado deverá ser impresso em duas vias: 1º do funcionário, 2º via do Banco. O comunicado deve ser acessado em ' +
  '<a href="https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas" target="_blank">https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas</a>;<br>' +
  'c) Deverá ser enviado, via malote e via aplicativo Demandas Gedip (<a href="https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas" target="_blank">' +
  'https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas</a>), a 2ª via do comunicado assinada pelo envolvido, ' +
  'imediatamente após o cumprimento, a fim de compor o dossiê;<br>' +
  'd) Observar as consequências da sanção aplicada a(o)  funcionário(a) conforme a IN 383-1 - seção Soluções do controle Disciplinar.<p>' +
  'O não cumprimento tempestivo das decisões deliberadas e a quebra de confidencialidade podem gerar riscos para o Banco e são passíveis de avaliação sob o aspecto disciplinar.<p><p>' +
  'Atenciosamente,<p><p>' +
  '__________________________<br>' +
  '<strong>Gerência de Riscos/MTN</strong><br>' +
  '<strong>Superintendência Administrativa</strong>',// 1=prazoVencimento, 2=matricula, 3=NomeFuncionário
  TermoCienciaRetorno = '#confidencial<p>' +
  'Sr. Diretor/Gerente,<p>' +
  `Segue, em anexo, cópia digitalizada do Termo de Ciência, processo GEDIP nº {1} referente à aplicação da medida disciplinar ao funcionário <strong>{2} {3}</strong>.<p>` +
  'Atenciosamente,<p><p>' +
  '__________________________<br>' +
  '<strong>{4} {5}</strong><br>', // 1= numero Gedip, 2=Matrícula, 3=NomeFuncionário, 4=matrículaResponsável, 5=nomeResponsável
  SuspensaoNormal = '#confidencial<p>' +
  'Sr. Gerente Geral/Superintendente,<p>' +
  `Seguem orientações para a impressão do Comunicado de Suspensão, a ser aplicado ao funcionário <strong>{1} {2}</strong>, conforme encaminhamento da Dipes.<p>` +
  'Pontos a serem observados:<br>' +
  'a) A solução disciplinar aplicada a(o) funcionário(a) em afastamento regulamentar (licenças e cessões) ou férias, com exceção de demissão, deverá ser ' +
  'cumprida quando do seu retorno, após seu ciente no comunicado, inclusive para eventual aplicação de Responsabilização Pecuniária.<br>' +
  'b) O comunicado deverá ser impresso em duas vias: 1º do funcionário, 2º via do Banco. O comunicado deve ser acessado em ' +
  '<a href="https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas" target="_blank">https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas</a>;<br>' +
  'c) Deverá ser enviado, via malote e via aplicativo Demandas Gedip (<a href="https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas" target="_blank">' +
  'https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas</a>), a 2ª via do comunicado assinada pelo envolvido, ' +
  'imediatamente após o cumprimento, a fim de compor o dossiê;<br>' +
  'd) Observar as consequências da sanção aplicada a(o)  funcionário(a) conforme a IN 383-1 - seção Soluções do controle Disciplinar.<p>' +
  'e) O funcionário suspenso está terminantemente proibido de acessar o ambiente de trabalho, bem como os sistemas informatizados, inclusive, por meio remoto ' +
  'e telefone corporativo, durante a vigência da suspensão, constituindo-se falta de suma gravidade o descumprimento desta determinação;<br>' +
  'f) Registrar na FIP – ARH 2-1 - a situação 345 (suspensão) todo o período, inclusive final de semana se for o caso,  que o funcionário irá se ausentar do ' +
  'trabalho para cumprir a sanção de suspensão. Lembramos que o ponto eletrônico deverá ser validado diariamente. Havendo dificuldades no registro do período ' +
  'favor entrar em contato com a Dipes/Gedip.<p>' +
  'OBSERVAÇÃO: A Suspensão sempre iniciará em dia útil, em qualquer dia da semana e sua contagem se dará em dias corridos, conforme IN 383-1, Seção 8.1.4.<p>' +
  'O não cumprimento tempestivo das decisões deliberadas e a quebra de confidencialidade podem gerar riscos para o Banco e são passíveis de avaliação sob o aspecto disciplinar.<p><p>' +
  'Atenciosamente,<p><p>' +
  '__________________________<br>' +
  '<strong>Gerência de Riscos/MTN</strong><br>' +
  '<strong>Superintendência Administrativa</strong>', // 1=matricula, 2=NomeFuncionário,
  SuspensaoCobranca = '#confidencial<p>' +
  'Sr. Gerente Geral/Superintendente,<p>' +
  'Informamos que, até a presente data, a medida, que vence em {1} não foi aplicada. Pedimos vossos préstimos em aplicar a medida julgada.<p>' +
  `Seguem orientações para a impressão do Comunicado de Suspensão, a ser aplicado ao funcionário <strong>{2} {3}</strong>, conforme encaminhamento da Dipes.<p>` +
  'Pontos a serem observados:<br>' +
  'a) A solução disciplinar aplicada a(o) funcionário(a) em afastamento regulamentar (licenças e cessões) ou férias, com exceção de demissão, deverá ser ' +
  'cumprida quando do seu retorno, após seu ciente no comunicado, inclusive para eventual aplicação de Responsabilização Pecuniária.<br>' +
  'b) O comunicado deverá ser impresso em duas vias: 1º do funcionário, 2º via do Banco. O comunicado deve ser acessado em ' +
  '<a href="https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas" target="_blank">https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas</a>;<br>' +
  'c) Deverá ser enviado, via malote e via aplicativo Demandas Gedip (<a href="https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas" target="_blank">' +
  'https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas</a>), a 2ª via do comunicado assinada pelo envolvido, ' +
  'imediatamente após o cumprimento, a fim de compor o dossiê;<br>' +
  'd) Observar as consequências da sanção aplicada a(o)  funcionário(a) conforme a IN 383-1 - seção Soluções do controle Disciplinar.<p>' +
  'e) O funcionário suspenso está terminantemente proibido de acessar o ambiente de trabalho, bem como os sistemas informatizados, inclusive, por meio remoto ' +
  'e telefone corporativo, durante a vigência da suspensão, constituindo-se falta de suma gravidade o descumprimento desta determinação;<br>' +
  'f) Registrar na FIP – ARH 2-1 - a situação 345 (suspensão) todo o período, inclusive final de semana se for o caso,  que o funcionário irá se ausentar do ' +
  'trabalho para cumprir a sanção de suspensão. Lembramos que o ponto eletrônico deverá ser validado diariamente. Havendo dificuldades no registro do período ' +
  'favor entrar em contato com a Dipes/Gedip.<p>' +
  'OBSERVAÇÃO: A Suspensão sempre iniciará em dia útil, em qualquer dia da semana e sua contagem se dará em dias corridos, conforme IN 383-1, Seção 8.1.4.<p>' +
  'O não cumprimento tempestivo das decisões deliberadas e a quebra de confidencialidade podem gerar riscos para o Banco e são passíveis de avaliação sob o aspecto disciplinar.<p><p>' +
  'Atenciosamente,<p><p>' +
  '__________________________<br>' +
  '<strong>Gerência de Riscos/MTN</strong><br>' +
  '<strong>Superintendência Administrativa</strong>', // 1=prazoVencimento, 2=matricula, 3=NomeFuncionário
  SuspensaoRetorno = '#confidencial<p>' +
  'Sr. Diretor/Gerente,<p>' +
  `Segue, em anexo, cópia digitalizada do Comunicado de Suspensão, processo GEDIP nº {1} referente à aplicação da medida disciplinar ao funcionário <strong>{2} {3}</strong>.<p>` +
  'Atenciosamente,<p><p>' +
  '__________________________<br>' +
  '<strong>{4} {5}</strong><br>', // 1= numero Gedip, 2=Matrícula, 3=NomeFuncionário, 4=matrículaResponsável, 5=nomeResponsável
  DestituicaoNormal = '#confidencial<p>' +
  'Sr. Gerente Geral/Superintendente,<p>' +
  `Seguem orientações para a impressão do Comunicado de Destituição, a ser aplicado ao funcionário <strong>{1} {2}</strong>, conforme encaminhamento da Dipes.<p>` +
  'Pontos a serem observados:<br>' +
  'a) A solução disciplinar aplicada a(o) funcionário(a) em afastamento regulamentar (licenças e cessões) ou férias, com exceção de demissão, deverá ser ' +
  'cumprida quando do seu retorno, após seu ciente no comunicado, inclusive para eventual aplicação de Responsabilização Pecuniária.<br>' +
  'b) O comunicado deverá ser impresso em duas vias: 1º do funcionário, 2º via do Banco. O comunicado deve ser acessado em ' +
  '<a href="https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas" target="_blank">https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas</a>;<br>' +
  'c) Deverá ser enviado, via malote e via aplicativo Demandas Gedip (<a href="https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas" target="_blank">' +
  'https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas</a>), a 2ª via do comunicado assinada pelo envolvido, ' +
  'imediatamente após o cumprimento, a fim de compor o dossiê;<br>' +
  'd) Observar as consequências da sanção aplicada a(o)  funcionário(a) conforme a IN 383-1 - seção Soluções do controle Disciplinar.<p>' +
  'e) O funcionário suspenso está terminantemente proibido de acessar o ambiente de trabalho, bem como os sistemas informatizados, inclusive, por meio remoto ' +
  'e telefone corporativo, durante a vigência da suspensão, constituindo-se falta de suma gravidade o descumprimento desta determinação;<br>' +
  'f) Registrar na FIP – ARH 2-1 - a situação 345 (suspensão) todo o período, inclusive final de semana se for o caso,  que o funcionário irá se ausentar do ' +
  'trabalho para cumprir a sanção de suspensão. Lembramos que o ponto eletrônico deverá ser validado diariamente. Havendo dificuldades no registro do período ' +
  'favor entrar em contato com a Dipes/Gedip.<p>' +
  'OBSERVAÇÃO: A Suspensão sempre iniciará em dia útil, em qualquer dia da semana e sua contagem se dará em dias corridos, conforme IN 383-1, Seção 8.1.4.<p>' +
  'O não cumprimento tempestivo das decisões deliberadas e a quebra de confidencialidade podem gerar riscos para o Banco e são passíveis de avaliação sob o aspecto disciplinar.<p><p>' +
  'Atenciosamente,<p><p>' +
  '__________________________<br>' +
  '<strong>Gerência de Riscos/MTN</strong><br>' +
  '<strong>Superintendência Administrativa</strong>', // 1=matricula, 2=NomeFuncionário,
  DestituicaoCobranca = '#confidencial<p>' +
  'Sr. Gerente Geral/Superintendente,<p>' +
  'Informamos que, até a presente data, a medida, que vence em {1} não foi aplicada. Pedimos vossos préstimos em aplicar a medida julgada.<p>' +
  `Seguem orientações para a impressão do Comunicado de Destituição, a ser aplicado ao funcionário <strong>{2} {3}</strong>, conforme encaminhamento da Dipes.<p>` +
  'Pontos a serem observados:<br>' +
  'a) A solução disciplinar aplicada a(o) funcionário(a) em afastamento regulamentar (licenças e cessões) ou férias, com exceção de demissão, deverá ser ' +
  'cumprida quando do seu retorno, após seu ciente no comunicado, inclusive para eventual aplicação de Responsabilização Pecuniária.<br>' +
  'b) O comunicado deverá ser impresso em duas vias: 1º do funcionário, 2º via do Banco. O comunicado deve ser acessado em ' +
  '<a href="https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas" target="_blank">https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas</a>;<br>' +
  'c) Deverá ser enviado, via malote e via aplicativo Demandas Gedip (<a href="https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas" target="_blank">' +
  'https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas</a>), a 2ª via do comunicado assinada pelo envolvido, ' +
  'imediatamente após o cumprimento, a fim de compor o dossiê;<br>' +
  'd) Observar as consequências da sanção aplicada a(o)  funcionário(a) conforme a IN 383-1 - seção Soluções do controle Disciplinar.<p>' +
  'e) O funcionário suspenso está terminantemente proibido de acessar o ambiente de trabalho, bem como os sistemas informatizados, inclusive, por meio remoto ' +
  'e telefone corporativo, durante a vigência da suspensão, constituindo-se falta de suma gravidade o descumprimento desta determinação;<br>' +
  'f) Registrar na FIP – ARH 2-1 - a situação 345 (suspensão) todo o período, inclusive final de semana se for o caso,  que o funcionário irá se ausentar do ' +
  'trabalho para cumprir a sanção de suspensão. Lembramos que o ponto eletrônico deverá ser validado diariamente. Havendo dificuldades no registro do período ' +
  'favor entrar em contato com a Dipes/Gedip.<p>' +
  'OBSERVAÇÃO: A Suspensão sempre iniciará em dia útil, em qualquer dia da semana e sua contagem se dará em dias corridos, conforme IN 383-1, Seção 8.1.4.<p>' +
  'O não cumprimento tempestivo das decisões deliberadas e a quebra de confidencialidade podem gerar riscos para o Banco e são passíveis de avaliação sob o aspecto disciplinar.<p><p>' +
  'Atenciosamente,<p><p>' +
  '__________________________<br>' +
  '<strong>Gerência de Riscos/MTN</strong><br>' +
  '<strong>Superintendência Administrativa</strong>',
  DestituicaoRetorno = '#confidencial<p>' +
  'Sr. Diretor/Gerente,<p>' +
  `Segue, em anexo, cópia digitalizada do Comunicado de Destituição, processo GEDIP nº {1} referente à aplicação da medida disciplinar ao funcionário <strong>{2} {3}</strong>.<p>` +
  'Atenciosamente,<p><p>' +
  '__________________________<br>' +
  '<strong>{4} {5}</strong><br>', // 1= numero Gedip, 2=Matrícula, 3=NomeFuncionário, 4=matrículaResponsável, 5=nomeResponsável
  RespPecuniariaNormal = '#confidencial<p>' +
  'Sr. Gerente Geral/Superintendente,<p>' +
  `Seguem orientações para a impressão dos Termo de Ciência e Comunicado de Responsabilidade Pecuniária, em anexo, a serem aplicados ao funcionário <strong>{1} {2}</strong>,` +
  ' conforme encaminhamento da Dipes.<p>' +
  'Pontos a serem observados:<br>' +
  'a) O comunicado deverá ser impresso em duas vias: 1º do funcionário, 2º via do Banco. O comunicado deve ser acessado em ' +
  '<a href="https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas" target="_blank">https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas</a>;<br>' +
  'b) Deverá ser enviado, via malote e via aplicativo Demandas Gedip (<a href="https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas" target="_blank">' +
  'https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas</a>), a 2ª via do comunicado assinada pelo envolvido, ' +
  'imediatamente após o cumprimento, a fim de compor o dossiê;<br>' +
  'c) Observar as consequências da sanção aplicada a(o)  funcionário(a) conforme a IN 383-1 - seção Soluções do controle Disciplinar.<p>' +
  'Para contabilização do valor como Responsabilização Pecuniária:<p>' +
  '1. Acesse o sistema Gedip;<br>' +
  '2. Acesse a opção 31-01, selecione o lançamento 54 – Responsabilização Pecuniária e posteriormente o protocolo e a irregularidade;<br>' +
  '3. A justificativa, informe o nome e a matrícula do funcionário, data e o título da mensagem que autorizou a baixa do valor;<br>' +
  '4. Solicite confirmação por meio da opção 31-02.<p><p>' +
  'Atenciosamente,<p><p>' +
  '__________________________<br>' +
  '<strong>Gerência de Riscos/MTN</strong><br>' +
  '<strong>Superintendência Administrativa</strong>',
  RespPecuniariaCobranca = '#confidencial<p>' +
  'Sr. Gerente Geral/Superintendente,<p>' +
  'Informamos que, até a presente data, a medida, que vence em {1} não foi aplicada. Pedimos vossos préstimos em aplicar a medida julgada.<p>' +
  `Seguem orientações para a impressão dos Termos de Ciência e Comunicado de Responsabilidade Pecuniária, em anexo, a serem aplicados ao funcionário <strong>{2} {3}</strong>,` +
  ' conforme encaminhamento da Dipes.<p>' +
  'Pontos a serem observados:<br>' +
  'a) O comunicado deverá ser impresso em duas vias: 1º do funcionário, 2º via do Banco. O comunicado deve ser acessado em ' +
  '<a href="https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas" target="_blank">https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas</a>;<br>' +
  'b) Deverá ser enviado, via malote e via aplicativo Demandas Gedip (<a href="https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas" target="_blank">' +
  'https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas</a>), a 2ª via do comunicado assinada pelo envolvido, ' +
  'imediatamente após o cumprimento, a fim de compor o dossiê;<br>' +
  'c) Observar as consequências da sanção aplicada a(o)  funcionário(a) conforme a IN 383-1 - seção Soluções do controle Disciplinar.<p>' +
  'Para contabilização do valor como Responsabilização Pecuniária:<p>' +
  '1. Acesse o sistema Gedip;<br>' +
  '2. Acesse a opção 31-01, selecione o lançamento 54 – Responsabilização Pecuniária e posteriormente o protocolo e a irregularidade;<br>' +
  '3. A justificativa, informe o nome e a matrícula do funcionário, data e o título da mensagem que autorizou a baixa do valor;<br>' +
  '4. Solicite confirmação por meio da opção 31-02.<p><p>' +
  'Atenciosamente,<p><p>' +
  '__________________________<br>' +
  '<strong>Gerência de Riscos/MTN</strong><br>' +
  '<strong>Superintendência Administrativa</strong>',
  RespPecuniariaRetorno = '#confidencial<p>' +
  'Sr. Diretor/Gerente,<p>' +
  `Segue, em anexo, cópia digitalizada dos Termo de Ciência e Comunicado de Responsabilidade Pecuniária, processo GEDIP nº {1} referente à aplicação da medida disciplinar ao funcionário <strong>{2} {3}</strong>.<p>` +
  'Atenciosamente,<p><p>' +
  '__________________________<br>' +
  '<strong>{4} {5}</strong><br>', // 1= numero Gedip, 2=Matrícula, 3=NomeFuncionário, 4=matrículaResponsável, 5=nomeResponsável
  DemissaoNormal = '#confidencial<p>' +
  'Sr. Gerente Geral/Superintendente,<p>' +
  `Por despacho do {1}, em {2}, foi decidido pela aplicação da Demissão por justa causa ao funcionário <strong>{3} {4}</strong> com base nas alíneas A, B, H,  do art. 482 da CLT.<p>` +
  'Dessa forma, segue orientação para aplicação da solução.' +
  'Para garantir o imediato cumprimento de decisão da ação disciplinar com a solução de demissão do(a) funcionário(a) do quadro do Banco, ratificamos as orientações da Dipes no que segue:<p>' +
  '<strong>a) Observe as orientações  contidas  na IN  379-1 e IN 379-2  seções  de demissão por justa causa e adote as providências recomendadas. Imprima via aplicativo Demandas Gedip (<a href="https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas" target="_blank"> e entregue ' +
  'o comunicado de demissão a(o) envolvido(a), faça-o tendo  presentes duas testemunhas funcionários, que devem atestar a entrega do referido documento se houver recusa em assiná-lo;</strong><p>' +
  'b) Envie via aplicativo Demandas Gedip (<a href="https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas" target="_blank">, cópia do Comunicado de Demissão assinada pelo(a) envolvido(a), ' +
  'imediatamente após o cumprimento, para composição do dossiê;<p>' +
  'c) Questione ao funcionário em qual dependência deseja receber cópias dos elementos do processo, nos informe através do email <a href="mailto:gepes.gedip.pr@bb.com.br">gepes.gedip.pr@bb.com.br</a> e anexe cópia do Comunicado de Demissão assinada pelo(a) envolvido(a), imediatamente após a comunicação e ciência.' +
  'd) Não permita  que o(a)  demitido(a)   acesse   ou   faça   registros  nas folhas individuais de presença  FIP ou no ponto  eletrônico, após a data do ciente ou da comunicação  formal da  decisão;<p>' +
  'e) Busque orientação no serviço jurídico  jurisdicionante, na hipótese de ocorrência  que dificulte  o   cumprimento  da  decisão  de demissão, conforme a IN 379-1, seção Aspector Gerais;<p>' +
  '<strong>f) Envie mensagem ao Cenop BSB Funcionalismo – Prefixo 8583, no caso de dúvidas quanto à operacionalização da demissão;</strong><p>' +
  'g) O afastamento por licença não impede a efetivação da demissão por justa causa.<p>' +
  'O não cumprimento tempestivo das decisões deliberadas e a quebra de confidencialidade podem gerar riscos para o Banco e são passíveis de avaliação sob o aspecto disciplinar.<p><p>' +
  'Atenciosamente,<p><p>' +
  '__________________________<br>' +
  '<strong>Gerência de Riscos/MTN</strong><br>' +
  '<strong>Superintendência Administrativa</strong>', // 1=nmComite, 2=dtJulgamentoGedip, 3=Matrícula, 4=NomeFuncionário,
  DemissaoCobranca = '#confidencial<p>' +
  'Sr. Gerente Geral/Superintendente,<p>' +
  'Informamos que, até a presente data, a medida, que vence em {1} não foi aplicada. Pedimos vossos préstimos em aplicar a medida julgada.<p>' +
  `Por despacho do {2}, em {3}, foi decidido pela aplicação da Demissão por justa causa ao funcionário <strong>{4} {5}</strong> com base nas alíneas B, H,  do art. 482 da CLT.<p>` +
  'Para garantir o imediato cumprimento de decisão da ação disciplinar com a solução de demissão do(a) funcionário(a) do quadro do Banco, ratificamos as orientações da Dipes no que segue:<p>' +
  '<strong>a) Observe as orientações  contidas  na IN  379-1 e IN 379-2  seções  de demissão por justa causa e adote as providências  recomendadas. Imprima via aplicativo Demandas Gedip (<a href="https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas" target="_blank"> e entregue ' +
  'o comunicado de demissão a(o) envolvido(a), faça-o tendo  presentes duas testemunhas funcionários, que devem atestar a entrega do referido documento se houver recusa em assiná-lo;</strong><p>' +
  'b) Envie via aplicativo Demandas Gedip (<a href="https://super.intranet.bb.com.br/v8/ctrldiscp/GerDemandas" target="_blank">, cópia do Comunicado de Demissão assinada pelo(a) envolvido(a), ' +
  'imediatamente após o cumprimento, para composição do dossiê;<p>' +
  'c) Não permita  que o(a)  demitido(a)   acesse   ou   faça   registros  nas folhas individuais de presença  FIP ou no ponto  eletrônico, após a data do ciente ou da comunicação  formal da  decisão;<p>' +
  'd) Busque orientação no serviço jurídico  jurisdicionante, na hipótese de ocorrência  que dificulte  o   cumprimento  da  decisão  de demissão, conforme a IN 379-1, seção Aspector Gerais;<p>' +
  'e) Envie mensagem ao Cenop BSB Funcionalismo – Prefixo 8583, no caso de dúvidas quanto à operacionalização da demissão;<p>' +
  'f) O afastamento por licença não impede a efetivação da demissão por justa causa.<p>' +
  'O não cumprimento tempestivo das decisões deliberadas e a quebra de confidencialidade podem gerar riscos para o Banco e são passíveis de avaliação sob o aspecto disciplinar.<p><p>' +
  'Atenciosamente,<p><p>' +
  '__________________________<br>' +
  '<strong>Gerência de Riscos/MTN</strong><br>' +
  '<strong>Superintendência Administrativa</strong>', // 1=prazoVencimento, 2=nmComite, 3=dtJulgamentoGedip, 4=Matrícula, 5=NomeFuncionário,
  DemissaoRetorno = '#confidencial<p>' +
  'Sr. Diretor/Gerente,<p>' +
  `Segue, em anexo, cópia digitalizada dos Termos e Comunicados de Demissão, processo GEDIP nº {1} referente à aplicação da medida disciplinar ao funcionário <strong>{2} {3}</strong>.<p>` +
  'Atenciosamente,<p><p>' +
  '__________________________<br>' +
  '<strong>{4} {5}</strong><br>', // 1= numero Gedip, 2=Matrícula, 3=NomeFuncionário, 4=matrículaResponsável, 5=nomeResponsável
}
