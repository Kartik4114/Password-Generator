const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");

const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");

const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");

const symbols='~!@#$%^&*(){}[];:+=-_<>?/';

// starting default values
let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
// set circle color to grey
setIndicator("#ccc")

// set password Length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    //or kuch bhi karna chahiye ? - HW
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}


function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
    // shadow
}

function getRndInteger(min,max){
    // math.random gives integer between 0 and 1
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
   return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
   return String.fromCharCode(getRndInteger(65,91));
}
function generateSymbol(){
   
    const randNum=getRndInteger(0,symbols.length);
    return symbols[randNum];
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    } else if((hasLower|| hasUpper) && (hasNum || hasSym)
                && passwordLength>=6){
                    setIndicator("#ff0");
                }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){

    // function for copying clipboardis navigator.clipboard
    // here it is returning a promise
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    } 
    catch(e){
        copyMsg.innerText="Failed";
    }

    // now as we know that after showing copied message it disappeared
    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

// adding eventListener on input slider

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
});

function handleCheckBoxChange(){

    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked) checkCount++;
    })

    // special condition
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

function shufflepassword(array){

    // fisher Yates Method

    for(let i=array.length-1;i>=0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}

generateBtn.addEventListener('click',()=>{

        if(passwordLength<=0) return;

        if(passwordLength<checkCount){
            passwordLength=checkCount;
            handleSlider();
        }

        // let start to find new password
        
        console.log("start");
        // remove old password
        password="";
        
        // let's put the stuff mentioned by checkboxes
        
        let funcArr=[];
        console.log("Putting start");
        
        if(uppercaseCheck.checked)
            funcArr.push(generateUpperCase);
        
        if(lowercaseCheck.checked)
            funcArr.push(generateLowerCase);
        
        if(numbersCheck.checked)
            funcArr.push(generateRandomNumber);
        
        if(symbolsCheck.checked)
            funcArr.push(generateSymbol);
        
        // compulsory additon
        
        console.log("Compulsory");
        for(let i=0;i<funcArr.length;i++){
            password+=funcArr[i]();
        }
        
        // remaining addition
        for(let i=0;i<passwordLength-funcArr.length;i++){
            let randIndex=getRndInteger(0,funcArr.length);
            password+=funcArr[randIndex]();
        }
        
        // shuffle the password
        console.log("shuffle");
        password=shufflepassword(Array.from(password)); // giving password in form of array
        
        // show in UI
        console.log("UI");
        passwordDisplay.value=password;
        // calculate strength
        calcStrength();
});
 


