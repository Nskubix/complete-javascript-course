'use strict';


//? BANKIST APP

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

function setUsernamesAndBalance(accounts){
    for(let i = 0; i < accounts.length; i++){
        accounts[i].username = accounts[i].owner.toLowerCase().split(" ").map(e => e[0]).join("").trim()
        accounts[i].balance = accounts[i].movements.reduce((acc,mov) => acc+mov,0)
    }
}
setUsernamesAndBalance(accounts);
inputLoginUsername.focus();

let user;

btnLogin.addEventListener("click",function(e){
    e.preventDefault();
    const input_username = inputLoginUsername.value.trim();
    const input_pin = inputLoginPin.value.trim();
    inputLoginPin.value = "";
    inputLoginUsername.value = "";
    for(const [i,account] of accounts.entries()){
        if(parseInt(input_pin) === account.pin && input_username === account.username){
            user = accounts[i];
            loginUser(user);
            break;
        }

    }
})

function loginUser(user){
    inputLoginUsername.blur();
    inputLoginPin.blur();
    containerApp.style.opacity = 1;
    displayMovements(user.movements);
    calcBalance(user);
    displayWelcomeMessage(user.owner.split(" ")[0]);
    displaySummary(user);
}

function displayWelcomeMessage(name){
    const hour = new Date(Date.now()).getHours();
    let time = hour >= 12 && hour <= 19 ? "Afternoon" : hour > 19 || hour < 6 ? "Night" : hour >= 6 && hour < 12 ? "Morning" : "";
    labelWelcome.textContent = `Good ${time}, ${name}!`
}

function calcBalance(user){
    user.balance = user.movements.reduce((acc,mov) => acc+mov,0);
    labelBalance.textContent = `${user.balance}€`;
}

function displaySummary(user){
    const deposits = user.movements.filter(mov => mov>0);
    const withdrawals = user.movements.filter(mov => mov<0);


    const deposit_sum = deposits.reduce((acc,deposit) => acc+=deposit,0);
    labelSumIn.textContent = `${deposit_sum}€`;

    const withdrawal_sum = withdrawals.reduce((acc,withdrawal) => acc+=Math.abs(withdrawal),0);
    labelSumOut.textContent = `${withdrawal_sum}€`;

}

function displayMovements(movements){
    containerMovements.innerHTML = "";
    for(const movement of movements){
        let action;
        if(movement > 0){
            action = "deposit";
        }
        else{
            action = "withdrawal"
        }
        const html =
        `
        <div class="movements__row">
          <div class="movements__type movements__type--${action}">${action}</div>
          <div class="movements__date">${new Date(Date.now()).toDateString()}</div>
          <div class="movements__value">${movement}€</div>
        </div>
        `
        containerMovements.insertAdjacentHTML("afterbegin",html)
    }
}

btnClose.addEventListener("click", function(e){
    e.preventDefault();
    if(inputCloseUsername.value === user.username && parseInt(inputClosePin.value) === user.pin){
        accounts.splice(accounts.indexOf(user),1);
        containerApp.style.opacity = 0;
        labelWelcome.textContent = `Account successfully deleted!`;
        inputLoginUsername.focus();
    }
})

btnTransfer.addEventListener("click", function(e){
    e.preventDefault();
    const recipient = inputTransferTo.value;
    const recipientAccount = accounts.find((account) => account.username === recipient);
    console.log(recipientAccount);
    const amount = parseInt(inputTransferAmount.value);
    if (Number.isNaN(amount) || amount <= 0 || amount > user.balance || recipientAccount == undefined || user === recipientAccount) {
        console.log("couldn't transfer the money");
        return;
    }
    user.movements.push(amount * -1);
    recipientAccount.movements.push(amount);
    calcBalance(user);
    displaySummary(user);
    displayMovements(user.movements);

});

const breeds = [
  {
    breed: 'German Shepherd',
    averageWeight: 32,
    activities: ['fetch', 'swimming'],
  },
  {
    breed: 'Dalmatian',
    averageWeight: 24,
    activities: ['running', 'fetch', 'agility'],
  },
  {
    breed: 'Labrador',
    averageWeight: 28,
    activities: ['swimming', 'fetch'],
  },
  {
    breed: 'Beagle',
    averageWeight: 12,
    activities: ['digging', 'fetch'],
  },
  {
    breed: 'Husky',
    averageWeight: 26,
    activities: ['running', 'agility', 'swimming'],
  },
  {
    breed: 'Bulldog',
    averageWeight: 36,
    activities: ['sleeping'],
  },
  {
    breed: 'Poodle',
    averageWeight: 18,
    activities: ['agility', 'fetch'],
  },
];

const huskyWeight = breeds.filter(dog => dog.breed === "Husky").reduce((acc,dog, i, arr) => acc += dog.averageWeight/arr.length,0);
console.log(huskyWeight);

console.log(breeds.find(dog => dog.activities.includes("running") && dog.activities.includes("fetch")).breed);

const allActivities = new Set(breeds.map((dog) => dog = dog.activities).flat());
console.log(allActivities);

const swimmingAdjacent = new Set(breeds.filter(dog => dog.activities.includes("swimming")).map((dog) => dog = dog.activities).flat().filter(activity => activity !== "swimming"));
console.log(swimmingAdjacent);


console.log(breeds.every(dog => dog.averageWeight > 10));

console.log(breeds.some(dog => dog.activities.length >= 3));
