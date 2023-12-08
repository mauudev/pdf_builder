let str = '20pt';
let str1 = '20123.61rem';

const parsePointValue = (value) => {
  console.log(`value: ${value}`);
  const numericChars = [...value].filter((char) => !isNaN(char) || char === '.');
  return parseFloat(numericChars.join(''));
};

console.log(parsePointValue(str1));

// const ceroComoNumero = 0;
// const ceroComoCadena = '0';

// // Usando isNaN
// console.log(!isNaN(ceroComoNumero)); // true (0 es un número válido)
// console.log(!isNaN(ceroComoCadena)); // true ('0' se puede convertir a un número)

// // Usando Number.isNaN
// console.log(!Number.isNaN(Number(ceroComoNumero))); // true (0 es un número válido)
// console.log(!Number.isNaN(Number(ceroComoCadena))); // true ('0' se puede convertir a un número)
