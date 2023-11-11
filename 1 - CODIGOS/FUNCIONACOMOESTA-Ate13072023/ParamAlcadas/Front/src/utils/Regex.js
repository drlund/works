/**
 *   Conjunto de expressões regulares comuns para serem utilizadas.
 * 
 *    A classe RegExp possui o método .test(), que recebe uma string e retorna true ou false, de acordo com expressão.
 * 
 * 
 */



var testeMatricula = /^(F|f)\d{7}$/;
var testePrefixo =  /^\d{1,4}$/;

export {
  testeMatricula,
  testePrefixo
}

export function mascaraCPF(v){
  v=v.replace(/\D/g,"");//Remove tudo o que não é dígito
  
  if (v.length > 3 && v.length < 7) {
    v=v.replace(/(\d{3})(\d{1,3})$/,"$1.$2");  
  } if (v.length >= 7 && v.length < 10) {
    v=v.replace(/(\d{3})(\d{3})(\d{1,3})$/,"$1.$2.$3");
  } else {
    v=v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})$/,"$1.$2.$3-$4");
  }

  return v.substr(0, 14);
}

export function mascaraCNPJ(v) {
  v=v.replace(/\D/g,"");//Remove tudo o que não é dígito

  if (v.length > 2 && v.length < 6) {
    v=v.replace(/(\d{2})(\d{1,3})$/,"$1.$2");  
  } else if (v.length >= 6 && v.length < 9) {
    v=v.replace(/(\d{2})(\d{3})(\d{1,3})$/,"$1.$2.$3");
  } else if (v.length >= 9 && v.length < 13) {
    v=v.replace(/(\d{2})(\d{3})(\d{3})(\d{1,4})$/,"$1.$2.$3/$4");
  } else {
    v=v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})$/,"$1.$2.$3/$4-$5");
  }

  return v.substr(0, 18);
}

export function mascaraCelular(v){
  v=v.replace(/\D/g,""); //Remove tudo o que não é dígito
  
  if (v.length < 2) {
    v=v.replace(/(\d{1,2})$/,"($1");  
  } else if (v.length === 2) {
    v=v.replace(/(\d{2})$/,"($1)");
  } else if (v.length > 2 && v.length < 8) {
    v=v.replace(/(\d{2})(\d{1,5})$/,"($1) $2");
  } else {
    v=v.replace(/(\d{2})(\d{5})(\d{1,4})$/,"($1) $2-$3");
  }

  return v.substr(0, 15);
}

export function mascaraValor(v){
  v=String(v);
	v=v.replace(/\D/g,"");//Remove tudo o que não é dígito  
    v=v.replace(/(\d)(\d{15})$/,"$1.$2");//coloca o ponto dos trilhões  
    v=v.replace(/(\d)(\d{11})$/,"$1.$2");//coloca o ponto dos bilhões  
    v=v.replace(/(\d)(\d{8})$/,"$1.$2");//coloca o ponto dos milhões  
    v=v.replace(/(\d)(\d{5})$/,"$1.$2");//coloca o ponto dos milhares  

    if (v.length === 2) {
    	v=v.replace(/(\d)(\d{1})$/,"$1,$2");//coloca a virgula antes dos 2 últimos dígitos
    } else {
    	v=v.replace(/(\d)(\d{2})$/,"$1,$2");//coloca a virgula antes dos 2 últimos dígitos
    }
      
    return v;  
}

export function mascaraValorSemCentavos(v){
  v=String(v);
	v=v.replace(/\D/g,"");//Remove tudo o que não é dígito  
  v=v.replace(/(\d)(\d{12})$/,"$1.$2");//coloca o ponto dos trilhões  
  v=v.replace(/(\d)(\d{9})$/,"$1.$2");//coloca o ponto dos bilhões  
  v=v.replace(/(\d)(\d{6})$/,"$1.$2");//coloca o ponto dos milhões  
  v=v.replace(/(\d)(\d{3})$/,"$1.$2");//coloca o ponto dos milhares  
  return v;  
}

export function mascaraInteiro(v){
	v=v.replace(/\D/g,"");//Remove tudo o que não é dígito  
    return v;  
}

export function doubleToMoeda(doubleValue) {
  let sdv = String(doubleValue);

  if (sdv.includes(".")) {
    sdv = sdv.replace(".", "");   
  } else {
    sdv = sdv + "00";
  }

  return mascaraValor(sdv);
}