const schemaName = 'app_procuracao';

/**
 * Retorna as informações basicas por procuracao
 */
const informacoesPorProcuracao = /*sql*/`
SELECT
  CONCAT(
    '[',
    GROUP_CONCAT(
      JSON_MERGE(
        # informacoes dos poderes / subsidiarias
        JSON_OBJECT(
          'id', subsi.id,
          'nome', subsi.nomeReduzido,
          'nome_completo', subsi.nome,
          'cnpj', subsi.cnpj,
          'subAtivo', subsi.ativo
        ),
        # informacoes da procuracao em caso de procuracao direto da subsidiaria
        IF (proc_subsi.direto = 1,
          # caso seja de subsidiaria, as informacoes da procuracao vao junto
          JSON_OBJECT(
            'procuracaoId', proc.id,
            'procuracaoAtiva', proc.ativo,
            'emissao', proc.dataEmissao,
            'vencimento', proc.dataVencimento,
            'manifesto', proc.dataManifesto,
            'folha', proc.folha,
            'livro', proc.livro,
            'doc', proc.urlDocumento,
            'cartorio', cart.nome,
            'cartorioId', cart.id
          ),
          # caso sem subsidiaria, as info das procuracao nao sao necessarias
          JSON_OBJECT()
        )
      )
    ),
    ']'
  ) AS procuracao_por_subsidiarias_json_array,
  # informacoes do outorgado
  JSON_OBJECT(
    'matricula', outor.matricula,
    'nome', outor.nome,
    'cargo', outor.cargoNome,
    'prefixo', outor.lotacaoCodigo,
    'cpf', outor.cpf,
    'rg', outor.rg,
    'estadoCivil', outor.estadoCivil,
    'municipio', outor.lotacaoMunicipio,
    'uf', outor.lotacaoUf,
    'endereco', outor.lotacaoEndereco
  ) AS outorgado_snapshot,
  # informacoes validas para todos os poderes
  JSON_OBJECT(
    'procuracaoId', proc.id,
    'procuracaoAtiva', proc.ativo,
    'emissao', proc.dataEmissao,
    'vencimento', proc.dataVencimento,
    'manifesto', proc.dataManifesto,
    'folha', proc.folha,
    'livro', proc.livro,
    'doc', proc.urlDocumento,
    'cartorio', cart.nome,
    'cartorioId', cart.id
  ) AS informacoes_procuracao,
  proc_subsi.idProcuracao,
  proc.ativo AS procAtivo,
  NULL AS idProxy
FROM
  ${schemaName}.procuracao_subsidiarias proc_subsi
  INNER JOIN ${schemaName}.procuracoes proc
    ON proc.id = proc_subsi.idProcuracao
  LEFT JOIN ${schemaName}.cartorios cart
    ON cart.id = proc.idCartorio
  INNER JOIN ${schemaName}.outorgado_snapshot outor
    ON proc.idOutorgadoSnapshot = outor.id
  INNER JOIN ${schemaName}.subsidiarias subsi
    ON proc_subsi.idSubsidiaria = subsi.id
GROUP BY
  proc_subsi.idProcuracao
`;

/**
 * Retorna as informações basicas por proxy
 *
 * No node é preciso de quatro escapes \\\\ enquanto que para o mysql só precisa de dois
 */
const informacoesPorProxy = /*sql*/`
SELECT
  # transforma em array
  CONCAT(
    '[',
    GROUP_CONCAT(
      # remove os colchetes do inicio e fim, mantendo o json válido
      REGEXP_REPLACE(
        infoPorProcuracao.procuracao_por_subsidiarias_json_array,
        '(\\\\[|])',
        ""
      )
    ),
    ']'
  ) AS procuracao_por_subsidiarias_json_array,
  infoPorProcuracao.outorgado_snapshot,
  # nulo para o proxy
  NULL AS informacoes_procuracao,
  # nulo para o proxy
  NULL AS idProcuracao,
  infoPorProcuracao.procAtivo,
  prox.idProxy
FROM
  (${informacoesPorProcuracao}) infoPorProcuracao
  INNER JOIN ${schemaName}.proxy_procuracao prox
    ON infoPorProcuracao.idProcuracao = prox.idProcuracao
GROUP BY prox.idProxy
`;

/**
 * Retona a union de todas as informacoes basicas
 */
const informacoesBasicasProcuracaoOuProxy = /*sql*/`
(SELECT
  infoProc.*
FROM
  (${informacoesPorProcuracao}) infoProc
  LEFT JOIN ${schemaName}.proxy_procuracao prox
    ON infoProc.idProcuracao = prox.idProcuracao
WHERE
  prox.idProxy IS NULL)

UNION ALL

(SELECT * FROM (${informacoesPorProxy}) infoProx)
`;

/**
 * Agrega as informações em um objeto json
 */
const informacoesAgregadasPorProcuracaoOuProxy = /*sql*/`
SELECT
  JSON_OBJECT(
    'procuracaoAgregada', JSON_EXTRACT(
      infoBasicaProcProx.informacoes_procuracao, '$'
    ),
    'outorgado', JSON_EXTRACT(
      infoBasicaProcProx.outorgado_snapshot, '$'
    ),
    'subsidiarias', JSON_EXTRACT(
      infoBasicaProcProx.procuracao_por_subsidiarias_json_array, '$'
    )
  ) AS informacao,
  JSON_VALUE(
    infoBasicaProcProx.outorgado_snapshot, '$.matricula'
  ) AS matricula,
  JSON_VALUE(
    infoBasicaProcProx.outorgado_snapshot, '$.nome'
  ) AS nome,
  JSON_VALUE(
    infoBasicaProcProx.outorgado_snapshot, '$.cargo'
  ) AS cargoNome,
  infoBasicaProcProx.idProcuracao,
  infoBasicaProcProx.idProxy,
  cadeia.idProcuracaoParent,
  cadeia.idProxyParent
FROM
  (${informacoesBasicasProcuracaoOuProxy}) infoBasicaProcProx
  INNER JOIN ${schemaName}.cadeia_procuracoes cadeia
    ON infoBasicaProcProx.idProcuracao = cadeia.idProcuracaoAtual
    OR infoBasicaProcProx.idProxy = cadeia.idProxyAtual
`;

/**
 * Retorna um array dos objetos json agregados com base no id procurado
 */
const getCadeiaProcuracao = /*sql*/`
# with recursivo precisa de um union com basicamente uma copia da mesma tabela
# por isso abstrai em um lugar diferente para não ter que duplicar aqui
WITH RECURSIVE procuracoesFinal AS (
  # numa chamada, se faz a condicao
  (SELECT i.*
  FROM (${informacoesAgregadasPorProcuracaoOuProxy}) i
  WHERE
    # id do proxy ou procuracao
    i.idProxy = ? OR i.idProcuracao = ? -- idProxy ou idProcuracao
  )

  UNION ALL

  # na outra faz o join dos campos ligados da mesma tabela
  (SELECT b.* FROM (${informacoesAgregadasPorProcuracaoOuProxy}) b
    INNER JOIN procuracoesFinal p
      ON p.idProcuracaoParent = b.idProcuracao
      OR p.idProxyParent = b.idProxy)
)
# finaliza com um select normal
SELECT
  # na ordem, o primeiro é o procurado
  # no meio são os pais e avós
  # com o último sendo o que começou a cadeia
  CONCAT('[', GROUP_CONCAT(f.informacao), ']') AS docsArr
FROM procuracoesFinal f;
`;


/**
 * Retornar as informações basicas do agregado proxy
 *
 * Provavelmente usar para achar o "dono" do agregado e se está ativo
 */
const infoAtivoPorProxy = /*sql*/`
SELECT
  prox.idProxy,
  outor.matricula,
  MIN(proc.ativo) AS ativo,
  MIN(proc.dataVencimento) AS minVencimento,
  prox.createdAt
FROM
  ${schemaName}.proxy_procuracao prox
  INNER JOIN ${schemaName}.procuracoes proc
    ON prox.idProcuracao = proc.id
  INNER JOIN ${schemaName}.outorgado_snapshot outor
    ON proc.idOutorgadoSnapshot = outor.id
GROUP BY prox.idProxy
`;

/**
 * Retorna a última proxy por matricula
 */
const maxProxyPorMatricula = /*sql*/`
SELECT * FROM (
  SELECT
    i.idProxy,
    i.matricula,
    i.ativo,
    i.createdAt,
    ROW_NUMBER() OVER (PARTITION BY i.matricula ORDER BY i.createdAt DESC) AS rn
  FROM
    (${infoAtivoPorProxy}) i
) t1 WHERE t1.rn = 1
`;

/**
 * Mostra os ids das proxies mais recentes por matricula
 * Ou então mostra o id das procuracoes que não estao em uma proxy
 */
const idsAtivoMatricula = /*sql*/`
SELECT
  cadeia.idProcuracaoAtual AS idProcuracao,
  cadeia.idProxyAtual AS idProxy,
  TRIM(arh.matricula) as matricula,
  TRIM(arh.nome) as nome,
  TRIM(arh.desc_cargo) AS cargoNome,
  TRIM(arh.prefixo_lotacao) AS prefixo,
  COALESCE(proc.ativo, ipx.ativo) AS ativo,
  COALESCE(proc.createdAt, ipx.createdAt) as createdAt
FROM
  ${schemaName}.cadeia_procuracoes cadeia
  LEFT JOIN ${schemaName}.procuracoes proc
    ON cadeia.idProcuracaoAtual = proc.id
  LEFT JOIN ${schemaName}.outorgado_snapshot outor
    ON proc.idOutorgadoSnapshot = outor.id
  LEFT JOIN (${infoAtivoPorProxy}) ipx
    ON cadeia.idProxyAtual = ipx.idProxy
  LEFT JOIN ${schemaName}.proxy_procuracao prox
    ON proc.id = prox.idProcuracao
  INNER JOIN DIPES.arhfot01 arh
    ON arh.matricula = COALESCE(outor.matricula, ipx.matricula)
WHERE
  # remove procuracoes dentro das proxies
  prox.idProxy IS NULL
  # remove proxies anteriores, mantendo apenas a mais recente
  AND
    (
      (cadeia.idProxyAtual IS NOT NULL AND ipx.matricula IS NOT NULL)
      OR
      (cadeia.idProcuracaoAtual IS NOT NULL)
    )
ORDER BY COALESCE(proc.createdAt, ipx.createdAt) DESC
`;

/**
 * Retorna as ids das procuracoes e proxies
 */
const getIdsPorPesquisaBase = /*sql*/`
SELECT
  a.*,
  b.*,
  mst.municipio,
  mst.nm_uf AS uf,
  CONCAT("Endereço: ", mst.logradouro, " - Complemento: ", mst.compl_logradouro, " - Bairro: ", mst.bairro, " - CEP: ", mst.cep) AS endereco
FROM
  (${idsAtivoMatricula}) a
INNER JOIN (
  SELECT
    TRIM(arh.matricula) as matricula_ARH,
    TRIM(arh.prefixo_lotacao) as prefixo_lotacao,
    TRIM(arh.cpf_nr) AS cpf,
    TRIM(arh.data_nasc) AS dataNasc,
    TRIM(estCivil.descricaoResumida) AS estadoCivil,
    TRIM(arh.rg_emissor_uf) AS rg
  FROM
    DIPES.arhfot01 arh
    INNER JOIN DIPES_SAS.arhEstadoCivil estCivil
      ON estCivil.codigo = arh.est_civil
  ) b ON b.matricula_ARH = a.matricula
LEFT JOIN DIPES.mst606 mst
  ON mst.prefixo = a.prefixo AND mst.cd_subord = 0
`;

/**
 * Retorna as ids das procuracoes e proxies
 * com base se são ativas ou não
 * e então se a pesquisa match o prefixo
 */
const getIdsPorPesquisaPrefixo = /*sql*/`
${getIdsPorPesquisaBase}
WHERE
  a.prefixo = ?
  AND a.ativo = ?
ORDER BY a.createdAt DESC
`;

/**
 * Retorna a mais recente (por matricula) dos ids das procuracoes e proxies
 * com base se são ativas ou não
 * e então se a pesquisa match o prefixo
 */
const getIdsPorPesquisaPrefixoMaisRecente = /*sql*/`
WITH ranked AS (
  SELECT
    a.*,
    ROW_NUMBER() OVER (PARTITION BY matricula ORDER BY createdAt DESC) AS rn
  FROM (${getIdsPorPesquisaBase}) AS a
  WHERE
    a.prefixo = ?
    AND a.ativo = ?
)
SELECT * FROM ranked r WHERE r.rn = 1
`;

/**
 * Retorna as ids das procuracoes e proxies
 * com base se são ativas ou não
 * e então se a pesquisa match a matricula ou nome
 */
const getIdsPorPesquisaPessoa = /*sql*/`
${getIdsPorPesquisaBase}
WHERE (
    a.matricula LIKE ?
    OR a.nome LIKE ?
  ) AND a.ativo = ?
ORDER BY a.createdAt DESC
`;

/**
 * Retorna a mais recente (por matricula) dos ids das procuracoes e proxies
 * com base se são ativas ou não
 * e então se a pesquisa match a matricula ou nome
 */
const getIdsPorPesquisaPessoaMaisRecente = /*sql*/`
WITH ranked AS (
  SELECT
    a.*,
    ROW_NUMBER() OVER (PARTITION BY matricula ORDER BY createdAt DESC) AS rn
  FROM (${getIdsPorPesquisaBase}) AS a
  WHERE (
    a.matricula LIKE ?
    OR a.nome LIKE ?
  ) AND a.ativo = ?
  ORDER BY a.createdAt DESC
)
SELECT * FROM ranked r WHERE r.rn = 1
`;

/**
 * Pega todos os id das procuracoes e proxies
 * "pra baixo" na cadeia começando de
 * um idProcuracao ou um idProxy
 */
const getCadeiaAbaixoProcuracao = /*sql*/`
WITH RECURSIVE cadeia AS (
  # busca todas as procuracoes com base no inicial
  SELECT
    c.idProcuracaoAtual AS idProcuracao,
    c.idProxyAtual AS idProxy
  FROM
    app_procuracao.cadeia_procuracoes c
  WHERE
    c.idProxyParent = ?
    OR c.idProcuracaoParent = ?

  UNION ALL

  # a partir dai, pega todas com base na ultima recursão
  # retornando o idProcuracao ou idProxy para próxima recursao
  SELECT
    c2.idProcuracaoAtual,
    c2.idProxyAtual
  FROM
    app_procuracao.cadeia_procuracoes c2
  # sempre buscando por onde é parent
  JOIN cadeia ca
    ON c2.idProxyParent = ca.idProxy
    OR c2.idProcuracaoParent = ca.idProcuracao
)
SELECT * FROM cadeia;
`;

module.exports = {
  /**
   * excluindo estes metodos que precisam de input
   * os outros estão replicados como views de mesmo nome no banco de dados
   *
   * estou escolhendo deixar e usar o que esta aqui como strings
   * porque não é possível deixar comentários nas views
   */
  sqlRawQueries: {
    getCadeiaProcuracao,
    getIdsPorPesquisaPrefixo,
    getIdsPorPesquisaPrefixoMaisRecente,
    getIdsPorPesquisaPessoa,
    getIdsPorPesquisaPessoaMaisRecente,
    getCadeiaAbaixoProcuracao,
  }
};
