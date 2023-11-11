# Testagem de Componentes com ANTD que podem dar problemas

Goto:

- [Date Picker](#date-picker)
- [Modais Duplicados em Testes](#modais-aparecendo-de-maneira-duplicada)
- [Select](#select)
- [Upload](#upload)

## Date Picker

Considerando os problemas do [Select](#select), foi feito um helper para o `DatePicker`.

Importe `selectInDatePicker`

## Modais aparecendo de maneira duplicada

Alguns modais, conforme são abertos durante os testes, não são fechados.
Neste caso adicione o seguinte:

```js
afterEach(() => {
  document.body.innerHTML = '';
});
```

Isso força a destruição de qualquer coisa dentro do `body`, resetando o state do `document`.

## Select

`Select` não reconhece `userEvent.click` (`userEvent` é a maneira recomendada de interagir com elementos), então é necessário usar o `fireEvent.mouseDown`.
Caso tenha problemas em achar e interagir com o select e exista apenas um deles em tela, é possível usar o utilitário `clickComboBox()`

## Upload

Para testar o componente de `Upload`, adicione um `data-testid` ao componente.
Por meio dele, você tem acesso direto ao `input` para, por exemplo:

```js
await userEvent.upload(
  screen.getByTestId('meu teste id'),
  new File(['mockFile'], 'mock.mp4', { type: 'video/mp4' }),
);
```
