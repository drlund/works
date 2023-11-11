# React App

## Setup do Projeto

### Requisitos

- Python 2.x
  - A confirmar: não é mais necessário para o frontend
- Node versão LTS
  - LTS 14.x - run e build, local e servidor funcionando
  - LTS 16.x - run e build local funciona, não testado no servidor
  - LTS 18.x - run e build local funciona, não testado no servidor
- Porta 3000 aberta

### Instalação

- clone do projeto
- `npm ci` para instalar dependências
  - `ci` para instalar exatamente as dependências do package-lock.json
- `.env` pode ser uma cópia renomeada do arquivo `.env.sample`
  - para ambiente de desenvolvimento, normalmente não é necessário alterar nada.

### Rodando o Projeto

- deixar rodando o projeto PHP
- deixar rodando o projeto Node/Adonis
- `npm start` para iniciar este app

## Nova Funcionalidade/App

- Criar nova branch
  - Preferencialmente com base na `master`

### Setup de funcionalidade

Os passos podem diferir quando criando algo do zero ou incrementando um app existente.

É possível que nem todos os apps precisem seguir todos os passos, ou que haja apps que precisem de alguma funcionalidade que não se encaixe no padrão.

- Sidebar
  - Criar entrada do menu em `src/components/sidebar/menuEntries/nomeAppEntries.js` (onde `nomeApp` é o nome da feature)
  - Importar o arquivo de entrada criado no arquivo `src\components\sidebar\SideBar.js`
    no array `rootSubmenuKeys` adicionar o nome escolhido para a key do `nomeAppEntries.js`
    no retorno do método render, adicionar na tag `Menu` a tag do componente criado em `nomeAppEntries.js`
  - [Exemplo](docs/Exemplo.md#sidebar)

- Rotas
  - Criar o arquivo de rotas em `src\config\apps\nomeApp.config.js`
  - Importar o arquivo de rotas em `src/config/menu.config.js` no objeto do export default criar o `nomeApp` e vincular ao arquivo de rota importado
  - [Exemplo](docs/Exemplo.md#rotas)

- Paginas do app
  - Criar paginas do app em `src/pages/NomeApp`

### Inclusão de permissão de usuários

#### Dentro da Ferramenta rodando

É necessário fazer separadamente em `desenvolvimento` e em `produção`.

Estas ações são feitas dentro de:

- `$URL/v8/app/administrar/acessos`
- `$URL/v8/app/administrar/permissoes`

##### Vinculando um acesso à uma ferramenta

- No menu `Gestão de Acessos` e submenu `Acessos`, clique no botão `Nova Ferramenta`;
  - O `Acesso`, pode ser concedido por matrícula (F + 7 dígitos), por prefixo (4 dígitos), por UOR (9 dígitos) e por comitê de prefixo (C + 4 dígitos);
  - Escolha a Ferramenta e o(s) perfil(is) que deseja vincular ao identificador.

##### Incluir nova ferramenta em `Gestão de Acessos`

- No menu `Gestão de Acessos` e submenu `Perm. das Ferramentas`, clique no botão `Novo Acesso`;
  - Escolha o nome da ferramenta
  - Em lista de permissões, crie o nome das permissões que deseja adicionar. Deve ser escrito o nome da permissão em maisúsculas (ex. ADM, USUARIO, GESTOR_ACESSOS, etc.);
  - No campo Descrição, escreva de forma que permita identificar rapidamente o papel ou tipo de permissão que o usuário criado possuirá.

#### Vinculando um acesso ao código do app

Editar o arquivo `nomeAppEntries.js` e crie uma constante que chama o método

```js
verifyPermission({
  ferramenta, // nome da ferramenta a ser verificada a permissao de acesso.
  permissoesRequeridas, // array com a lista das permissoes requeridas.
  authState, // objeto com os dados de autenticacao do usuario contido no store da aplicacao.
  verificarTodas, // se for passado e for true, somente retorna true somente se
})
// retorna true se usuario possui as permissoes, false caso contrario.
```

para fazer a verificação de permissão de acesso para o usuário corrente.

***
### Cadastramento no Gerenciador de Ferramentas

O Gerenciador de Ferramentas é uma aplicação que permite que coloquemos em "manutenção" a aplicação desejada através de um click. Pode ser acessada através de:
- `$URL/v8/gerenciador-ferramentas`

#### Cadastrando

No momento é necessário realizar a inclusão manual da ferramenta na tabela "app_ferramentas.ferramenta".
Sugerimos utilizar as informações inseridas no arquivo de rotas( `src\config\apps\nomeApp.config.js`) da nova aplicação para preencher os dados da tabela.
A unica coluna que DEVE conter a informação idêntica ao arquivo de rotas criado é a coluna "rootPath", que corresponde à informação "basePath" do seu arquivo de rotas.

```js
Ex:
Arquivo: mtn.config.js
linha 5 - const basePath = '/mtn/';
Valor da coluna "rootPath":  mtn
```

### Conexão com Backend

- Utilizar método GenericFetch
  - importar `{ FETCH_METHODS, fetch }` de `src/services/apis/GenericFetch.js`
- <span style="color:red;font-weight:bold">TODO</span>: padrão de conexão
  - Hoje
    - "ducks"
    - "useCases"
    - "api calls"

### Estrutura de Paginas/Componentes

- <span style="color:red;font-weight:bold">TODO</span>: padrão de estrutura de pastas
  - pages
    - nomeApp
        - index.js
        - components
            - ComponentName.js
        - apiCalls
            - callName.js
        - commons
            - complexFunctionName.js

#### Redux - deprecated

Redux ainda é usado em várias das ferramentas, mas se não surgir a necessidade, o Context API é normalmente mais que suficiente.

<span style="color:red;font-weight:bold">TODO</span>: Redux

## Finalização da Funcionalidade/App

### Homologação

<span style="color:red;font-weight:bold">TODO</span>: passos para homologação

### Produção

Passos necessários após terminar uma funcionalidade para fazer o deployment em produção.

<span style="color:red;font-weight:bold">TODO</span>: Finalizar funcionalidade/app

## Requisitos básicos e checklist

Para merges e para desenvolvimento em geral:

- [ ] Boas práticas de GIT ([Obrigatório](http://git.uop.bb.com.br/superadm/documentacao-super-adm/wikis/GIT/Merges/Checklist/Legenda#obrigat%C3%B3rio))
  - Verificar na [WIKI](http://git.uop.bb.com.br/superadm/documentacao-super-adm/wikis/GIT/Pr%C3%A1ticas)
- [ ] Verificar Testes ([Bloqueante](http://git.uop.bb.com.br/superadm/documentacao-super-adm/wikis/GIT/Merges/Checklist/Legenda#bloqueante))
  - Rodar `npm run test:ci`
  - Merge não pode ser aceito se os testes não estiverem passando
- [ ] Issues da funcionalidade ([Bloqueante](http://git.uop.bb.com.br/superadm/documentacao-super-adm/wikis/GIT/Merges/Checklist/Legenda#bloqueante))
  - Verificar todas as `issues` abertas e verificar se todas foram devidamente fechadas.
- [ ] Linter ([Bloqueante](http://git.uop.bb.com.br/superadm/documentacao-super-adm/wikis/GIT/Merges/Checklist/Legenda#bloqueante))
  - Verificar na ([WIKI](http://git.uop.bb.com.br/superadm/documentacao-super-adm/wikis/React/Lint/ESLint))
  - Rodar `npx lint-prepush`
  - Merge não pode ser aceito com erros
      - Preferencialmente, eliminar os warnings também
- [ ] Deploy na homologação ([Opcional](http://git.uop.bb.com.br/superadm/documentacao-super-adm/wikis/GIT/Merges/Checklist/Legenda#opcional))
  - Verificar na [WIKI](http://git.uop.bb.com.br/superadm/documentacao-super-adm/wikis/Deploy/Homologa%C3%A7%C3%A3o)
- [ ] Testes das funcionalidades ([Opcional](http://git.uop.bb.com.br/superadm/documentacao-super-adm/wikis/GIT/Merges/Checklist/Legenda#opcional))
  - Verificar na ([WIKI](http://git.uop.bb.com.br/superadm/documentacao-super-adm/wikis/React/Testes-React))
