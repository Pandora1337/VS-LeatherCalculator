const hideTypes = [
  ["Select Ingredient", "---"],
  ["Leather:", "---", "disabled"],
  ["Small hide", "small_hide"],
  ["Medium hide", "medium_hide"],
  ["Large hide", "large_hide"],
  ["Huge hide", "huge_hide"],

  ["Sturdy Leather:", "---", "disabled"],
  ["Large hide", "large_hide_sturdy"],
  ["Huge hide", "huge_hide_sturdy"],
];

const cants = {
  small_hide: {
    cantLiquidPerHide: 2,
    cantLeather: 1,
    maxHidePerBarrel: 25,
    size: 'Small',
  },
  medium_hide: {
    cantLiquidPerHide: 4,
    cantLeather: 2,
    maxHidePerBarrel: 12,
    size: 'Medium',
  },
  large_hide: {
    cantLiquidPerHide: 6,
    cantLeather: 3,
    maxHidePerBarrel: 8,
    size: 'Large',
  },
  huge_hide: {
    cantLiquidPerHide: 10,
    cantLeather: 5,
    maxHidePerBarrel: 5,
    size: 'Huge',
  },
  large_hide_sturdy: {
    cantLiquidPerHide: 6,
    cantLeather: 3,
    maxHidePerBarrel: 8,
    size: 'Large',
    isSturdy: true,
  },
  huge_hide_sturdy: {
    cantLiquidPerHide: 10,
    cantLeather: 6,
    maxHidePerBarrel: 5,
    size: 'Huge',
    isSturdy: true,
  },
};

const select = document.querySelector("#selectHide"),
  calc = document.querySelector(".calc"),
  inputRangeHide = document.querySelector("#inputRangeHide"),
  inputRangeLeather = document.querySelector("#inputRangeLeather"),
  maxHideSpan = document.querySelector("#maxHideSpan"),
  maxLeatherSpan = document.querySelector("#maxLeatherSpan");

const cantSelectedHideSpan = document.querySelectorAll(".cantSelectedHideSpan"),
  cantSelectedLeatherSpan = document.querySelectorAll(
    ".cantSelectedLeatherSpan"
  ),
  cantLogsSpan = document.querySelectorAll(".cantLogsSpan"),
  cantLiquidSpan = document.querySelectorAll(".cantLiquidSpan"),
  cantTotalLogsSpan = document.querySelectorAll(".cantTotalLogsSpan"),
  cantTotalLiquidSpan = document.querySelectorAll(".cantTotalLiquidSpan"),
  cantLimeSpan = document.querySelectorAll(".cantLimeSpan"),
  cantBoraxSpan = document.querySelectorAll(".cantBoraxSpan"),
  cantPoweredBoraxSpan = document.querySelectorAll(".cantPoweredBoraxSpan");

// Cooking Pot values
const cantPotAcid = document.querySelectorAll(".cantPotAcid");
const cantPotSulfate = document.querySelectorAll(".cantPotSulfate");

const potOpsMax = document.querySelectorAll(".potOpsMax")
const potOpsAcid = document.querySelector(".potOpsAcid")
const potOpsSulfate = document.querySelector(".potOpsSulfate")
const potOpsTanned = document.querySelector(".potOpsTanned")
const potOpsLeather = document.querySelector(".potOpsLeather")

// Non-shared Recipes
const allLeather = document.querySelectorAll(".leather")
const allSturdy = document.querySelectorAll(".sturdy")
const leatherSwitcheroo = document.querySelector(".leather-switcheroo")

// Shopping list entries
const shoppingLeather = document.querySelectorAll(".shopping-leather")
const shoppingSturdy = document.querySelectorAll(".shopping-sturdy")

const shoppingBeeswax = document.querySelectorAll(".cantShopBeeswax")
const shoppingSaltpeter = document.querySelectorAll(".cantShopSaltpeter")
const shoppingChromite = document.querySelectorAll(".cantShopChromite")
const shoppingSulfur = document.querySelectorAll(".cantShopSulfur")

const allHides = document.querySelectorAll(".hide-pic")

const maxUnitsPerCookingPot = 6;
const minWaterPerBarrel = 10,
  maxWaterPerBarrel = 50;

let selectedHide = "---",
  cantSelectedHide = 1,
  cantSelectedLeather = 1,
  leatherPerHide = 1,
  maxHide = 0,
  maxLeather = 0,
  liquidPerHide = 0;

for (var i = 0; i < hideTypes.length; i++) {
  var opcion = document.createElement("option");
  opcion.text = hideTypes[i][0];
  opcion.value = hideTypes[i][1];
  opcion.disabled = hideTypes[i][2]
  select.add(opcion);
}

calc.style = "display: none";

// HIDE TYPE SELECTOR
select.addEventListener("change", (e) => {
  const value = e.target.value;
  resetValues();

  if (value === "---") {
    calc.style = "display: none";
    return;
  }

  selectedHide = value;
  calc.style = "display: flex";

  init();
  calculate();
  image_replace(cants[value].size)
  toggleRecipes(cants[value].isSturdy)
});

// INPUT RANGE HIDE
inputRangeHide.addEventListener("input", (e) => {
  cantSelectedHide = e.target.value;
  cantSelectedHideSpan.forEach((e) => {
    e.textContent = cantSelectedHide;
  });

  cantSelectedLeather = cantSelectedHide * leatherPerHide;
  cantSelectedLeatherSpan.forEach((e) => {
    e.textContent = cantSelectedLeather;
  });
  inputRangeLeather.value = cantSelectedHide * leatherPerHide;
  calculate();
});

// INPUT RANGE LEATHER
inputRangeLeather.addEventListener("input", (e) => {
  cantSelectedLeather = e.target.value;
  cantSelectedLeatherSpan.forEach((e) => {
    e.textContent = cantSelectedLeather;
  });

  cantSelectedHide = cantSelectedLeather / leatherPerHide;
  cantSelectedHideSpan.forEach((e) => {
    e.textContent = cantSelectedHide;
  });
  inputRangeHide.value = cantSelectedLeather / leatherPerHide;
  calculate();
});

function init() {
  const val = cants[selectedHide];
  // console.log(val);

  // HIDE
  maxHide = val.maxHidePerBarrel;
  cantSelectedHideSpan.forEach((e) => {
    e.textContent = 1;
  });
  inputRangeHide.max = maxHide;
  maxHideSpan.textContent = maxHide;

  // LEATHER
  leatherPerHide = val.cantLeather;
  liquidPerHide = val.cantLiquidPerHide;
  maxLeather = val.maxHidePerBarrel * leatherPerHide;
  maxLeatherSpan.textContent = maxLeather;
  minLeatherSpan.textContent = leatherPerHide;

  cantSelectedLeatherSpan.forEach((e) => {
    e.textContent = leatherPerHide;
  });
  inputRangeLeather.step = leatherPerHide;
  inputRangeLeather.max = maxLeather;
  inputRangeLeather.min = leatherPerHide;
  inputRangeLeather.value = 1;

  potOpsMax.forEach((e) => {
    e.textContent = maxUnitsPerCookingPot
  })
}

function calculate() {
  cantLimeSpan.forEach((e) => {
    e.textContent = cantSelectedHide * liquidPerHide;
  });

  cantBoraxSpan.forEach((e) => {
    const cantBorax = Math.ceil((cantSelectedHide * liquidPerHide) / 5) * 5;
    e.textContent = cantBorax;
  });

  cantPoweredBoraxSpan.forEach((e) => {
    e.textContent = Math.ceil((cantSelectedHide * liquidPerHide) / 5) * 2;
  });

  cantLiquidSpan.forEach((e) => {
    e.textContent = Math.ceil((cantSelectedHide * liquidPerHide) / 10) * 10;
  });

  cantTotalLiquidSpan.forEach((e) => {
    const taninWater =
      Math.ceil((cantSelectedHide * liquidPerHide) / 10) * 10 * 2;
    e.textContent = Number(cantSelectedHide) + taninWater;
  });

  cantLogsSpan.forEach((e) => {
    e.textContent = Math.ceil((cantSelectedHide * liquidPerHide) / 10);
  });

  cantTotalLogsSpan.forEach((e) => {
    e.textContent = Math.ceil((cantSelectedHide * liquidPerHide) / 10) * 3;
  });

  if (!cants[selectedHide].isSturdy) {
    return
  }

  // Sturdy Leather Calc
  let beeswax = cantSelectedHide * 3
  let sulfate = cantSelectedHide * 3

  let chromite = sulfate * 2
  let acid = sulfate * 2

  let sulfur = acid * 2

  // Crafting Grids
  cantPotAcid.forEach((e) => {
    e.textContent = acid
  })

  cantPotSulfate.forEach((e) => {
    e.textContent = sulfate
  })

  // Pot Crafts
  potOpsAcid.textContent = Math.max(Math.floor(acid / maxUnitsPerCookingPot), 1)
  potOpsSulfate.textContent = Math.max(Math.floor(sulfate / maxUnitsPerCookingPot), 1)
  potOpsTanned.textContent = Math.max(Math.floor(cantSelectedHide / maxUnitsPerCookingPot), 1)
  potOpsLeather.textContent = Math.max(Math.floor(cantSelectedHide / maxUnitsPerCookingPot), 1)

  // Shopping List
  shoppingBeeswax.forEach((e) => {
    e.textContent = beeswax
  })
  shoppingChromite.forEach((e) => {
    e.textContent = chromite
  })
  shoppingSaltpeter.forEach((e) => {
    e.textContent = acid
  })
  shoppingSulfur.forEach((e) => {
    e.textContent = sulfur
  })
}

function resetValues() {
  selectedHide = "---";
  leatherPerHide = 1;
  liquidPerHide = 0;
  maxHide = 0;
  maxLeather = 0;
  inputRangeHide.value = 1;
  cantSelectedHide = 1;
}

// Takes in a size of the hide. I.E. 'Large' or 'Small' and replaces all hides with the correct size version
// FIXME: Causes an error for Chromium Tanned Hides because there is no small or medium versions
function image_replace(size) {
  allHides.forEach((e) => {
    baseSrc = e.getAttribute('data-base-src')
    e.src = `${baseSrc}${size.toLowerCase()}.png`

    baseTitle = e.getAttribute('data-base-title')
    e.title = `${baseTitle} (${size})`
  });
}

function toggleRecipes(isSturdy) {
  if (isSturdy) {
    // Leather Slider
    let baseSrc = leatherSwitcheroo.getAttribute("data-base-src")
    leatherSwitcheroo.src = `${baseSrc}-sturdy.png`
    leatherSwitcheroo.title = 'Sturdy Leather'
    
    // Crafting Grids
    allLeather.forEach((e) => {
      e.style.display = 'none'
    })
    allSturdy.forEach((e) => {
      e.style.display = 'block'
    })

    // Shopping List
    shoppingLeather.forEach((e) => {
      e.style.display = 'none'
    })
    shoppingSturdy.forEach((e) => {
      e.style.display = 'flex'
    })

  } else {
    
    // Leather Slider
    let baseSrc = leatherSwitcheroo.getAttribute("data-base-src")
    leatherSwitcheroo.src = `${baseSrc}.png`
    leatherSwitcheroo.title = 'Leather'
      
    // Crafting Grids
    allLeather.forEach((e) => {
      e.style.display = 'block'
    })
    allSturdy.forEach((e) => {
      e.style.display = 'none'
    })

    // Shopping List
    shoppingLeather.forEach((e) => {
      e.style.display = 'flex'
    })
    shoppingSturdy.forEach((e) => {
      e.style.display = 'none'
    })
  }
}
