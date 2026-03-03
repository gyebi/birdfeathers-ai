//expenditure section
const inputFlockCalc = document.getElementById("flockcalc");
const inputFeedCalc = document.getElementById("feedcalc");
const inputDrugCalc = document.getElementById("drugvacc");

const inputCoopCost = document.getElementById("coopcalc");
const inputMisc= document.getElementById("misccalc");
/*
let expFlock = Number(inputFlockCalc.value);
let expFeed = Number(inputFeedCalc.value);
let expDrugVacc = Number(inputDrugCalc.value);
let expCoop = Number(inputCoopCost.value);
let expMisc = Number(inputMisc.value)
*/
const totalExp = document.getElementById("exptotal");



// revenue section
const inputBirdSale = document.getElementById("birdsale");
const inputEggSale = document.getElementById("eggsale");

/*
let revBirdsale = Number(inputBirdSale.value);
let revEggsale = Number(inputEggSale.value);
*/
const totalRev = document.getElementById("revtotal");

function getNumber(input){

    return Number(input.value) || 0 ; 

}


const submitAddBtn = document.getElementById("submit");
const pl = document.getElementById("income");

//const profit =  sumRev - sumExp; 

submitAddBtn.addEventListener("click", function(){
 console.log("button is clicked");

    const sumExp = getNumber(inputFlockCalc) +
     getNumber(inputFeedCalc) + 
     getNumber(inputDrugCalc) + 
     getNumber(inputCoopCost) + 
     getNumber(inputMisc);

console.log(sumExp);

totalExp.textContent = sumExp.toLocaleString(undefined,
                                            {style: "currency",
                                                currency:"USD"
                                            });
const sumRev = getNumber(inputBirdSale) + 
getNumber(inputEggSale);
                                            
totalRev.textContent = sumRev.toLocaleString(undefined,
                                            {style: "currency",
                                                currency:"USD"
                                            });

const profit =  sumRev - sumExp; 

pl.classList.remove("profit-positive", "profit-negative");

if(profit > 0 ){
    pl.classList.add("profit-positive");
} else {

     pl.classList.add("profit-negative");

}

pl.textContent = profit.toLocaleString(undefined,
                                            {style: "currency",
                                                currency:"USD"
                                            });;

});
