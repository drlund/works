Entendi a sua preocupação com a estética. Você pode adicionar um rótulo abaixo do ícone "BulbFilled" para mostrar o status da seguinte maneira:

```jsx
<div style={{ alignItems: 'center', textAlign: 'center' }}>
  <Tooltip
    title={`Inicio da Atualização: ${
      inicioAtualizacao
        ? moment(inicioAtualizacao).format('DD/MM/YYYY - HH:mm:ss')
        : 'não finalizado!'
    } - Final da Atualização: ${
      finalAtualizacao
        ? moment(finalAtualizacao).format('DD/MM/YYYY - HH:mm:ss')
        : 'não finalizado!'
    }`}
  >
    <BulbFilled style={{ fontSize: '35px', color: corDaLampada }} />
  </Tooltip>
  <div style={{ marginTop: '8px' }}>{getStatusLabel()}</div>
</div>
```

Agora, o rótulo do status será exibido abaixo do ícone "BulbFilled", melhorando a estética do seu componente. Certifique-se de ajustar os estilos de margem (ou outros estilos) conforme necessário para obter o resultado desejado.