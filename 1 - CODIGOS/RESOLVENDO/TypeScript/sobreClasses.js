/**A palavra-chave new só deve ser usada com objetos que definem uma função construtora. Use-o com qualquer 
 * outra coisa e você obterá um TypeError porque não haverá uma função construtora para a nova palavra-chave invocar.
 */ 

// Exemplo de código não compatível

function MyClass() {
  this.foo = 'bar';
}

var someClass = 1;

var obj1 = new someClass;    // Não compatível;
var obj2 = new MyClass();    // Não compatível se considerar o parâmetro JSDoc definido como verdadeiro. Compatível quando considera JSDoc=false

// Solução compatível

/**
 * @constructor
 */
function MyClass() {
  this.foo = 'bar';
}

var someClass = function(){
  this.prop = 1;
}

var obj1 = new someClass;  // Compatível
var obj2 = new MyClass();  // Compatível independentemente de considerar o valor JSDoc