document.addEventListener('DOMContentLoaded', () => {
  const currentValueEl = document.getElementById('current-value');
  const expressionEl = document.getElementById('expression');
  const buttons = document.querySelectorAll('.btn');

  let currentValue = '0';
  let previousValue = '';
  let operator = null;
  let shouldResetDisplay = false;

  const formatNumber = (numStr) => {
    if (!numStr || numStr === 'Error') return numStr;
    const parts = numStr.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const updateDisplay = () => {
    currentValueEl.textContent = formatNumber(currentValue);
    if (operator && previousValue !== '') {
      expressionEl.textContent = `${formatNumber(previousValue)} ${operator}`;
    } else {
      expressionEl.textContent = '';
    }
  };

  const appendNumber = (number) => {
    if (currentValue === '0' || shouldResetDisplay) {
      currentValue = number;
      shouldResetDisplay = false;
    } else {
      if (currentValue.length >= 12) return; 
      currentValue += number;
    }
  };

  const appendDecimal = () => {
    if (shouldResetDisplay) {
      currentValue = '0.';
      shouldResetDisplay = false;
      return;
    }
    if (!currentValue.includes('.')) {
      currentValue += '.';
    }
  };

  const handleOperator = (op) => {
    if (operator && !shouldResetDisplay) {
      calculate();
    }
    previousValue = currentValue;
    operator = op;
    shouldResetDisplay = true;
  };

  const calculate = () => {
    if (!operator || previousValue === '') return;

    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);
    let result = 0;

    switch (operator) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '*':
        result = prev * current;
        break;
      case '/':
        result = current === 0 ? 'Error' : prev / current;
        break;
      default:
        return;
    }

    expressionEl.textContent = `${formatNumber(previousValue)} ${operator} ${formatNumber(currentValue)}`;
    currentValue = result === 'Error' ? 'Error' : String(Number(result.toFixed(8)));
    operator = null;
    previousValue = '';
    shouldResetDisplay = true;
    currentValueEl.textContent = formatNumber(currentValue);
  };

  const clear = () => {
    currentValue = '0';
    previousValue = '';
    operator = null;
    shouldResetDisplay = false;
    updateDisplay();
  };

  const backspace = () => {
    if (shouldResetDisplay) return;
    if (currentValue.length === 1 || currentValue === 'Error') {
      currentValue = '0';
    } else {
      currentValue = currentValue.slice(0, -1);
    }
    updateDisplay();
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const val = btn.dataset.value;

      if (action === 'clear') {
        clear();
      } else if (action === 'backspace') {
        backspace();
      } else if (action === 'operator') {
        handleOperator(val);
        updateDisplay();
      } else if (action === 'calculate') {
        calculate();
      } else if (val === '.') {
        appendDecimal();
        updateDisplay();
      } else if (val) {
        appendNumber(val);
        updateDisplay();
      }
    });
  });
});