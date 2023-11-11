const meuObjeto = {
    entrada: 25,
    saida: 15,
    total: function(){
        return this.entrada * this.saida;
    }
}

console.log(meuObjeto.total());