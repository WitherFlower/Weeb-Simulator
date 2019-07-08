function getOwOGenerators() {
    let owoGenerators = [];
    for (let i = 1; i <= 6; i++) {
        owoGenerators.push(getNewGenerator('owoGen' + i))
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