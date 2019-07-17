function getOwOGenerators() {
    let owoGenerators = [];
    for (let i = 1; i <= 6; i++) {
        owoGenerators.push(getNewGenerator('owoGen' + i))
    }
    owoGenerators[0].cost = new Decimal('10');
    owoGenerators[1].cost = new Decimal('1e3');
    owoGenerators[2].cost = new Decimal('1e8');
    owoGenerators[3].cost = new Decimal('1e15');
    owoGenerators[4].cost = new Decimal('1e30');
    owoGenerators[5].cost = new Decimal('1e50');

    for (let i = 1; i <= 6; i++) {
        owoGenerators[i - 1].baseCost = owoGenerators[i - 1].cost;
    }
    return owoGenerators;
}


function getNewGenerator(id, amount, level, cost, baseCost) {
    let generator = {
        id: id,
        amount: amount,
        level: level,
        mult: new Decimal(1),
        cost: cost,
        baseCost: baseCost
    }

    if (generator.amount == undefined) {
        generator.amount = new Decimal(0);
    }
    if (generator.level == undefined) {
        generator.level = new Decimal(0);
    }
    if (generator.cost == undefined) {
        generator.cost = new Decimal(10);
    }


    return generator;
}