'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((val, i) => {
    const type = val > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${val}€</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance} €`;
};

const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€`;
};

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  //Display balance
  displayBalance(acc);

  //Display summary
  calcDisplaySummary(acc);
};

//create username
const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};

createUsername(accounts);

//Login with userName

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI and message

    labelWelcome.textContent = `Welcome back,${
      currentAccount.owner.split(' ')[0]
    }`;

    //return opacity
    containerApp.style.opacity = 100;

    //clear input feilds
    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();
    //update account
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieveAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    recieveAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recieveAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement

    currentAccount.movements.push(amount);

    // Update UI

    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    console.log(index);

    //delete account
    accounts.splice(index, 1);

    //Hide the Ui display
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '';

  labelWelcome.textContent = 'Log in to get started';
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);

  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*
// for (const mov of movements) {
for (const [i, mov] of movements.entries()) {
  if (mov > 0) {
    console.log(`Movement: ${i + 1} You have deposit ${mov}`);
  } else {
    console.log(`Movement: ${i + 1} You have withdrew ${Math.abs(mov)}`);
  }
}

console.log('_____ for each _____');

movements.forEach((mov, i) => {
  if (mov > 0) {
    console.log(`Movement: ${i + 1} You have deposite ${mov}`);
  } else {
    console.log(`Movement: ${i + 1} You have withdrew ${Math.abs(mov)}`);
  }
});


*/

/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (vlaue, key, map) {
  console.log(`${key}: ${vlaue}`);
});

const currentCars = new Set(['BMW', 'Porche', 'Ferrari', 'ford']);

currentCars.forEach(function (value, _, map) {
  console.log(`${value}`);
});
*/
/*
const julias1 = [3, 5, 2, 12, 7];
const kates1 = [4, 1, 15, 8, 3];
const julias2 = [9, 16, 6, 8, 3];
const kates2 = [10, 5, 6, 1, 4];

const checkDogs = function (arr = [], arr2 = []) {
  arr.splice(0, 1);
  arr.splice(-2);

  const finalData = arr.concat(arr2);

  finalData.forEach(function (val, i, arr) {
    const type =
      val >= 3
        ? `Dog number ${i + 1} is an adult and is ${val} years old`
        : `Dog number ${i + 1} is still a puppy `;

    console.log(type);
  });
};

checkDogs(julias2, kates2);
*/

/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;

const movementTousd = movements.map(mov => mov * eurToUsd);

console.log(movementTousd);

const movementTousdfor = [];

for (const mov of movements) movementTousdfor.push(mov * eurToUsd);
console.log(movementTousdfor);

const movementDescription = movements.map(
  (mov, i) => `
    Movement ${i + 1} : You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
    mov
  )}
  `
);

console.log(movementDescription);



const deposit = movements.filter(movs => movs > 0);

const withdral = movements.filter(movs => movs < 0);

console.log(withdral);
console.log(deposit);



const balance = account2.movements.reduce((acc, curr) => acc + curr, 0);

console.log(balance);

const max = movements.reduce((acc, cur) => {
  if (acc < cur) return acc;
  else return cur;
}, movements[0]);

console.log(max);

const lineItems = [
  { description: 'Eggs (Dozen)', quantity: 1, price: 3, total: 3 },
  { description: 'Cheese', quantity: 0.5, price: 5, total: 2.5 },
  { description: 'Butter', quantity: 2, price: 6, total: 12 },
];

const avg = lineItems.reduce((acc, cur) => acc + cur.total, 0);

console.log(avg);


const calcAverageHumanAge = function (data) {
  const humanAge = data
    .map(val => (val <= 2 ? 2 * val : 16 + val * 4))
    .filter(age => age >= 18)
    .reduce((sum, value, i, arr) => sum + value / arr.length, 0);

  return humanAge;
};

console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));


//some
console.log(movements.includes(-400));

const anyDepos = movements.some(mov => mov > 5444444);

console.log(anyDepos);

//every

console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

//Seperate callback

const deposit = mov => mov > 0;

console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));


//Flat

const allmov = accounts.map(mov => mov.movements);

console.log(allmov);

const flatall = allmov.flat();

console.log(flatall);

const overall = accounts
  .map(mov => mov.movements)
  .flat()
  .reduce((acc, mov) => acc + mov);

console.log(overall);


// FlatMap()

const overall1 = accounts
  .flatMap(mov => mov.movements)
  .reduce((acc, mov) => acc + mov);

console.log(overall1);

const names = ['paplo', 'dama', 'abu', 'wegz'];

console.log(names.sort());

console.log(movements.sort());

//assending
movements.sort((a, b) => a - b);

console.log(movements);

//Dessending
movements.sort((a, b) => {
  if (a < b) return 1;
  if (a > b) return -1;
});

console.log(movements);



const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6));

const ar4 = new Array(8);
console.log(ar4);
console.log(ar4.map(() => 4));
arr.fill(1, 3, 7);
console.log(arr);

const s = Array.from({ length: 100 }, () => Math.trunc(Math.random() * 6) + 1);
console.log(s);



labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );

  console.log(movementsUI);
});


*/

// accumlator -> Snowball

// data 1 : [5,2,4,1,15,8,3]
// data 2 : [16,6,10,5,6,1,4]

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
//.1
dogs.forEach(elem => {
  elem.recommendedFood = Math.trunc(elem.weight ** 0.75 * 28);
});
console.log(dogs);

//.2
let dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);
console.log(
  `Sarah's dog is eating too ${
    dogSarah.curFood > dogSarah.recommendedFood ? 'much' : 'little'
  }`
);

// const ownersEatTooMuch = dogs.map(x => (x.owners = x.recommendedFood));
//.3
let ownersEatTooMuch = dogs
  .filter((cur, i) => {
    return cur.curFood > cur.recommendedFood;
  })
  .flatMap(x => x.owners);
console.log(ownersEatTooMuch);

let ownwersEatTooLittle = dogs
  .filter(cur => {
    return cur.curFood < cur.recommendedFood;
  })
  .flatMap(x => x.owners);
console.log(ownwersEatTooLittle);

//.4
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much`);

console.log(`${ownwersEatTooLittle.join(' and ')}'s dogs eat too little`);
// ownersEatTooMuch.forEach((dog, i) => {
//   console.log(`${dog} dogs eat too much`);
// });

//.5
let anydog = dogs.some(cur => cur.curFood === cur.recommendedFood);

console.log(anydog);

let redDog = cur =>
  cur.curFood > cur.recommendedFood * 0.9 &&
  cur.curFood < cur.recommendedFood * 1.1;

console.log(redDog);

//.7

console.log(dogs.filter(redDog));
//.8
const sortRec = dogs.slice().sort((a, b) => {
  if (a.recommendedFood < b.recommendedFood) {
    return -1;
  }
  if (a.recommendedFood > b.recommendedFood) {
    return 1;
  }
  return 0;
});

console.log(sortRec);
