arece que o problema pode estar na forma como você está tentando acessar "nomeResponsavel" dos parâmetros da solicitação em sua função `patchPlataforma` do controller. Em vez de `request.allParams()`, você deve usar `request.all()` para obter os parâmetros da solicitação corretamente.

Altere a linha:

```javascript
const { id, nomeResponsavel } = request.allParams();
```

para:

```javascript
const { id, nomeResponsavel } = request.all();
```

Isso deve garantir que "nomeResponsavel" seja corretamente definido a partir dos parâmetros da solicitação e evitar que ele chegue como `undefined`. Certifique-se de fazer essa alteração e teste novamente.