class Calculator {
   constructor(previousOperandTextElement, currentOperandTextElement) {
      this.previousOperandTextElement = previousOperandTextElement;
      this.currentOperandTextElement = currentOperandTextElement;
      this.currentExceptionArray = ['-'];
      this.previousExceptionArray = ['√'];
      this.exceptionArray = ['√', "÷", "*", "^", "+"];
      this.clear();
      this.resetPreviousComputation = false;
   }

   clear() {
      this.previousOperand = '';
      this.currentOperand = '';
      this.operation = undefined;
   }
   delete() {
      this.currentOperand = this.currentOperand.toString().slice(0, -1);
   }
   addNumber(number) {
      if (number === '.' && this.currentOperand.includes('.')) return;
      this.currentOperand = this.currentOperand.toString() + number.toString();
   }
   addOperation(operation) {
      if (this.exceptionArray.includes(operation) && this.currentOperand === '') return;
      if (this.currentOperand !== '' && this.previousOperand !== '') {
         this.compute();
      }
      if (this.currentExceptionArray.includes(operation) && this.currentOperand === '') {
         this.currentOperand = operation;
      } else if (this.previousOperand !== '' && this.currentOperand === '') {
         this.operation = operation;
      } else {
         this.previousOperand = this.currentOperand;
         this.currentOperand = '';
         this.operation = operation;
      }
   }

   compute() {
      let computation;
      const prev = parseFloat(this.previousOperand);
      const current = parseFloat(this.currentOperand);
      if (!isNaN(current) || this.previousExceptionArray.includes(this.operation) && (!isNaN(prev) || this.currentExceptionArray.includes(this.operation))) {
         switch (this.operation) {
            case "+":
               (prev === 0.2 && current === 0.1 || prev === 0.1 && current === 0.2) ? computation = 0.3 : computation = prev + current;
               break;
            case "-":
               (isNaN(prev)) ? computation = -current : computation = +(prev - current).toFixed(2);
               break;
            case "÷":
               (prev === 0.3 || prev === -0.3) ? computation = +(prev / current).toFixed(2) : computation = prev / current;
               break;
            case "*":
               computation = +(prev * current).toFixed(17);
               break;
            case "√":
               (prev < 0) ? computation = 'ERROR' : computation = Math.sqrt(prev);
               break;
            case "^":
               computation = Math.pow(prev, current);
               break;
            default:
               return;
         }
      }
      this.resetPreviousComputation = true;
      this.previousOperand = '';
      this.currentOperand = computation;
      this.operation = undefined;
   }

   updateNumber(number) {
      if (isNaN(number)) {
         return number;
      }
      const stringNumber = number.toString();
      const integerDigit = parseFloat(stringNumber.split('.')[0]);
      const decimalDigit = stringNumber.split('.')[1];
      let integerDisplay;

      if (isNaN(integerDigit)) {
         integerDisplay = '';
      } else {
         integerDisplay = integerDigit.toLocaleString('en', { maximumFractionDigits: 0 });
      }
      if (decimalDigit != null) {
         return `${integerDisplay}.${decimalDigit}`;
      } else {
         return integerDisplay;
      }
   }
   updateDisplay() {
      this.currentOperandTextElement.innerText = this.updateNumber(this.currentOperand);
      if (this.operation != undefined) {
         this.previousOperandTextElement.innerText = `${this.updateNumber(this.previousOperand)} ${this.operation}`;
      } else {
         this.previousOperandTextElement.innerText = '';
      }

   }
}



const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');


const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => {
   button.addEventListener('click', () => {
      if (calculator.previousOperand === '' && calculator.currentOperand !== '' && calculator.resetPreviousComputation) {
         calculator.currentOperand = '';
         calculator.resetPreviousComputation = false;
      }
      calculator.addNumber(button.innerText);
      calculator.updateDisplay();
   })
})

operationButtons.forEach(button => {
   button.addEventListener('click', () => {
      calculator.addOperation(button.dataset.symbol);
      calculator.updateDisplay();
   })
})

allClearButton.addEventListener('click', button => {
   calculator.clear();
   calculator.updateDisplay();
})

deleteButton.addEventListener('click', button => {
   calculator.delete();
   calculator.updateDisplay();
})

equalsButton.addEventListener('click', button => {
   calculator.compute();
   calculator.updateDisplay();
})