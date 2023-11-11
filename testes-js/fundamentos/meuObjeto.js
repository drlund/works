meuObjeto = {
    primeiro: 10,
    segundo: 7,
    terceiro: function(){
        return this.primeiro * this.segundo;
    }
}

const resultado = meuObjeto.terceiro();
console.log(resultado);