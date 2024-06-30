const body = document.querySelector("body");
const toggle = document.querySelector(".toggle-wrapper");
const themeForm = document.querySelector(".labels-wrapper");
const toggleInputs = document.getElementsByName("theme");

const numBtns = document.querySelectorAll(".num-btn");
const delBtn = document.getElementById("del");
const resetBtn = document.getElementById("reset");
const equalsBtn = document.getElementById("equals");

const screen = document.querySelector(".screen span");

let inputString = "";
let paramList = initParamList();

let theme = 0;
const themeClasses = ["theme-one", "theme-two", "theme-three"];
let toggleUp = true;

const themeJson = localStorage.getItem("theme");
if (themeJson) {
    theme = parseInt(themeJson);
    body.classList.remove("theme-one");
    body.classList.add(themeClasses[theme]);
}


function validateInput(input, isResult) {
    const digitRegex = /^[0-9]$/;
    const symbolRegex = /^[.\-+x/]$/;
    const isDigit = digitRegex.test(input);
    const isSymbol = symbolRegex.test(input);

    // Return if not the correct input
    if (!isDigit && !isSymbol) return;

    // Return if input is an operator and no number input has been made
    if ((isSymbol && !(input === ".")) && paramList.inputs[0] === "") return;

    // If operator entered
    if (isSymbol && !(input === ".")) {
        if (paramList.operator != "") return;

        paramList.operator = input;
        paramList.currentInput = 1;
    }

    // If decimal point entered
    if (input === ".") {
        if (paramList.inputs[paramList.currentInput].includes(".")) return;

        paramList.inputs[paramList.currentInput] += input;
    }

    // If digit entered
    if (isDigit) {
        if (!isResult && paramList.inputs[paramList.currentInput].length === 10) return;
        paramList.inputs[paramList.currentInput] += input;
    }

    displayInput();
}


function displayInput() {
    let str1 = insertCommas(paramList.inputs[0]);
    let str2 = insertCommas(paramList.inputs[1]);

    inputString = `${str1} ${paramList.operator} ${str2}`;

    screen.textContent = inputString;
}


function calculate() {
    if (
        paramList.inputs[0] === "" ||
        paramList.inputs[1] === "" ||
        paramList.operator === ""
    ) {
        return;
    }

    let parsedInputs = [];

    for (let i = 0; i < paramList.inputs.length; i++) {
        parsedInputs[i] = parseFloat(paramList.inputs[i]);
    }

    let result = 0;

    switch (paramList.operator) {
        case "+": result = parsedInputs[0] + parsedInputs[1];
            break;
        case "-": result = parsedInputs[0] - parsedInputs[1];
            break;
        case "x": result = parsedInputs[0] * parsedInputs[1];
            break;
        case "/": result = parsedInputs[0] / parsedInputs[1];
            break;
    }

    reset();

    let fixedStr = result.toFixed(8);
    let resultStr = parseFloat(fixedStr).toString();

    for (let i = 0; i < resultStr.length; i++) {
        validateInput(resultStr[i], true);
    }
}


function deleteInput() {
    if (paramList.inputs[0] === "") return;

    // Currently entering input 1
    if (paramList.currentInput === 0) {
        const len = paramList.inputs[0].length - 1;
        paramList.inputs[0] = paramList.inputs[0].substring(0, len);
    }

    if (paramList.currentInput === 1) {
        if (paramList.inputs[1] === "") {
            // Currently entering operator
            paramList.operator = "";
            paramList.currentInput = 0;
        } else {
            // Currently entering input 2
            const len = paramList.inputs[1].length - 1;
            paramList.inputs[1] = paramList.inputs[1].substring(0, len);
        }
    }

    displayInput();
}


function reset() {
    paramList = initParamList();
    inputString = "";
    screen.textContent = "";
}


function insertCommas(numberStr) {
    if (numberStr.includes(".")) {
        let parts = numberStr.split('.');
        let integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let decimalPart = parts.length > 1 ? '.' + parts[1] : '';
        return integerPart + decimalPart;
    }

    return numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function initParamList() {
    return {
        inputs: ["", ""],
        currentInput: 0,
        operator: ""
    };
}


numBtns.forEach((button) => {
    button.addEventListener("click", function () {
        validateInput(this.id, false);
    });
});

delBtn.addEventListener("click", () => {
    deleteInput();
});

resetBtn.addEventListener("click", () => {
    reset();
});

equalsBtn.addEventListener("click", () => {
    calculate();
});

toggle.addEventListener("click", () => {
    body.classList.remove(themeClasses[theme]);

    if (theme === 2) {
        theme = 1;
        toggleUp = false;
    } else if (theme === 0) {
        theme = 1;
        toggleUp = true;
    } else {
        (toggleUp) ? theme++ : theme--;
    }

    localStorage.setItem("theme", theme);

    toggleInputs[theme].checked = true;
    body.classList.add(themeClasses[theme]);
});

toggleInputs.forEach((radio) => {
    radio.addEventListener("change", function () {
        body.classList.remove(themeClasses[theme]);

        theme = parseInt(this.value);
        localStorage.setItem("theme", theme);

        body.classList.add(themeClasses[theme]);
    });
});