Para obter o último registro de uma tabela no AdonisJS 4.1 com um banco de dados MySQL, você pode usar o Query Builder do Adonis para construir uma consulta SQL que ordena os registros pela coluna de data e hora em ordem decrescente e, em seguida, limita o resultado a um único registro. Aqui está um exemplo de como você pode fazer isso:

1. Importe o Model correspondente à tabela que deseja consultar:

```javascript
const SeuModel = use('App/Models/SeuModel')
```

2. Construa a consulta para obter o último registro:

```javascript
const ultimoRegistro = await SeuModel.query()
  .orderBy('created_at', 'desc') // Substitua 'created_at' pelo nome da coluna de data e hora, se for diferente
  .first()
```

3. `ultimoRegistro` conterá o último registro da tabela com base na coluna de data e hora.

Lembre-se de substituir `'created_at'` pelo nome correto da coluna que armazena a data e hora do registro, se for diferente. Certifique-se também de que o Model `SeuModel` esteja corretamente importado e configurado para a tabela desejada.

Essa consulta irá ordenar os registros pela coluna de data e hora em ordem decrescente e, em seguida, pegar o primeiro registro, que será o último registro da tabela.