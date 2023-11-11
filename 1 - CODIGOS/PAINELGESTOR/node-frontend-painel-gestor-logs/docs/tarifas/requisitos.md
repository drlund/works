# Ferramentas Tarifas

## Descrição

Surgiu demanda para a devolução de tarifas cobradas clientes, pessoa jurídica e pessoa física, do Banco do Brasil e não possuem conta ativa no Banco do Brasil.
Deverá ser desenvolvida ferramenta que permita controlar tais pagamentos diretamente no caixa das agências ou via transferência bancária para outros bancos.

## Fluxo Básico

* A Super Adm receberá da Diretoria a listagem de clientes que irão receber as tarifas.
* Os clientes irão receber uma carta, informando que tem valores de tarifas a receber e que deverá se dirigir a uma agência ou ligar na CRBB.
* Quando o cliente se apresentar em um dos canais disponíveis, o funcionário deverá consultar a lista de clientes disponibilizada na ferramenta.
* Caso o cliente faça jus ao pagamento, o funcionário do atendimento irá efetuar a reserva do pagamento em questão, já indicando o método de pagamento.
* O funcionário responsável pelo pagamento irá verificar se existe reserva de pagamento registrada para o cliente em questão. Caso positivo, ele irá realizar a transferência bancária ou pagamento em dinheiro para o cliente. No primeiro caso, o pagamento será efetuado no caixa de uma agência enquanto no segundo caso será efetuado pelo CENOP.
* Preferencialmente, o funcionário responsável pelo pagamento deverá realizar o upload do comprovante de pagamento na ferramenta. Porém, qualquer outro funcionário poderá realizar tal upload.
* Um funcionário com nível gerencial deverá visualizar os dados da reserva, já com o documento digitalizado e confirmar o pagamento da mesma, finalizando o processo daquele lançamento

## Atividades

* [x] Público Alvo
* [x] Realizar Reserva
* [x] Pendentes de Pagamento
* [x] Comprovante de pagamento
* [x] Ocorrências pagas
* [x] Pendências CENOP
* [x] Comprovante de pagamento
* [x] Confirmação do pagamento
