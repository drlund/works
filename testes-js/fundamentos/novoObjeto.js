novoObjeto = {
    teste: 15,
    valor: 13,
    resultado: function(){
        return this.teste * this.valor;
    }
}

const total = novoObjeto.resultado();
console.log(total);