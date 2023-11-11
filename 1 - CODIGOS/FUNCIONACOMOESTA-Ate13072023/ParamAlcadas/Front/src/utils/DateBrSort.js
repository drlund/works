const prepareDate = paramDate => {
  if (paramDate === null || paramDate === "") {
    return 0;
   }
 
   if (paramDate.indexOf(':') !== -1) {
     let left = paramDate.substr(0, 10);
     let right = paramDate.substr(paramDate.indexOf(':')-2);
     let brDate = left.split('/');
     let brHour = right.split(':');
     if (brHour.length === 3) {
      return new Date(brDate[2], brDate[1], brDate[0], brHour[0], brHour[1], brHour[2]);
     } else {
      return new Date(brDate[2], brDate[1], brDate[0], brHour[0], brHour[1]);
     }
   } else {
     let brDate = paramDate.split('/');
     return new Date(brDate[2], brDate[1], brDate[0]);
   } 
}

export default (a, b) => {

  a = prepareDate(a);
  b = prepareDate(b);
  //Caso a data esteja em um formato inválido, será considerado um valor menor que qualquer outro
  if(a instanceof Date && isNaN(a)){
    return 1;
  }
  if(b instanceof Date && isNaN(b)){
    return -1;
  }

  return ((a < b) ? -1 : ((a > b) ? 1 : 0));
}