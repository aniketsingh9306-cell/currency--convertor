const BASE_URL =
  "https://api.exchangerate-api.com/v4/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  try {
    let amtVal = document.querySelector(".amount input").value;
    
    if (!amtVal || amtVal <= 0) {
      msg.innerText = "Please enter a valid amount";
      return;
    }

    msg.innerText = "Loading...";
    
    const fromCode = fromCurr.value;
    const toCode = toCurr.value;
    const URL = `${BASE_URL}/${fromCode}`;
    
    let response = await fetch(URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    let data = await response.json();
    let rate = data.rates[toCode];

    if (!rate) {
      msg.innerText = "Exchange rate not available";
      return;
    }

    let finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCode} = ${finalAmount} ${toCode}`;
  } catch (error) {
    console.error("Error:", error);
    msg.innerText = "Error fetching rates. Please try again.";
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  if (countryCode) {
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
  }
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});