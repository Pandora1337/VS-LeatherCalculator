let recipes = null;
let items = null;

// load recipes and items
(async () => {
    const index = await loadJSON("fileIndex.json")
    recipes = await loadFolder(index["recipes"])
    items = await loadFolder(index["items"])
})()

async function loadFolder(entry) {
    let combined = {}
    for (let i = 0; i < entry.files.length; i++) {
        const file = entry.files[i];
        const data = await loadJSON(entry.root + '/' + file)

        for (const key in data) {
            combined[key] = data[key]
        }
    }
    console.log(`${entry.root} loaded!`)
    return combined
}

async function loadJSON(file) {
    return fetch(file)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json()
        })
}

const grids = document.querySelector("#crafting-grids")
function generateCraftingGrid(value) {
    grids.innerHTML = ""
    // recursiveCrafting("leather-sturdy-large")
    recursiveCrafting(value, 1)
    shop.innerHTML = ""
}

function generateCrafting(recipeId, amount = 1) {
    const recipe = recipes[recipeId]
    const recipeItem = items[recipe.item]

    // Container
    let div = document.createElement('div')
    div.classList = "tableContainer"

    // Title
    let title = document.createElement("h4")
    title.textContent = recipeItem.name
    div.appendChild(title)

    // Table and Row
    let table = document.createElement("table");
    div.appendChild(table);

    let tr = document.createElement('tr');
    table.appendChild(tr)

    // Crafting Station
    if (recipe.station.item) {
        tr.appendChild(getCraftingItem(items[recipe.station.item]))
        tr.appendChild(getCraftingSign(":"))
    }

    // Ingredients
    let hasLiquid = false
    let maxCount = 0
    for (let i = 0; i < recipe.ingredients.length; i++) {
        const ingredient = recipe.ingredients[i]
        const count = ingredient.count * amount

        if (ingredient.option) {
            const ingredientOpt = items[ingredient.option.item]
            const countOpt = ingredient.option.count * amount

            tr.appendChild(getCraftingItem(ingredientOpt, countOpt))
            tr.appendChild(getCraftingSign("OR"))
            
            if (ingredientOpt.liquid) {
                hasLiquid = true
            }

            if (countOpt > maxCount){
                maxCount = countOpt
            }
        }

        tr.appendChild(getCraftingItem(items[ingredient.item], count))
        tr.appendChild(getCraftingSign(i == recipe.ingredients.length - 1 ? "=" : "+"))
        
        if (items[ingredient.item].liquid) {
            hasLiquid = true
        }

        if (count > maxCount){
            maxCount = count
        }
    }

    // Result
    tr.appendChild(getCraftingItem(recipeItem, recipe.count * amount))

    // Number of crafts
    if (recipe.station.portionSize) {
        let span = document.createElement('span')
        span.textContent = `Number of crafts: ${Math.ceil(maxCount / recipe.station.portionSize)}` +
            ` (Max ${recipe.station.portionSize}${hasLiquid ? "L" : " items"} at a time)`
        div.appendChild(span)
    }

    // grids.appendChild(div);
    grids.insertBefore(div, grids.firstChild);
}

function getCraftingItem(item, count = 0) {
    let td = document.createElement('td');
    if (!item) {
        console.log("Not an item: " + item)
        return td
    }

    td.innerHTML = `
        <img src="./assets/img/${item.id}.png" title="${item.name}">
    `

    if (count != 0) {
        td.innerHTML += `
            <br><span">${count}${item.liquid ? "L" : ""}</span></br>
        `
    }
    return td
}

function getCraftingSign(sign) {
    let td = document.createElement('td');
    td.textContent = sign
    return td
}

function recursiveCrafting(rootRecipe, amount) {
    var seen = new Set()
    function recurse(targetRecipe, targetAmount) {
        let recipe = recipes[targetRecipe]
        if (seen.has(targetRecipe) || !recipe) 
            return

        // Number of crafts
        const num = Math.ceil(targetAmount / recipe.count)
        seen.add(recipe.item)

        generateCrafting(targetRecipe, num)

        // Ingredients Total
        let dict = {}
        for (let i = 0; i < recipe.ingredients.length; i++) {
            const ingredient = recipe.ingredients[i];

            dict[ingredient.item] = (dict[ingredient.item] || 0) + num * ingredient.count

            const ingredientOpt = ingredient.option
            if (ingredientOpt){
                dict[ingredientOpt.item] = (dict[ingredientOpt.item] || 0) + num * ingredientOpt.count;
                recurse(ingredientOpt.item, num * ingredientOpt.count)
            }
        }
        // TODO: 1 input into 2 recipe is broken
        for (let key in dict) {
            let count = dict[key]
            recurse(key, count)
            addShoppingIngredient(key, count)
        }
    }
    recurse(rootRecipe, amount)
}

const shop = document.querySelector(".item-containers")
function addShoppingIngredient(itemId, amount, category) {
    let item = items[itemId]

    let div = document.createElement('div')
    div.classList = "item"

    // Title
    div.innerHTML += `
        <br>${item.name}</br>
    `
    // Icon
    div.appendChild(getCraftingItem(item))

    // Count
    div.innerHTML += `
        <br><span">${amount}${item.liquid ? "L" : ""}</span></br>
    `
    shop.appendChild(div)
}
