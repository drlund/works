import React from 'react';
import { Typography } from "antd";

export const constantes = {
  TEXTO_LISTA_PROJETOS: (<>
    <Typography.Paragraph>
      Aqui é possível incluir seu pedido de ferramenta, solução, relatório
      ou demanda específica de alçada da Equipe SOLUÇÕES DIGITAIS da SUPERADM.
    </Typography.Paragraph>
  </>),
  TEXTO_INFO_BASICA: (<>
    <Typography.Paragraph>
      Após a inclusão das funcionalidades que deseja que sejam atendidas, a
      Equipe PLANEJAMENTO irá analisar a demanda e criá-la da melhor forma
      possível.
    </Typography.Paragraph>
    <Typography.Paragraph>
      Pedimos que leia com atenção e preencha corretamente os campos.
    </Typography.Paragraph>
  </>),
  ORIGEM_INFO_BASICA: 'INFORMACAO_BASICA',
  TEXTO_FUNCIONALIDADE: (
    <Typography.Paragraph>
      Agora você poderá detalhar sua solicitação, colocando quais
      funcionalidades você deseja que sejam atendidas da forma mais
      fidedigna possível.
    </Typography.Paragraph>
  ),
  layoutForm: {
    labelCol: { flex: "0 1 auto" },
    wrapperCol: { flex: "0 1 70%" },
    justify: "center",
  },
  ORIGEM_FORM_ESCLARECIMENTO: 'FORMULARIO',
  ORIGEM_ABA_ESCLARECIMENTO: 'ABA',
  ORIGEM_FUNCIONALIDADE: 'FUNCIONALIDADE',
  LABEL_TITULO_FUNCIONALIDADE: 'Título para a Funcionalidade',
  INFO_TITULO_FUNCIONALIDADE: 'O nome que você deseja dar para esta funcionalidade.',
  LABEL_DESCRICAO_FUNCIONALIDADE: 'Descrição da Funcionalidade',
  INFO_DESCRICAO_FUNCIONALIDADE: 'Descreva como essa funcionalidade deve ser, por exemplo se for um formulário quais campos ele deve possuir, qual a finalidade desta funcionalidade para o processo, etc.',
  LABEL_DETALHE_FUNCIONALIDADE: 'Detalhe (opcional)',
  INFO_DETALHE_FUNCIONALIDADE: 'Se exisitir alguma particuladade desta funcionalidade descreva aqui, por exemplo se houver controle de acesso, quais cargos podem executar que atividades, etc.',
  MSG_CHK_CAMPOS: 'Os campos destacados devem ser informados.',
  MSG_CHK_RESPONSAVEL_FUNCIONALIDADE: 'A funcionalidade precisa ter ao menos um responsável.',
  BTN_FUNCIONALIDADE_INCLUSAO: 'Incluir Nova',
  LABEL_TITULO_INFO_BASICA: 'Nome do Projeto',
  INFO_TITULO_INFO_BASICA: 'O nome que você deseja dar à ferramenta ou relatório.',
  LABEL_RESUMO_INFO_BASICA: 'Resumo',
  INFO_RESUMO_INFO_BASICA: 'Descreva as linhas gerais da atividade que requer o desenvolvimente de ferramenta, como quem são os envolvidos, quais atividades serão abrangidas pela ferramenta, etc.',
  LABEL_OBJETIVO_INFO_BASICA: 'Objetivo',
  INFO_OBJETIVO_INFO_BASICA: 'Descreva que ganhos você espera obter utilizando a ferramenta, como geração de dados para acompanhamento das atividades, regsitros centralizados, substituir outro canal de informação, etc.',
  LABEL_PESSOAS_INFO_BASICA: 'Quantidade Pessoas',
  INFO_PESSOAS_INFO_BASICA: 'Informe a quantidade estimada de pessoas atendidas pelo app ou relatório. Ex. O banco todo, Diretorias de Pessoas e de varejo, etc. (limite de 50 caracteres)',
  LABEL_TEMPO_INFO_BASICA: 'Redução Tempo',
  INFO_TEMPO_INFO_BASICA: 'Informe a quantidade estimada de tempo que o app ou relatório poderá reduzir para executar a atividade.(limite de 50 caracteres)',
  LABEL_CUSTO_INFO_BASICA: 'Redução Custo',
  INFO_CUSTO_INFO_BASICA: 'Informe o valor estimado que o app ou relatório pode proporcionar de economia para o BB. (limite de 50 caracteres)',
  LABEL_MATRICULA_RESPONSAVEL: 'Matrícula',
  INFO_MATRICULA_RESPONSAVEL: 'Adicione a matrícula do responsável por esta funcionalidade. Havendo mais de um, adicione um por vez.',
  LABEL_MATRICULA_NOME_RESPONSAVEL: 'Nome',
  LABEL_PRINCIPAL_RESPONSAVEL: 'Principal Contato da Funcionalidade',
  INFO_PRINCIPAL_RESPONSAVEL: 'Marque aqui se este funcionário será o principal contato para esclarecer dúvidas dessa funcionalidade.',
  LABEL_ADMINISTRADOR_RESPONSAVEL: 'Administrador do Projeto',
  INFO_ADMINISTRADOR_RESPONSAVEL: 'Marque aqui se este funcionário será o administrador do projeto, podendo acompanhar o andamento da entrega.',
  LABEL_DEV_RESPONSAVEL: 'Desenvolvedor',
  LABEL_DBA_RESPONSAVEL: 'Adm. de Banco de Dados',
  LABEL_PEDIDO_ESCLARECIMENTO: 'Pedido',
  INFO_PEDIDO_ESCLARECIMENTO: 'Descreva com detalhes o pedido de esclarecimento sobre o projeto ou funcionalidade que você deseja entender.',
  LABEL_OBSERVACAO_ESCLARECIMENTO: 'Observação',
  INFO_OBSERVACAO_ESCLARECIMENTO: 'Inclua a observação que você deseja sobre o projeto ou funcionalidade.',
  LABEL_RESPONSAVEL_ESCLARECIMENTO: 'Quem Responde?(opcional)',
  INFO_RESPONSAVEL_ESCLARECIMENTO: 'Você pode direcionar seu questionamento ou dúvida para um dos responsáveis pelo projeto.',
  LABEL_FUNCIONALIDADE_ESCLARECIMENTO: 'Funcionalidade(opcional)',
  INFO_FUNCIONALIDADE_ESCLARECIMENTO: 'Você pode indicar sobre qual funcionalidade seu questionamento ou observação se refere.',
  LABEL_ATIVIDADE_ESCLARECIMENTO: 'Atividade(opcional)',
  INFO_ATIVIDADE_ESCLARECIMENTO: 'Você pode indicar sobre qual atividade seu questionamento ou observação se refere.',
  LABEL_RESPOSTA_ESCLARECIMENTO: 'Resposta',
  LABEL_ESCLARECIMENTO_ESCLARECIMENTO: 'Pedido Relacionado(opcional)',
  INFO_ESCLARECIMENTO_ESCLARECIMENTO: 'Escolhendo um pedido anterior você está indicando que este novo pedido é um complemento ao pedido indicado.',
  LABEL_PROJETO_ATIVIDADE: 'Escolha o Projeto',
  INFO_PROJETO_ATIVIDADE: 'É necessário indicar em qual projeto você irá cadastrar/alterar uma atividade.',
  LABEL_FUNCIONALIDADE_ATIVIDADE: 'Exibir atividades de',
  LABEL_FUNCIONALIDADE_ATIVIDADE_MODAL: 'Escolha a Funcionalidade',
  INFO_FUNCIONALIDADE_ATIVIDADE: 'Escolha uma funcionalidade para ver suas atividades cadastradas.',
  INFO_FUNCIONALIDADE_ATIVIDADE_MODAL: 'É necessário indicar em qual funcionalidade você irá cadastrar/alterar uma atividade.',
  INFO_FUNCIONALIDADE_FUNCIONALIDADE: 'É necessário indicar qual funcionalidade você quer alterar o funcionamento.',
  LABEL_RESPONSAVEL_ATIVIDADE: 'Responsável(is)',
  INFO_RESPONSAVEL_ATIVIDADE: 'Escolha o(s) responsável(is) desta atividade.',
  LABEL_TIPO_ATIVIDADE: 'Tipo de Atividade',
  INFO_TIPO_ATIVIDADE: 'Informe qual o tipo da atividade.',
  LABEL_GERADOR_PAUSA_PROJETO: 'Projeto Origem',
  INFO_GERADOR_PAUSA_PROJETO: 'Informe qual o projeto terá uma atividade a ser realizada e que é a origem desta pausa neste projeto.',
  LABEL_GERADORA_PAUSA_ATIVIDADE: 'Atividade a ser desenvolvida',
  INFO_GERADORA_PAUSA_ATIVIDADE: 'Informe qual a atividade do projeto escolhido justifica a inclusão desta pausa neste projeto.',
  LABEL_TITULO_ATIVIDADE: 'Título',
  INFO_TITULO_ATIVIDADE: 'Informe um título para referenciar esta atividade.',
  INFO_TITULO_PAUSA_ATIVIDADE: 'Informe um título para referenciar esta pausa na atividade.',
  LABEL_DESCRICAO_ATIVIDADE: 'Descrição',
  INFO_DESCRICAO_ATIVIDADE: 'Descreva o máximo de detalhes possíves da implantação do componente/funcionalidade. Isto irá ajudar a entender e contribuir nas manutenções deste processo no futuro.',
  INFO_DESCRICAO_PAUSA_ATIVIDADE: 'Justifique a quantidade de dias de pausa na Atividade (Ex. correção de BUG no APP XXX que está em produção.)',
  LABEL_PRAZO_ATIVIDADE: 'Prazo (dias)',
  INFO_PRAZO_ATIVIDADE: 'Informe o prazo necessário para a conclusão da atividade.',
  INFO_PRAZO_PAUSA_ATIVIDADE: 'O prazo da pausa é igual ao prazo da atividade geradora da pausa. O valor não pode ser alterado.',
  LABEL_DATAS_ATIVIDADE: 'Datas',
  LABEL_COMPLEXIDADE_ATIVIDADE: 'Complexidade',
  INFO_COMPLEXIDADE_ATIVIDADE: 'Classifique a complexidade da atividade.',
  LABEL_PRIORIDADE_ATIVIDADE: 'Prioridade',
  INFO_PRIORIDADE_ATIVIDADE: 'Informe a prioridade para início da atividade.',
  LABEL_STATUS_ATIVIDADE: 'Status',
  INFO_STATUS_ATIVIDADE: 'Se necessário altere o status atual da atividade. Você pode incluir pausas para realização de outras atividades, sem impactar o prazo.',
  INFO_STATUS_PROJETO: 'Se necessário altere o status atual do Projeto.',
  MSG_ATUALIZA_RESPONSAVEL: 'Não foi possível localizar o Funcionário. Digite novamente a matricula.',
  MSG_ADICIONA_RESPONSAVEL_MAT_INCOMPLETA: 'Informe a matricula com F e 7 dígitos!',
  MSG_ADICIONA_RESPONSAVEL_MAT_DUPLICADA_INFO_BASICA: 'Esta matrícula já foi incluída!',
  MSG_ADICIONA_RESPONSAVEL_MAT_DUPLICADA_FUNCIONALIDADES: 'Esta matrícula já foi incluída! Para adicioná-lo a esta funcionalidade, clique no botão matricula para exibir uma lista.',
  MSG_EXCLUIR_RESPONSAVEL_UNICO: 'Não é possível excluir esta matrícula pois o Funcionario é o único responsável por uma Funcionalidade. Altere o Responsável pela aba Funcionalidades.',
  MSG_RESPONSAVEIS: 'O projeto precisa ter ao menos um responsável. Adicione pela aba "Informações Básicas".',
  MSG_FUNCIONALIDADES: 'O projeto precisa ter ao menos uma funcionalidade. Adicione pela aba "Funcionalidades".',
  MSG_ATIVIDADE_FORA_BD: 'Esta atividade ainda não está registrada na ferramenta. Salve as informações pendentes antes de incluir uma pausa para esta atividade.',

  uorSolucoesDigitais: '000459379',
  
  statusNaoConcluidos: 8,
  statusTodos: 0,
  statusNaoIniciado: 1,
  statusEmAndamento: 2,
  statusInterrompido: 3,
  statusAguardandoEsclarecimento: 4,
  statusConcluido: 5,

  filtroByStatus: 'status',
  filtroByDataInicio: 'data',
  filtroByConcluida: 'concluida',
  filtroByMatricula: 'matricula',

  tipoNovo: 1,
  tipoManutencao: 2,
  tipoAlteracao: 3,

  percentual100: '100.00',
  estadoSuccess: 'success',
  estadoLate: 'late',
  estadoException: 'exception',
  estadoNormal: 'normal',

  laranja: '#FF4500',
  areia: '#F4A460',
  verdeSuccess: '#52c41a',
  azulNormal: '#1890ff',
  vermelhoException: '#ff4d4f',
  cinzaClaro: "#AFAFAF",
  cinzaEscuro: "#69696E",
  bbAzul: "#002D4B",

  listaAtividadesNovaNaoConcluida: 'novaNaoConcluidas',
  listaAtividadesNovaConcluida: 'novaConcluidas',
  listaAtividadesAtualizaNaoConcluida: 'atualizaNaoConcluidas',
  listaAtividadesAtualizaConcluida: 'atualizaConcluidas',
  listaAtividadesExibeNaoConcluida: 'exibirNaoConcluidas',
  listaAtividadesExibeConcluida: 'exibirConcluidas',
}