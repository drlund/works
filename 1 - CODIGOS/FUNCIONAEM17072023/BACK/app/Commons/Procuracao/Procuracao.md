# Procurações Notas

## Fluxos de Procuração

O arquivo se encontra em: `app/Commons/Procuracao/useCases/__mocks__/FluxosProcuracao.js`

Ainda não migrei para o BD porque ainda não houve a necessidade.
Alterações que precisem ser feitas nos fluxos devem ser feitas no arquivo por hora.

### Modelo do fluxo

```js
// exemplo de fluxo:
"f8dd7ebd-8c5c-4f7e-92c0-4a9ac7e52ba4": {
    minuta: "1º Nível Gerencial UT (Superintendente UT)", // nome da minuta
    fluxo: FLUXOS.SUBSIDIARIA, // tipo do fluxo (subsidiaria, pública, particular)
    outorgados: TIPOS_OUTORGADO.SUPER_ADM, // tipo de acesso
    visibilidade: ["9009"]
  },

// exemplo de outorgado
SUPER_ADM: { // aceita apenas se ambos forem verdadeiro
  refOrganizacional: ["1GUT"], // array de refOrganizacional
  prefixos: ["9009"], // array de prefixos
},
PRIMEIRO_NIVEL: { // aceita qualquer um dos refOrganizacional
  refOrganizacional: ["1GUN"],
},
PREFIXOS: { // aceita qualquer um dos prefixos
  prefixos: ["9009", "0000"],
},
SEM_RESTRICAO: { // sempre é valido
},
INVALIDO: { // invalido porque existe chave, mas nunca será verdadeiro
  refOrganizacional: []
},
```

## Pesquisas

Pesquisas estão sendo feitas por "fora" do Lucid do Adonis. (`app/Commons/Procuracao/repositories/rawQueries/getCadeiaProcuracao.sql.js`)

Para facilitar testar parte a parte das consultas feitas, está replicado no BD as partes possíveis das consultas em views.
Caso haja alterações nas consultas, é interessante replicar as alterações nos bancos de dados também.

## Banco de Dados

Em `app/Commons/Procuracao/dev/resetDatabaseProcuracoes.sql` se encontra um dump zerado para funcionar a ferramenta. (Ele possui apenas o mínimo necessário e também as views.)

## Cadastro

Cadastro é um ponto de possível refatoração porque ficou muita regra de negócio dentro do repository.
Usando o AbstractUserCase atualizado, é possível também simplificar a maneira de escrever o UC do cadastro de procurações.

## Minutas

Ainda não há ferramenta para gerenciar os templates. Por isso é necessário fazer isso tudo manualmente.

As minutas estão na tabela: `minutas_template_base`.

A geração desses templates se da por meio do frontend em `/procuracoes/gerarMinuta`
