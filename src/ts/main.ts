function from10to2(n: number): string {
  let module: number = n < 0 ? n * -1 : n;
  let result: string = '';

  while (module / 2 >= 1) {
    result = String(module % 2) + result;
    module = Math.floor(module / 2);
  }

  result = String(module) + result;

  if (n < 0) result = '-' + result;

  return result;
}


function readProblem(problem: string): number[] | null {
  const p: string = problem.trim();
  const allowed: string = '+-1234567890';

  for (let sym of p) {
    if (!allowed.includes(sym)) {
      return null;
    }
  }

  let sign: number = p.lastIndexOf('+');

  if (sign === 0 || sign === -1) {
    sign = p.lastIndexOf('-');
  } else if (sign === (p.length - 1)) {
    return null;
  }

  if (sign === 0 || sign === -1 || sign === (p.length - 1)) {
    return null;
  }

  if (p.lastIndexOf('-') === (p.length - 1)) return null;

  return [Number(p.slice(0, sign)), Number(p.slice(sign))];
}


function convert(num: string): string | string[] {
  let originalNum: string = (num[0] === '+' || num[0] === '-') ? num.slice(1) : num;
  
  if (originalNum.length > 7) {
    return 'Вибачте, програма не працює з такими числами.';
  } 

  let straightCode: string = '';
  if (num[0] === '-') {
    straightCode += 1;
  } else {
    straightCode += 0;
  }

  for (let i = 0; i < (7 - originalNum.length); i++) {
    straightCode += '0';
  }

  straightCode += originalNum;

  let addCode: string = '';
  
  if (num[0] === '-') {
    let reverseCode = straightCode[0] + straightCode
                                      .slice(1)
                                      .split('')
                                      .map((symbol: string) => symbol === '1' ? '0' : '1')
                                      .join('');
                                  
    addCode = binaryAddSum(reverseCode, '00000001');
  } else {
    addCode = straightCode;
  }
  
  return [straightCode, addCode];
}


function binaryAddSum(addBin1: string, addBin2: string): string {
  let result: string = '';
  let curr: number = 0;

  for (let i = 7; i >= 0; i--) {
    if (+addBin1[i] + +addBin2[i] + curr <= 1) {
      result = String(+addBin1[i] + +addBin2[i] + curr) + result;
      curr = 0;
    } else {
      result = +addBin1[i] + +addBin2[i] + curr === 3 ? '1' + result : '0' + result;
      curr = 1;
    }
  }

  return result;
}


function calcResult(term1: number, term2: number): string[] | string {
  const t1: string | string[] = convert(from10to2(term1));
  const t2: string | string[] = convert(from10to2(term2));

  if (typeof t1 === 'string' || typeof t2 === 'string') {
    return typeof t1 === 'string' ? t1 : t2;
  }

  const [straigthCode1, addCode1]: string[] = t1;
  const [straigthCode2, addCode2]: string[] = t2;

  const addCodeSum: string = binaryAddSum(addCode1, addCode2);

  let straightCodeSum: string = '';
  if (addCodeSum[0] === '0') { 
    straightCodeSum = addCodeSum;
  } else {
    let reverseCodeSum = binaryAddSum(addCodeSum, '11111111');
    straightCodeSum = reverseCodeSum[0] + reverseCodeSum
                                            .slice(1)
                                            .split('')
                                            .map(digit => digit === '0' ? '1' : '0')
                                            .join('');
  } 

  return [straigthCode1, addCode1, straigthCode2, addCode2, addCodeSum, straightCodeSum];
}

const input: HTMLInputElement = document.querySelector('.column__input > input') as HTMLInputElement,
      result: HTMLHeadingElement = document.querySelector('.sum > h1') as HTMLHeadingElement,
      resultBlock: HTMLDivElement = document.querySelector('.sum') as HTMLDivElement,
      output: NodeListOf<HTMLParagraphElement> = document.querySelectorAll('.out');

input.oninput = (e: Event): void => {
  const inputStr = (e.target as HTMLInputElement).value;

  if (inputStr.trim() === '') {
    result.textContent = 'Ви ще не ввели приклад';
    resultBlock.classList.remove('done');
    resultBlock.classList.remove('wrong');

    output.forEach((item) => {
      item.textContent = '';
    });

    return;
  }

  const terms: number[] | null = readProblem(inputStr);

  if (!terms) {
    result.textContent = 'Некоректно введені дані';
    resultBlock.classList.remove('done');
    resultBlock.classList.add('wrong');

    output.forEach((item) => {
      item.textContent = '';
    });

    return;
  }

  const [t1, t2]: number[] = terms;
  const results: string | string[] = calcResult(t1, t2);

  if (typeof results === 'string') {
    result.textContent = results;
    resultBlock.classList.remove('done');
    resultBlock.classList.add('wrong');

    output.forEach((item) => {
      item.textContent = '';
    });

    return;
  }

  output.forEach((item, index) => {
    item.textContent = results[index];
  });

  resultBlock.classList.add('done');
  resultBlock.classList.remove('wrong');
  result.textContent = 'Обчислення виконані!'
}