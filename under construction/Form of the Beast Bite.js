/*****
Form of the Beast: Bite

USEAGE : AUTOMATED
This item should be placed on the character that is a Path of the Beast Barbarian  
 
Your mouth transforms into a bestial muzzle or great mandibles (your choice). It deals 1d8 piercing damage on a hit. Once on each of your turns when you damage a creature with this bite, you regain a number of hit points equal to your proficiency bonus, provided you have less than half your hit points when you hit.

v0.1 April 25 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

// if not a melee attack stop macro
if (["mwak"].includes(args[0].item.data.actionType)) {
    const thisItem = await fromUuid(args[0].itemUuid);
    const pcToken = token;
    const pcActor = token.actor;

    // test to make sure this is a Path of the Beast Barbarian of at least level 3
    const pcBarbarian = testClass(pcActor, "barbarian", "Path of the Beast", 3);
    // remove these two lines, they are only for testing on a character that is not path of the beast
    //const pcBarbarian = true;

    if (pcBarbarian === null) ui.notifications.error("You are not a Path of the Beast Barbarian of at least level 3!");
    else {
        // check the barbarian is raging
        const rageEffect = await findEffect(pcToken, "Rage");
        if (!rageEffect) return;  // actor is not raging

        // check character current hp > 1/2 max hp return
        const halfHP = (actor.data.data.attributes.hp.max / 2);
        const currentHP = actor.data.data.attributes.hp.value;
        if (currentHP >= halfHP) return;

        // test and set combat flag for use once per round if in combat
        if (game.combat) {
            const combatTime = `${game.combat.id}-${game.combat.round + game.combat.turn / 100}`;
            const lastTime = actor.getFlag("midi-qol", "beastBite");
            if (combatTime === lastTime) return;  // already used Beast Bite this round return
            else await actor.setFlag("midi-qol", "beastBite", combatTime);
        }

        // get character proficiency bonus and heal that amount
        const healAmount = actor.data.data.attributes.prof;
        await MidiQOL.applyTokenDamage([{ damage: healAmount, type: "healing" }], healAmount, new Set([pcToken]), thisItem, new Set());

        return;
    }
}

// Test PC Class, Subclass and Class Level
// RETURN the class object (TRUE) or null (FALSE)
function testClass(testActor, className, subClassName, levels) {
    let theClass = testActor.data.data.classes[className];
    if (theClass) {
        if ((levels > 0) && (theClass.levels >= levels)) {
            if (subClassName === null || (theClass.subclass === subClassName)) {
                return theClass;
            }
        }
    }
    return null;
}

// Function to test for an effect
async function findEffect(target, effectName) {
    let effectUuid = null;
    effectUuid = target?.actor.data.effects.find(ef => ef.data.label === effectName);
    return effectUuid;
}