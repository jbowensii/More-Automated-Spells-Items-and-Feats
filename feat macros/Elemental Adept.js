/*****
Elemental Adept 

USAGE: This is fully automated, just place on a character

workflow: spell damage
    - retreive the damage type fromt thew DAE variable = damageType 
    - duplicate the ITEM on the workflow as OriginalItem
    - search through all damage on the workfolow ITEM for the given damage type
    - if found add "min2" to all damages
    - test all targets for resistance to damageType
    - for every target with resistance set vulnerability
    - CLEANUP: restore the item and remove the vulnerability form all target(s) 

v2.0 December 18 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

// make sure the attempted hit was made with a spell attack of some type
if (!["msak", "rsak", "save"].includes(args[0].item.system.actionType)) return;
//CHANGE DAMAGE TYPE "acid", "fire", "cold", "lightning", "thunder"
const damageType = "fire";

if (args[0].macroPass === "preItemRoll") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;

    // backup the whole original item as a property on the workflow
    let backupItem = theItem.clone();
    await setProperty(workflow, "originalItem", backupItem);

} else if (args[0].macroPass === "preambleComplete") {
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.system;
    const targets = args[0].targets;

    // mark all targets that are resistant to this damage type now vulnerable to cancel the resistance
    // replace this later with a .map function  
    for (let i = 0; i < targets.length; i++) {
        let targetActor = targets[i].actor;
        const match = targetActor.system.traits.dr.value.find(element => {
            if (element.includes(damageType)) markTargetVulnerable(targetActor, damageType, args[0]);
        });
    }

    // strip damage type in [] from the originalDamage if it exists and add "min2" and the damage type back in []
    // replace this later with a .map function 
    for (let i = 0; i < itemData.damage.parts.length; i++) {
        let oldDamage = itemData.damage.parts[i][1];
        let oldDice = itemData.damage.parts[i][0];
        if (oldDamage === damageType) {
            let index = oldDice.indexOf('[');
            if (index !== -1) oldDice = oldDice.slice(0, index); // remove everything after the first open bracket '['
            itemData.damage.parts[i][1] = damageType;
            itemData.damage.parts[i][0] = oldDice + "min2" + "[" + damageType + "]";
            itemData.scaling.formula = itemData.scaling.formula + "min2";
        }
    }

} else if (args[0].macroPass === "postActiveEffects") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    let theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    const targets = args[0].targets;

    // remove any vulnerability previously set on target(s)
    // replace this later with a .map function 
    for (let i = 0; i < targets.length; i++) {
        let targetActor = targets[i].actor;
        let effect = await findEffect(targets[i], "EAVulnerability");
        if (effect) await MidiQOL.socket().executeAsGM("removeEffects", { actorUuid: targetActor.uuid, effects: [effect.id] });
    }

    // restore original spell damage and scaling from the backup item
    let backupItem = await getProperty(workflow, "originalItem");
    // replace this later with a .map function 
    for (let i = 0; i < backupItem.system.damage.parts.length; i++) theItem.system.damage.parts[i] = backupItem.system.damage.parts[i];
    theItem.system.scaling = backupItem.system.scaling;

} return;

// if the character has resistance to the new damage type, set vulnerability to negate it
async function markTargetVulnerable(target, damageType, args) {
    const effectData = {
        label: "EAVulnerability",
        icon: "icons/magic/defensive/barrier-shield-dome-deflect-blue.webp",
        origin: args.uuid,
        changes: [{
            "key": "data.traits.dv.value",
            "value": `${damageType}`,
            "mode": 2,
            "priority": 20
        }],
        disabled: false
    }
    await MidiQOL.socket().executeAsGM("createEffects", { actorUuid: target.uuid, effects: [effectData] });
}

//---------------------------------- MY FUNCTIONS -------------------------------------

// Function to test for an effect
async function findEffect(target, effectName) {
    let effectUuid = null;
    effectUuid = target?.effects.find(ef => ef.label === effectName);
    return effectUuid;
}