function getWaifuUpgradesData() {
    let upgradesData = [];
    upgradesData.push({
        id: 'T1',
        requirement: new Decimal(1),
        cost: new Decimal(1),
        description: 'Gain a multiplier based on time played<br />Currently : <span id="waifuT1Effect"></span>x',
    }, {
        id: 'T2',
        requirement: new Decimal(2),
        cost: new Decimal(3),
        description: 'Gain a multiplier based on amount of rebirths<br />Currently : <span id="waifuT2Effect"></span>x',
    }, {
        id: 'T3',
        requirement: new Decimal(5),
        cost: new Decimal(10),
        description: 'Gain a multiplier based on total amount of levels<br />Currently : <span id="waifuT3Effect"></span>x',
    }, {
        id: 'T4',
        requirement: new Decimal(10),
        cost: new Decimal(25),
        description: "Decrease owo needed for rebirth to 1e300",
    }, {
        id: 'D1',
        requirement: new Decimal(1),
        cost: new Decimal(1),
        description: "Weeb Essence effect is increased from 15% to 25%",
    }, {
        id: 'D2',
        requirement: new Decimal(2),
        cost: new Decimal(3),
        description: "You gain 5 times more Weeb Essence",
    }, {
        id: 'D3',
        requirement: new Decimal(5),
        cost: new Decimal(10),
        description: "Change Weeb Essence Formula to a better one",
    }, {
        id: 'D4',
        requirement: new Decimal(10),
        cost: new Decimal(25),
        description: "Generate 0.1% of the WE you would get on reset every second",
    }, {
        id: 'Y1',
        requirement: new Decimal(1),
        cost: new Decimal(1),
        description: "Start Rebirths with 1 Moe",
    }, {
        id: 'Y2',
        requirement: new Decimal(2),
        cost: new Decimal(3),
        description: "Decrease Moe cost logarithm by 10",
    }, {
        id: 'Y3',
        requirement: new Decimal(5),
        cost: new Decimal(10),
        description: "Increase Moe effect to 0.04x",
    }, {
        id: 'Y4',
        requirement: new Decimal(10),
        cost: new Decimal(25),
        description: "Moe now boost Weeb Essence effect",
    }, )
    return upgradesData;
}

function getWaifuUpgradeRequirement(id) {
    for (let upgrade of getWaifuUpgradesData()) {
        if (upgrade.id == id) {
            return upgrade.requirement;
        }
    };
}

function getWaifuUpgradeCost(id) {
    for (let upgrade of getWaifuUpgradesData()) {
        if (upgrade.id == id) {
            return upgrade.cost;
        }
    };
}

function getWaifuUpgradeDescription(id) {
    for (let upgrade of getWaifuUpgradesData()) {
        if (upgrade.id == id) {
            return upgrade.description;
        }
    };
}

function getAllWaifuUpgradesIDs() {
    let IDs = new Array();
    for (let upgrade of getWaifuUpgradesData()) {
        IDs.push(upgrade.id);
    };
    return IDs;
}