let player = {
    owo: new Decimal(10),
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
        player.owoGenerators[i - 1].mult = Decimal.pow(1.165, player.owoGenerators[i - 1].level);
    }
}

function updateOwOGenCost(i) {
    //player.owoGenerators[i - 1].cost = player.owoGenerators[i - 1].cost.add(player.owoGenerators[i - 1].cost.times(Decimal.add(0.32 * i, Decimal.times(1.004 * i - 1, player.owoGenerators[i - 1].level.div(100 / (i * i * i))))));
    player.owoGenerators[i - 1].cost = player.owoGenerators[i - 1].cost.pow(i)
}

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
    player.owo = player.owo.add(player.owoGenerators[0].amount.times(player.owoGenerators[0].mult).div(33))
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

function display() {
    displayOwO();
    displayOwOGenerators()
}

function gameLoop() {
    update();
    display();
}

function init() {
    player.owoGenerators = getOwOGenerators();
    for (let i = 1; i <= 6; i++) {
        player.owoGenerators[i - 1].cost = Decimal.pow(10, 4 * ((i - 1) * (i - 1))).add(9);
        player.owoGenerators[i - 1].baseCost = player.owoGenerators[i - 1].cost;
    }
}

init();
setInterval(gameLoop, 33);