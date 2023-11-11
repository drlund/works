function meuarray(){
    const array = [];
    const qtd =  6;

    for(let i = 0; i <= qtd; i++){
        array.push(i);
    }

    return array;
}

const resultado = meuarray();
console.log(resultado);