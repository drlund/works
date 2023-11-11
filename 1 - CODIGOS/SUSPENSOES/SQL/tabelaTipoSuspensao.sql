-- Entendi melhor agora. Se a tabela "suspensaoIndicacao" já possui um campo chamado "tipoSuspensao" que mostra o "id" da tabela 
-- "tipoSuspensao", mas você deseja exibir a "mensagem" em vez do "id" no seu dataTable do frontend, você pode fazer uma 
-- modificação na sua consulta SQL usando a cláusula JOIN e a cláusula SELECT com um alias (apelido) para o campo "mensagem". 
-- Assim, você pode substituir o valor "id" pelo valor "mensagem" diretamente na consulta.

-- Supondo que a tabela "tipoSuspensao" tenha os campos "id" e "mensagem", e que a tabela "suspensaoIndicacao" tenha o campo "tipoSuspensao" que faz referência ao campo "id" da tabela "tipoSuspensao", aqui está o exemplo de como fazer a consulta:

SELECT suspensaoIndicacao.id, tipoSuspensao.mensagem AS tipoSuspensao
FROM suspensaoIndicacao
JOIN tipoSuspensao ON suspensaoIndicacao.tipoSuspensao = tipoSuspensao.id;

-- Neste exemplo, usamos a cláusula `AS` para dar um apelido ao campo "mensagem" da tabela "tipoSuspensao". Com o alias 
-- "tipoSuspensao", o resultado da consulta irá trazer o campo "mensagem" da tabela "tipoSuspensao" com o nome "tipoSuspensao", 
-- substituindo o valor "id" que estaria originalmente no campo "tipoSuspensao" da tabela "suspensaoIndicacao".

-- Ao exibir os dados no dataTable do seu frontend, certifique-se de mostrar a coluna com o nome "tipoSuspensao" que agora 
-- conterá a mensagem da tabela "tipoSuspensao" em vez do "id".

-- Isso deve resolver o problema e exibir a "mensagem" da tabela "tipoSuspensao" no lugar do "id" na tabela "suspensaoIndicacao" 
-- no seu frontend.