function novoArray(){
    const array = [];
    const inicio = 7;

    for(let criaArray = 1; criaArray <= inicio; criaArray++){
        array.push(criaArray);  
    }
    return array;
}

const meuArray = novoArray();
console.log(meuArray);