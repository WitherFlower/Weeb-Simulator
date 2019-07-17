let player = {
    owo: new Decimal('10'),
    owoGenerators: {},
    weebEssence: new Decimal('0'),
    essenceReset: false
};

function buyOwOGen(i) {
    if (player.owo.gte(player.owoGenerators[i - 1].cost)) {
        player.owoGenerators[i - 1].level = player.owoGenerators[i - 1].level.add(1);
        player.owoGenerators[i - 1].amount = player.owoGenerators[i - 1].amount.add(1);
        player.owo = player.owo.minus(player.owoGenerators[i - 1].cost);
        updateOwOGenMult(i);
        updateOwOGenCost(i);
    }
}

function updateOwOGenMult(i) {
    player.owoGenerators[i - 1].mult = player.owoGenerators[i - 1].mult.times(1.15);
}

function updateOwOGenCost(i) {
    player.owoGenerators[i - 1].cost = Decimal.pow(10, (player.owoGenerators[i - 1].cost.log10().add(Decimal.add(0.1, i * i * 0.1))));
}

function getEssenceGain() {
    if (player.owo.gte('1e12')) {
        let gain = player.owo.log10().minus(11).times(player.owo.log10().minus(11)).floor();
        return gain;
    } else {
        return 0;
    }
}

function essenceReset() {
    if (player.owo.gte('1e12')) {
        player.weebEssence = player.weebEssence.add(getEssenceGain())
        player.owo = new Decimal(10);
        player.owoGenerators = getOwOGenerators();

        player.owoGenerators.forEach(generator => {
            generator.mult = generator.mult.times(getEssenceMult());
        });
    }
    document.getElementById("weebEssence").hidden = false;
    player.essenceReset = true;
}

function getEssenceMult() {
    let mult = player.weebEssence.times(0.2).add(1);
    return mult;
}

function getEssenceBonus() {
    let bonus = getEssenceMult();
    bonus = bonus.minus(1).times(100);
    return toScientific(bonus.toString()) + "%"
}

// function auto() {
//     for (let i = 1; i <= 6; i++) {
//         if (player.owo.gte(player.owoGenerators[i - 1].cost)) {
//             buyOwOGen(i);
//         }
//     }
// }

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

//Update Functions

function updateOwO() {
    for (i = 6; i > 1; i--) {
        player.owoGenerators[i - 2].amount = player.owoGenerators[i - 2].amount.add(player.owoGenerators[i - 1].amount.times(player.owoGenerators[i - 1].mult).div(33))
    }
    player.owo = player.owo.add(player.owoGenerators[0].amount.times(player.owoGenerators[0].mult).div(33));
}

function update() {
    updateOwO();
}

//Display Functions

function displayOwO() {
    document.getElementById("owo").innerHTML = "You have " + toScientific(player.owo.toString()) + " owo";
}

function displayOwOGenerators() {
    for (let i = 1; i <= 6; i++) {
        document.getElementById("owomult" + i).innerHTML = "x" + toScientific(player.owoGenerators[i - 1].mult.toString());
        document.getElementById("owoamount" + i).innerHTML = toScientific(player.owoGenerators[i - 1].amount.toString());
        document.getElementById("owolvl" + i).innerHTML = "Lvl. " + toScientific(player.owoGenerators[i - 1].level.toString());
        document.getElementById("owobtn" + i).innerHTML = "Upgrade for :  " + toScientific(player.owoGenerators[i - 1].cost.toString());
    }
}

function displayEssenceGain() {
    document.getElementById("essenceReset").innerHTML = "Reset all generators and get " + getEssenceGain() + " Weeb Essence";
    if (player.owo.gte('1e12')) {
        document.getElementById("essenceReset").hidden = false;
    }
}

function displayEssenceAmount() {
    document.getElementById("weebEssenceAmount").innerHTML = toScientific(player.weebEssence.toString());
}

function displayEssenceBonus() {
    document.getElementById("weebEssenceBonus").innerHTML = getEssenceBonus();
}

function displayEssenceStuff() {
    displayEssenceAmount();
    displayEssenceBonus();
}

function display() {
    displayOwO();
    displayOwOGenerators();
    displayEssenceGain();
    if (player.essenceReset) {
        displayEssenceStuff();
    }
}

function gameLoop() {
    update();
    display();
}

function init() {
    player.owoGenerators = getOwOGenerators();


}

init();
setInterval(gameLoop, 33);