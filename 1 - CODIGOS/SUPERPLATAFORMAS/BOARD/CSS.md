Para fazer com que cada componente `Board` ocupe a página inteira, um ao lado do outro e mude de linha quando completar, você pode usar CSS para controlar o layout. Você pode usar flexbox ou CSS grid para criar essa disposição.

Aqui está um exemplo usando CSS flexbox:

```css
/* Estilize o container que envolve os componentes Board */
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; /* Controla o espaçamento entre os componentes */
  gap: 20px; /* Define o espaçamento entre os componentes */
}

/* Estilize cada componente Board */
.Board {
  flex: 0 0 calc(33.33% - 20px); /* Defina a largura desejada para cada componente */
  /* Você pode ajustar o valor acima para controlar quantos componentes são exibidos em uma linha */
  margin-bottom: 20px; /* Espaçamento inferior entre os componentes */
}
```

Certifique-se de adicionar a classe `container` ao elemento que envolve os componentes `Board` e aplicar a classe `Board` a cada instância do componente `Board`. Ajuste os valores conforme necessário para obter o layout desejado.

Lembre-se de que esses estilos CSS devem ser aplicados ao seu código para obter o layout desejado. Certifique-se de incluir esse CSS em seu aplicativo.