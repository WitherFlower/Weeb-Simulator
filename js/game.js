let player = {
    owo: new Decimal('10'),
    owoGenerators: {}
};

function buyOwOGen(i) {
    if (player.owo.gte(player.owoGenerators[i - 1].cost)) {
        player.owoGenerators[i - 1].level = player.owoGenerators[i - 1].level.add(1);
        player.owoGenerators[i - 1].amount = player.owoGenerators[i - 1].amount.add(1);
        player.owo = player.owo.minus(player.owoGenerators[i - 1].cost);
        updateOwOGenMults();
        updateOwOGenCost(i);
    }
}

function updateOwOGenMults() {
    for (let i = 1; i <= 6; i++) {
        player.owoGenerators[i - 1].mult = Decimal.pow(1.15, player.owoGenerators[i - 1].level);
    }
}

function updateOwOGenCost(i) {
    player.owoGenerators[i - 1].cost = Decimal.pow(10, (player.owoGenerators[i - 1].cost.log10().add(Decimal.add(0.1, i * i * 0.1))));
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
    // auto();
}

function getEssenceGain() {
    let gain = player.owo.log10().times(player.owo.log10()).floor()
    return gain
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
    if (player.owo.gte('1e12')) {
        document.getElementById("essenceGain").innerHTML = "Reset all generators and get " + getEssenceGain() + " Weeb Essence";
    }
}

function display() {
    displayOwO();
    displayOwOGenerators();
    displayEssenceGain();
}

function gameLoop() {
    update();
    display();
}

function init() {
    player.owoGenerators = getOwOGenerators();

    player.owoGenerators[0].cost = new Decimal('10');
    player.owoGenerators[1].cost = new Decimal('1e3');
    player.owoGenerators[2].cost = new Decimal('1e8');
    player.owoGenerators[3].cost = new Decimal('1e15');
    player.owoGenerators[4].cost = new Decimal('1e30');
    player.owoGenerators[5].cost = new Decimal('1e50');

    for (let i = 1; i <= 6; i++) {
        player.owoGenerators[i - 1].baseCost = player.owoGenerators[i - 1].cost;
    }
}

init();
setInterval(gameLoop, 33);