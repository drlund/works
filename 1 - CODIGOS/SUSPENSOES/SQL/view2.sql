SELECT DISTINCT `suspensaoIndicacao`.`id` AS `id`, 'Vice Presidencia' AS `tipo`
	,`suspensaoIndicacao`.`vicePresi` AS `valor`
	,`suspensaoIndicacao`.`tipoSuspensao` AS `tipoSuspensao`
	,`suspensaoIndicacao`.`validade` AS `validade`
	,`suspensaoIndicacao`.`matriculaResponsavel` AS `matriculaResponsavel`
	,`suspensaoIndicacao`.`observacao` AS `observacao`
FROM `suspensaoIndicacao`
WHERE `suspensaoIndicacao`.`vicePresi` <> '0' AND `suspensaoIndicacao`.`ativo` = '1'

UNION

SELECT DISTINCT `suspensaoIndicacao`.`id` AS `id`, 'Unidade Estratégica' AS `tipo`
	,`suspensaoIndicacao`.`diretoria` AS `valor`
	,`suspensaoIndicacao`.`tipoSuspensao` AS `tipoSuspensao`
	,`suspensaoIndicacao`.`validade` AS `validade`
	,`suspensaoIndicacao`.`matriculaResponsavel` AS `matriculaResponsavel`
	,`suspensaoIndicacao`.`observacao` AS `observacao`
FROM `suspensaoIndicacao`
WHERE `suspensaoIndicacao`.`diretoria` <> '0' AND `suspensaoIndicacao`.`ativo` = '1'

UNION

SELECT DISTINCT `suspensaoIndicacao`.`id` AS `id`, 'Unidade Tática' AS `tipo`
	,`suspensaoIndicacao`.`super` AS `valor`
	,`suspensaoIndicacao`.`tipoSuspensao` AS `tipoSuspensao`
	,`suspensaoIndicacao`.`validade` AS `validade`
	,`suspensaoIndicacao`.`matriculaResponsavel` AS `matriculaResponsavel`
	,`suspensaoIndicacao`.`observacao` AS `observacao`
FROM `suspensaoIndicacao`
WHERE `suspensaoIndicacao`.`super` <> '0' AND `suspensaoIndicacao`.`ativo` = '1' 

UNION

SELECT DISTINCT `suspensaoIndicacao`.`id` AS `id`, 'Super Comercial' AS `tipo`
	,`suspensaoIndicacao`.`gerev` AS `valor`
	,`suspensaoIndicacao`.`tipoSuspensao` AS `tipoSuspensao`
	,`suspensaoIndicacao`.`validade` AS `validade`
	,`suspensaoIndicacao`.`matriculaResponsavel` AS `matriculaResponsavel`
	,`suspensaoIndicacao`.`observacao` AS `observacao`
FROM `suspensaoIndicacao`
WHERE `suspensaoIndicacao`.`gerev` <> '0' AND `suspensaoIndicacao`.`ativo` = '1'

UNION

SELECT DISTINCT `suspensaoIndicacao`.`id` AS `id`, 'Prefixo' AS `tipo`
	,`suspensaoIndicacao`.`prefixo` AS `valor`
	,`suspensaoIndicacao`.`tipoSuspensao` AS `tipoSuspensao`
	,`suspensaoIndicacao`.`validade` AS `validade`
	,`suspensaoIndicacao`.`matriculaResponsavel` AS `matriculaResponsavel`
	,`suspensaoIndicacao`.`observacao` AS `observacao`
FROM `suspensaoIndicacao`
WHERE `suspensaoIndicacao`.`prefixo` <> '0' AND `suspensaoIndicacao`.`ativo` = '1'

UNION

SELECT DISTINCT `suspensaoIndicacao`.`id` AS `id`, 'Matricula' AS `tipo`
	,`suspensaoIndicacao`.`matricula` AS `valor`
	,`suspensaoIndicacao`.`tipoSuspensao` AS `tipoSuspensao`
	,`suspensaoIndicacao`.`validade` AS `validade`
	,`suspensaoIndicacao`.`matriculaResponsavel` AS `matriculaResponsavel`
	,`suspensaoIndicacao`.`observacao` AS `observacao`
FROM `suspensaoIndicacao`
WHERE `suspensaoIndicacao`.`matricula` <> '0' AND `suspensaoIndicacao`.`ativo` = '1'