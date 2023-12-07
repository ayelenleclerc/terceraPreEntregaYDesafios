//Prototipo 1

// const suma = (...numbers) => {
//     if(numbers.length===0) return 0;
//     const aParameterIsntNumber = numbers.some( e => typeof e !== 'number');
//     if(aParameterIsntNumber) return null;
//     let suma = 0;
//     numbers.forEach(number=>{
//         suma+=number;
//     })
//     return suma;
// }

//Prototipo 2
// const suma = (...numbers) => {
//     if(numbers.length===0) return 0;
//     const aParameterIsntNumber = numbers.some( e => typeof e !== 'number');
//     if(aParameterIsntNumber) return null;
//     let suma = numbers.reduce((accumulator,currentValue) => accumulator+currentValue);
//     return suma;
// }

//Prototipo 3
const suma = (...numbers) => {
  if (numbers.length === 0) return 0;
  let result = 0;
  for (let i = 0; i < numbers.length; i++) {
    if (typeof numbers[i] !== "number") {
      return null;
    } else {
      result += numbers[i];
    }
  }
  return result;
};

let testsPasados = 0;
let tests = 4;
console.log("Comenzando pruebas para función SUMA");

console.log(
  `Test 1. La función deberá devolver null si algún parámetro no es de tipo numérico`
);
const resultTest1 = suma(1, false);
if (resultTest1 === null) {
  console.log("Test 1 pasado");
  testsPasados++;
} else
  console.log(
    `Test 1 No pasado, se esperaba un valor null, pero la función devolvió ${resultTest1}`
  );

console.log(
  `Test 2. La función deberá devolver 0 si no se pasó ningún parámetro`
);
const resultTest2 = suma();
if (resultTest2 === 0) {
  console.log("Test 2 pasado");
  testsPasados++;
} else
  console.log(
    `Test 2 No pasado, se esperaba un valor 0, pero la función devolvió ${resultTest2}`
  );

console.log(
  `Test 3. La función deberá resolverse correctamente para parámetros válidos`
);
const resultTest3 = suma(3, 5);
if (resultTest3 === 8) {
  console.log("Test 3 pasado");
  testsPasados++;
} else
  console.log(
    `Test 3 No pasado, se esperaba un valor 8, pero la función devolvió ${resultTest3}`
  );

console.log(
  `Test 4. La función deberá resolverse correctamente para n número de parámetros`
);
const resultTest4 = suma(3, 5, 2, 1, 1, 4);
if (resultTest4 === 16) {
  console.log("Test 4 pasado");
  testsPasados++;
} else
  console.log(
    `Test 4 No pasado, se esperaba un valor 8, pero la función devolvió ${resultTest4}`
  );

if (testsPasados === tests) console.log("Todas las pruebas pasaron con éxito");
else
  console.log(`Se han pasado ${testsPasados} pruebas de un total de ${tests}`);
