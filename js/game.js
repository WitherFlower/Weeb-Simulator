let player = {
    startDate: 0,
    owo: new Decimal('10'),
    owoGenerators: {},
    weebEssence: new Decimal('0'),
    essenceReset: false,
    moe: new Decimal('0'),
    moeReset: false,
    uwu: new Decimal('0'),
    uwuReset: false,
    uwuGlitch: false,
    rebirthAmount: new Decimal('0'),
    waifu: {},
};

let baseowoUpgradeMult = 1.15;
let baseMoeBonus = 0.03;
let baseEssenceEffect = 0.15;

// owo Stuff

function buyOwOGen(i) {
    if (!player.uwuGlitch) {
        if (player.owo.gte(player.owoGenerators[i - 1].cost)) {
            player.owoGenerators[i - 1].level = player.owoGenerators[i - 1].level.add(1);
            player.owoGenerators[i - 1].amount = player.owoGenerators[i - 1].amount.add(1);
            player.owo = player.owo.minus(player.owoGenerators[i - 1].cost);
            updateOwOGenMult(i);
            updateOwOGenCost(i);
        }
    }
}

function updateOwOGenMult(i) {
    let mult = getowoUpgradeMult().pow(player.owoGenerators[i - 1].level).times(getEssenceMult())
    if (player.waifu.upgrades.includes('T1')) mult = mult.times(getWaifuT1Effect());
    if (player.waifu.upgrades.includes('T2')) mult = mult.times(getWaifuT2Effect());
    if (player.waifu.upgrades.includes('T3')) mult = mult.times(getWaifuT3Effect());
    player.owoGenerators[i - 1].mult = mult;
}

function updateAllOwOGenMults() {
    for (let i = 1; i <= 6; i++) {
        updateOwOGenMult(i);
    }
}

function updateOwOGenCost(i) {
    // player.owoGenerators[i - 1].cost = Decimal.pow(10, (player.owoGenerators[i - 1].cost.log10().add(Decimal.add(0.1, Decimal.times(i * i, Decimal.add(0.1, Decimal.max(player.owoGenerators[i - 1].level.minus(getowoGenScalingLevel()).div(100), 0)))))));
    let addedLog = Decimal.add(0.1, i * i * 0.1);
    let addedScalingLog = Decimal.max(0, player.owoGenerators[i - 1].level.minus(getowoGenScalingLevel(i))).div(100);
    let cost = Decimal.pow(10, (player.owoGenerators[i - 1].cost.log10().add(addedLog).add(addedScalingLog)));
    player.owoGenerators[i - 1].cost = cost;
}

function getowoGenScalingLevel(i) {
    // let l = 2000 * i * Math.pow(i, -2.42); // <-- That is an attempt of getting the scaling with a function but it's meh, so instead I'm going to make dirty code stuff again...
    // return new Decimal(l);
    switch (i) {
        case 1:
            return new Decimal(2000);
            break;
        case 2:
            return new Decimal(800);
            break;
        case 3:
            return new Decimal(400);
            break;
        case 4:
            return new Decimal(250);
            break;
        case 5:
            return new Decimal(150);
            break;
        case 6:
            return new Decimal(100);
            break;
    }
    // return new Decimal(0); Maybe some day we'll have more generators ¯\_(ツ)_/¯
}

function getowoUpgradeMult() {
    let mult = new Decimal(baseowoUpgradeMult).add(player.moe.times(getMoeBonus()));
    return mult;
}

function maxAllowo() {
    if (!player.uwuGlitch) {
        for (let i = 1; i <= 6; i++) {
            while (player.owo.gte(player.owoGenerators[i - 1].cost)) {
                buyOwOGen(i);
            }
        }
    }
}

// Essence Stuff

function getEssenceGain() {
    if (player.waifu.upgrades.includes('D4')) {
        let gain = Decimal.max(0, Decimal.pow(10, Decimal.max(player.owo.log10(), 1).sqrt()).minus(50));
        if (player.waifu.upgrades.includes('D2')) gain = gain.times(5);
        return gain;
    }
    if (player.owo.gte('1e12')) {
        let gain = player.owo.log10().minus(11).times(player.owo.log10().minus(11)).floor();
        if (player.waifu.upgrades.includes('D2')) gain = gain.times(5);
        return gain;
    } else {
        return 0;
    }
}

function essenceReset() {
    if (getEssenceGain().gte(1)) {
        player.weebEssence = player.weebEssence.add(getEssenceGain())
        player.owo = new Decimal(10);
        player.owoGenerators = getOwOGenerators();
        for (let i = 1; i <= 6; i++) {
            updateOwOGenMult(i)
        }
    }
    player.essenceReset = true;
}

function getEssenceEffect() {
    let effect = baseEssenceEffect;
    if (player.waifu.upgrades.includes('D1')) effect = 0.25;
    if (player.waifu.upgrades.includes('Y3')) effect = Decimal.add(effect, Decimal.pow(20, player.moe).div(200));
    return effect;
}

function getEssenceMult() {
    let mult = player.weebEssence.times(getEssenceEffect()).add(1);
    return mult;
}

function getEssenceBonus() {
    let bonus = getEssenceMult();
    bonus = bonus.minus(1).times(100);
    return toScientific(bonus.toString()) + "%"
}

// Moe Stuff

function moeReset() {
    if (player.owo.gte(getMoeResetCost())) {
        player.moeReset = true;
        player.moe = player.moe.add(1);
        player.weebEssence = new Decimal(0);
        player.owo = new Decimal(10);
        player.owoGenerators = getOwOGenerators();
        for (let i = 1; i <= 6; i++) {
            updateOwOGenMult(i)
        }
    }
}

function getMoeResetCost() {
    let cost = Decimal.pow(10, Decimal.add(50, Decimal.times(50, player.moe.times(player.moe.add(1)).div(2))));
    if (player.waifu.upgrades.includes('Y2')) cost = Decimal.pow(10, cost.log10().times(0.9));
    return cost;
}

function getMoeBonus() {
    let bonus = baseMoeBonus;
    if (player.waifu.upgrades.includes('Y4')) bonus = 0.04;
    return bonus;
}

// uwu Stuff

function checkuwuReset() {
    if (player.owo.gte('1e400') && player.uwuReset == false) {
        player.uwuGlitch = true;
    } else {
        player.uwuGlitch = false;
    }
}

function uwuReset() {
    if (getuwuGain().gte(1)) {
        if (!player.uwuReset) {
            player.waifu.total = new Decimal(1);
            player.waifu.available = new Decimal(1);
        }
        player.uwu = player.uwu.add(getuwuGain());
        player.rebirthAmount = player.rebirthAmount.add(1);
        player.owo = new Decimal(10);
        player.uwuReset = true;
        player.uwuGlitch = false;
        player.moe = new Decimal(0);
        if (player.waifu.upgrades.includes('Y1')) player.moe = new Decimal(1);
        player.weebEssence = new Decimal(0);
        player.owoGenerators = getOwOGenerators();
        for (let i = 1; i <= 6; i++) {
            updateOwOGenMult(i)
        }
    }
}

function getuwuGain() {
    let owoExponentRequirement = 400;
    if (player.waifu.upgrades.includes('T4')) owoExponentRequirement = 300;
    let gain = new Decimal(Decimal.pow(5, player.owo.log10().minus(owoExponentRequirement).div(70)).sqrt());
    gain = Decimal.max(Decimal.floor(gain), 0);
    return gain;
}

//Waifu Stuff

//init function

function getWaifuStuff() {
    let w = {
        total: new Decimal(0),
        available: new Decimal(0),
        tsundere: new Decimal(0),
        dandere: new Decimal(0),
        yandere: new Decimal(0),
        upgrades: new Array(),
    };
    return w;
}

function getWaifuCost() {
    let cost = Decimal.pow(1.3, player.waifu.total).floor();
    return cost;
}

function getWaifu() {
    if (player.uwu.gte(getWaifuCost())) {
        if (player.waifu.upgrades.length == 0) {
            alert("You need to assign 1 waifu to a branch to unlock an upgrade before buying more.")
        } else {
            player.uwu = player.uwu.minus(getWaifuCost());
            player.waifu.total = player.waifu.total.add(1);
            player.waifu.available = player.waifu.available.add(1);
        }
    }
}

function assignWaifu(type) {
    switch (type) {
        case 'Tsundere':
            if (player.waifu.available.equals(0)) break;
            else player.waifu.tsundere = player.waifu.tsundere.add(1);
            player.waifu.available = player.waifu.available.minus(1);
            break;
        case 'Dandere':
            if (player.waifu.available.equals(0)) break;
            else player.waifu.dandere = player.waifu.dandere.add(1);
            player.waifu.available = player.waifu.available.minus(1);
            break;
        case 'Yandere':
            if (player.waifu.available.equals(0)) break;
            else player.waifu.yandere = player.waifu.yandere.add(1);
            player.waifu.available = player.waifu.available.minus(1);
            break;
    }
}

function buyWaifuUpgrade(upgradeID) {
    if (!player.waifu.upgrades.includes(upgradeID)) {
        switch (upgradeID.charAt(0)) {
            case 'T':
                if (player.waifu.tsundere.gte(getWaifuUpgradeRequirement(upgradeID))) {
                    if (player.uwu.gte(getWaifuUpgradeCost(upgradeID))) {
                        player.waifu.upgrades.push(upgradeID); // c'est bon // enlève les uwu dépensés dans l'upgrade et fais la truc de display aussi, puis ensuite les effets des upgrades sur paint et enfin le cost scaling
                        player.uwu = player.uwu.minus(getWaifuUpgradeCost(upgradeID));
                    }
                }
                break;
            case 'D':
                if (player.waifu.dandere.gte(getWaifuUpgradeRequirement(upgradeID))) {
                    if (player.uwu.gte(getWaifuUpgradeCost(upgradeID))) {
                        player.waifu.upgrades.push(upgradeID);
                        player.uwu = player.uwu.minus(getWaifuUpgradeCost(upgradeID));
                    }
                }
                break;

            case 'Y':
                if (player.waifu.yandere.gte(getWaifuUpgradeRequirement(upgradeID))) {
                    if (player.uwu.gte(getWaifuUpgradeCost(upgradeID))) {
                        player.waifu.upgrades.push(upgradeID);
                        player.uwu = player.uwu.minus(getWaifuUpgradeCost(upgradeID));
                        if (upgradeID == 'Y1' && player.moe == Decimal.ZERO) {
                            player.moe = new Decimal(1);
                        }
                    }
                }
                break;
        }
    }
}

function getWaifuT1Effect() {
    let timeElapsed = Date.now() - player.startDate;
    let secondstimeElapsed = Decimal.floor(timeElapsed / 1000);
    if (Decimal.gte(1, secondstimeElapsed)) secondstimeElapsed = new Decimal(1);
    return Decimal.log10(secondstimeElapsed).div(2);
}

function getWaifuT2Effect() {
    return player.rebirthAmount.pow(1.5);
}

function getTotalowoLevels() {
    let levels = new Decimal(0);
    for (let g of player.owoGenerators) {
        levels = levels.add(g.level)
    }
    return levels;
}

function getWaifuT3Effect() {
    return getTotalowoLevels().div(10).add(1);
}

// function auto() {
//     for (let i = 1; i <= 6; i++) {
//         if (player.owo.gte(player.owoGenerators[i - 1].cost)) {
//             buyOwOGen(i);
//         }
//     }
// }


//Update Functions

function updateOwO() {
    for (i = 6; i > 1; i--) {
        player.owoGenerators[i - 2].amount = player.owoGenerators[i - 2].amount.add(player.owoGenerators[i - 1].amount.times(player.owoGenerators[i - 1].mult).div(1000 / 30))
    }
    updateAllOwOGenMults()
    player.owo = player.owo.add(player.owoGenerators[0].amount.times(player.owoGenerators[0].mult).div(1000 / 30));
}

function updateEssence() {
    player.weebEssence = player.weebEssence.add(getEssenceGain().div(1000).div(1000 / 30));
}

function updateUwU() {
    checkuwuReset();
}

function update() {
    if (!player.uwuGlitch) {
        updateOwO();
    } else {
        player.owo = new Decimal('1e400');
    }
    if (player.waifu.upgrades.includes('D3')) updateEssence();
    updateUwU();
}

//Show Tab

function showtab(tabName) {
    document.getElementById("generatorstab").hidden = true;
    document.getElementById("rebirthtab").hidden = true;
    document.getElementById(tabName).hidden = false;
}

//Display Functions

function displayTabButtons() {
    if (player.uwuReset) {
        document.getElementById("uwuTabBtn").hidden = false;
    }
}

function displayOwO() {
    document.getElementById("owo").innerHTML = "You have " + toScientific(player.owo.toString()) + " owo";
    document.getElementById("owoGain").innerHTML = "You are gaining " + toScientific(
        player.owoGenerators[0].amount.times(player.owoGenerators[0].mult).toString()) + " owo per second";
}

function displayOwOGenerators() {
    for (let i = 1; i <= 6; i++) {
        document.getElementById("owomult" + i).innerHTML = "x" + toScientific(player.owoGenerators[i - 1].mult.toString());
        document.getElementById("owoamount" + i).innerHTML = toScientific(player.owoGenerators[i - 1].amount.toString());
        document.getElementById("owolvl" + i).innerHTML = "Lvl. " + toScientific(player.owoGenerators[i - 1].level.toString());
        document.getElementById("owobtn" + i).innerHTML = "Upgrade for :  " + toScientific(player.owoGenerators[i - 1].cost.toString());
        if (player.owo.gte(player.owoGenerators[i - 1].cost)) {
            document.getElementById("owobtn" + i).disabled = false;
        } else {
            document.getElementById("owobtn" + i).disabled = true;
        }
    }
}

function displayEssenceGain() {
    document.getElementById("essenceReset").innerHTML = "Reset all generators and get " + toScientific(getEssenceGain().toString()) + " Weeb Essence";
    if (player.owo.gte('1e12') || player.essenceReset) {
        document.getElementById("essenceReset").hidden = false;
    }
    if (Decimal.equals(getEssenceGain(), 0)) {
        document.getElementById("essenceReset").disabled = true;
    } else {
        document.getElementById("essenceReset").disabled = false;
    }
    if (player.uwuGlitch) {
        document.getElementById("essenceReset").hidden = true;
    }
}

function displayEssenceAmount() {
    if (player.essenceReset) {
        document.getElementById("weebEssence").hidden = false;
    }
    document.getElementById("weebEssenceAmount").innerHTML = toScientific(player.weebEssence.toString());
}

function displayEssenceBonus() {
    document.getElementById("weebEssenceBonus").innerHTML = getEssenceBonus();
}

function displayEssenceStuff() {
    displayEssenceAmount();
    displayEssenceBonus();
}

function displayMoeButton() {
    if (player.owo.gte('1e50') || player.moeReset) { // Enable
        document.getElementById("moeReset").hidden = false;
        document.getElementById("moeReset").disabled = false;
    }
    if (!player.owo.gte(getMoeResetCost())) { // Disable
        document.getElementById("moeReset").disabled = true;
    }
    document.getElementById("moeReset").innerHTML = "Reset all generators and all Weeb Essence to get a Moe. <br />Cost : " + toScientific(getMoeResetCost().toString()) + " owo";
    if (player.uwuGlitch) {
        document.getElementById("moeReset").hidden = true;
    }
}

function displayMoeMult() {
    if (player.moeReset) {
        document.getElementById("moeMult").hidden = false;
        document.getElementById("moeAmount").innerHTML = toScientific(player.moe.toString());
        document.getElementById("moeBonus").innerHTML = "+" + toScientific(player.moe.times(getMoeBonus()).toString()) + "x";
    }
}

function displayUpgradeMult() {
    document.getElementById("upgradeMultiplier").innerHTML = toScientific(getowoUpgradeMult().toString()) + "x";
}

function displayMoeStuff() {
    displayMoeButton();
    displayMoeMult();
}

function displayuwuAmount() {
    if (player.uwuReset) {
        document.getElementById("uwuAmountDisplay").hidden = false;
    }
    document.getElementById("uwuAmount").innerHTML = toScientific(player.uwu.toString());
}

function displayuwuGain() {
    if (player.uwuReset || player.owo.gte('1e400')) {
        document.getElementById("uwuReset").hidden = false;
        document.getElementById("uwuGain").innerHTML = toScientific(getuwuGain().toString());
        if (Decimal.equals(getuwuGain(), 0)) {
            document.getElementById("uwuReset").disabled = true;
        } else {
            document.getElementById("uwuReset").disabled = false;
        }
    } else {
        document.getElementById("uwuReset").hidden = true;
    }
}

function displayuwuStuff() {
    displayuwuAmount();
    displayuwuGain();
}

function displayWaifuCost() {
    document.getElementById("getWaifu").innerHTML = "Get a Waifu<br />Cost: " + toScientific(getWaifuCost().toString()) + " uwu";
    if (!player.uwu.gte(getWaifuCost())) {
        document.getElementById("getWaifu").disabled = true;
    } else {
        document.getElementById("getWaifu").disabled = false;
    }
}

function displayWaifuAmounts() {
    document.getElementById("totalWaifuAmount").innerHTML = toScientific(player.waifu.total.toString());
    document.getElementById("availableWaifuAmount").innerHTML = toScientific(player.waifu.available.toString());
    document.getElementById("tsundereAmount").innerHTML = toScientific(player.waifu.tsundere.toString());
    document.getElementById("dandereAmount").innerHTML = toScientific(player.waifu.dandere.toString());
    document.getElementById("yandereAmount").innerHTML = toScientific(player.waifu.yandere.toString());
}

function displayWaifuButtons() {
    if (player.waifu.available.equals(0)) {
        document.getElementById("assignTsundere").disabled = true;
        document.getElementById("assignDandere").disabled = true;
        document.getElementById("assignYandere").disabled = true;
    } else {
        document.getElementById("assignTsundere").disabled = false;
        document.getElementById("assignDandere").disabled = false;
        document.getElementById("assignYandere").disabled = false;
    }
}

function displayWaifuUpgrades() {
    for (let upgradeID of getAllWaifuUpgradesIDs()) {
        switch (upgradeID.charAt(0)) {
            case 'T':
                if (player.waifu.tsundere.gte(getWaifuUpgradeRequirement(upgradeID))) {
                    document.getElementById(upgradeID).disabled = false;
                    document.getElementById(upgradeID).innerHTML = getWaifuUpgradeDescription(upgradeID) + "<br />Cost : " + getWaifuUpgradeCost(upgradeID) + " uwu";
                } else {
                    document.getElementById(upgradeID).disabled = true;
                    document.getElementById(upgradeID).innerHTML = "You need " + getWaifuUpgradeRequirement(upgradeID) + " waifus of this type to unlock this upgrade";
                }
                if (player.waifu.upgrades.includes(upgradeID))
                    document.getElementById(upgradeID).className = "stdButton small waifuUpgrade tsundereUpgradeBought";
                else
                    document.getElementById(upgradeID).className = "stdButton small waifuUpgrade tsundereUpgrade";
                break;
            case 'D':
                if (player.waifu.dandere.gte(getWaifuUpgradeRequirement(upgradeID))) {
                    document.getElementById(upgradeID).disabled = false;
                    document.getElementById(upgradeID).innerHTML = getWaifuUpgradeDescription(upgradeID) + "<br />Cost : " + getWaifuUpgradeCost(upgradeID) + " uwu";
                } else {
                    document.getElementById(upgradeID).disabled = true;
                    document.getElementById(upgradeID).innerHTML = "You need " + getWaifuUpgradeRequirement(upgradeID) + " waifus of this type to unlock this upgrade";
                }
                if (player.waifu.upgrades.includes(upgradeID))
                    document.getElementById(upgradeID).className = "stdButton small waifuUpgrade dandereUpgradeBought";
                else
                    document.getElementById(upgradeID).className = "stdButton small waifuUpgrade dandereUpgrade";
                break;
            case 'Y':
                if (player.waifu.yandere.gte(getWaifuUpgradeRequirement(upgradeID))) {
                    document.getElementById(upgradeID).disabled = false;
                    document.getElementById(upgradeID).innerHTML = getWaifuUpgradeDescription(upgradeID) + "<br />Cost : " + getWaifuUpgradeCost(upgradeID) + " uwu";
                } else {
                    document.getElementById(upgradeID).disabled = true;
                    document.getElementById(upgradeID).innerHTML = "You need " + getWaifuUpgradeRequirement(upgradeID) + " waifus of this type to unlock this upgrade";
                }
                if (player.waifu.upgrades.includes(upgradeID))
                    document.getElementById(upgradeID).className = "stdButton small waifuUpgrade yandereUpgradeBought";
                else
                    document.getElementById(upgradeID).className = "stdButton small waifuUpgrade yandereUpgrade";
                break;
        }
    }
    if (player.waifu.upgrades.includes('T1'))
        document.getElementById("waifuT1Effect").innerHTML = toScientific(getWaifuT1Effect().toString());
    if (player.waifu.upgrades.includes('T2'))
        document.getElementById("waifuT2Effect").innerHTML = toScientific(getWaifuT2Effect().toString());
    if (player.waifu.upgrades.includes('T3'))
        document.getElementById("waifuT3Effect").innerHTML = toScientific(getWaifuT3Effect().toString());
}

function displayWaifuStuff() {
    displayWaifuCost();
    displayWaifuAmounts();
    displayWaifuButtons();
    displayWaifuUpgrades();
}

function display() {
    displayTabButtons();
    displayOwO();
    displayOwOGenerators();
    displayEssenceGain();
    if (player.essenceReset) {
        displayEssenceStuff();
    }
    displayMoeStuff();
    displayUpgradeMult();
    displayuwuStuff();
    displayWaifuStuff();
}

function gameLoop() {
    update();
    display();
}

function init() {
    player.owoGenerators = getOwOGenerators();
    player.waifu = getWaifuStuff();
    player.startDate = Date.now();
    if (localStorage.getItem("Weeb-Simulator-playerdata") != null) {
        loadSave();
    }
}

function loadSave() {
    player = JSON.parse(localStorage.getItem("Weeb-Simulator-playerdata"));
    // player.startDate = new Date(player.startDate)
    player.owo = new Decimal(player.owo);
    player.owoGenerators.forEach(generator => {
        generator.amount = new Decimal(generator.amount);
        generator.level = new Decimal(generator.level);
        generator.mult = new Decimal(generator.mult);
        generator.cost = new Decimal(generator.cost);
        generator.baseCost = new Decimal(generator.baseCost);
    });
    player.weebEssence = new Decimal(player.weebEssence);
    player.moe = new Decimal(player.moe);
    player.uwu = new Decimal(player.uwu);
    if (player.waifu == undefined) player.waifu = getWaifuStuff();
    player.waifu.total = new Decimal(player.waifu.total);
    player.waifu.available = new Decimal(player.waifu.available);
    player.waifu.tsundere = new Decimal(player.waifu.tsundere);
    player.waifu.dandere = new Decimal(player.waifu.dandere);
    player.waifu.yandere = new Decimal(player.waifu.yandere);
    // player.waifu.upgrades = new Array(player.waifu.upgrades);
    player.rebirthAmount = new Decimal(player.rebirthAmount);
}

function save() {
    localStorage.setItem("Weeb-Simulator-playerdata", JSON.stringify(player));
    console.log("Saved on : " + Date.now())
}

//Hotkeys

window.addEventListener('keydown', function(event) {
    console.log(event.keyCode)
    switch (event.keyCode) {
        case 77: // M
            maxAllowo();
            break;
    }
}, false);

//String Formatting

function toScientific(string) {
    let a = new Decimal(string)
    if (!(a.gte(9e15))) {
        s = a.toPrecision(3);
        s = s.substring(0, s.indexOf("+")) + s.substring(s.indexOf("+") + 1, s.length);
        return s;
    } else {
        s = a.toString();
        if (s.indexOf("e") > 4) {
            s = s.substring(0, 4) + s.substring(s.indexOf("e"), s.length);
        }
        return s;
    }
}


init();
setInterval(gameLoop, 1000 / 30);
setInterval(save, 30000);