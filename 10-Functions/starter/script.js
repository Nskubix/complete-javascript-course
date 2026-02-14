'use strict';

const poll = {
    question: 'What is your favourite programming language?',
    options: ['0: JavaScript', '1: Python', '2: Rust', '3: C++'],
    // This generates [0, 0, 0, 0]. More in the next section 😃
    answers: new Array(4).fill(0),

    registerNewAnswer(){
        const answer = parseInt(prompt(`What is your favourite programming language?\n${this.options.join("\n")} \n(Write option number)`));
        if(!Number.isNaN(answer) && answer>=0 && answer <= 3){
            this.answers[answer]++;
        }
        this.displayResults("string")
    },
    displayResults(type="array"){
        if(type==="array"){
            console.log(this.answers);
        }
        else if(type === "string"){
            console.log(this.answers.join(", "));
        }
    }
}

const poll1 = {
    answers: [5, 2, 3]
}

const poll2 = {
    answers: [1, 5, 3, 9, 6, 1]
}

poll.displayResults.call(poll1, "string");
poll.displayResults.call(poll2, "array");



const buttonn = document.querySelector(".poll");


buttonn.addEventListener("click", function(){
    poll.registerNewAnswer();
});


(function () {
  const header = document.querySelector('h1');
//   header.style.color = 'red';

  document.querySelector('body').addEventListener('click', function () {
    header.style.color = 'blue';
  });

})();
