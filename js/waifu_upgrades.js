function getWaifuUpgradesData() {
    let upgradesData = [];
    upgradesData.push({
        id: 'T1',
        requirement: new Decimal(1),
        cost: new Decimal(1),
    }, {
        id: 'T2',
        requirement: new Decimal(2),
        cost: new Decimal(3),
    }, {
        id: 'T3',
        requirement: new Decimal(5),
        cost: new Decimal(10),
    }, {
        id: 'T4',
        requirement: new Decimal(10),
        cost: new Decimal(25),
    }, {
        id: 'D1',
        requirement: new Decimal(1),
        cost: new Decimal(1),
    }, {
        id: 'D2',
        requirement: new Decimal(2),
        cost: new Decimal(3),
    }, {
        id: 'D3',
        requirement: new Decimal(5),
        cost: new Decimal(10),
    }, {
        id: 'D4',
        requirement: new Decimal(10),
        cost: new Decimal(25),
    }, {
        id: 'Y1',
        requirement: new Decimal(1),
        cost: new Decimal(1),
    }, {
        id: 'Y2',
        requirement: new Decimal(2),
        cost: new Decimal(3),
    }, {
        id: 'Y3',
        requirement: new Decimal(5),
        cost: new Decimal(10),
    }, {
        id: 'Y4',
        requirement: new Decimal(10),
        cost: new Decimal(25),
    }, )
    return upgradesData;
}

function getWaifuUpgradeRequirement(id) {
    getWaifuUpgradesData().forEach(upgrade => {
        if (upgrade.id == id) {
            return upgrade.requirement;
        }
    });
}

function getWaifuUpgradeCost(id) {
    getWaifuUpgradesData().forEach(upgrade => {
        if (upgrade.id == id) {
            return upgrade.cost;
        }
    });
}