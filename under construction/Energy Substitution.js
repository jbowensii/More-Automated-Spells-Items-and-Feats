/*****
Elemental Adept 

Before you roll for spell damage:
    - prompt to change damage type to ElementalType (show available types)
    - If the player wants to change the damage type (YES) then: 
        - change spell damage type on the item including scaling damage
        - if the target(s) has resistance to the selected Elemental damage type set vulnerability to negate it 
        - to replace damage 1s as 2s add "min2" to the damage roll before the damage type
        - CLEANUP: when done put the item back to the way it was (stored original setting in the workflow)
        - CLEANUP: if the target(s) were marked vulnerable to overcome resistance, remove that DAE effect
    - If (NO) continue roll as normal (do nothing) 

    USAGE: Automatic just place on a character 

v1.0 May 7 2022  jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

// make sure the attempted hit was made with a spell attack of some type
if (!["msak", "rsak", "save"].includes(args[0].item.data.actionType)) return;

if (args[0].macroPass === "preItemRoll") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.data.data;
    const pcActor = token.actor.data.data;
    const targets = args[0].targets;

    // setup buttons with all elemental types known on the character sheet 
    let buttonData = {};
    if (getProperty(pcActor, "flags.dae.EAAcid"))
        buttonData.acid = {
            icon: '<p> </p><img src = "systems/dnd5e/icons/skills/affliction_20.jpg" width="60" height="60"></>',
            label: "<p>Acid</p>",
            callback: () => choice = "acid"
        };
    if (getProperty(pcActor, "flags.dae.EACold"))
        buttonData.cold = {
            icon: '<p> </p><img src = "systems/dnd5e/icons/skills/ice_09.jpg" width="60" height="60"></>',
            label: "<p>Cold</p>",
            callback: () => choice = "cold"
        };
    if (getProperty(pcActor, "flags.dae.EAFire"))
        buttonData.fire = {
            icon: '<p> </p><img src = "systems/dnd5e/icons/skills/fire_10.jpg" width="60" height="60"></>',
            label: "<p>Fire</p>",
            callback: () => choice = "fire"
        };
    if (getProperty(pcActor, "flags.dae.EALightning"))
        buttonData.lightning = {
            icon: '<p> </p><img src = "systems/dnd5e/icons/skills/blue_21.jpg" width="60" height="60"></>',
            label: "<p>Lightning</p>",
            callback: () => choice = "lightning"
        };
    if (getProperty(pcActor, "flags.dae.EAThunder"))
        buttonData.thunder = {
            icon: '<p> </p><img src = "systems/dnd5e/icons/skills/shadow_06.jpg" width="60" height="60"></>',
            label: "<p>Thunder</p>",
            callback: () => choice = "thunder"
        };
    buttonData.none = {
        icon: '<p> </p><img src = "icons/svg/cancel.svg" width="60" height="60"></>',
        label: "<p>No</p>",
        callback: () => choice = "none"
    }
    if (!buttonData.length > 1) {   // No Elemental Adept Feats present 
        ui.notifications.error("No Elemental Adepts Feats Present on the Character Sheet...");
        return;
    }

    // display dialog to substitute damage
    let choice = "";
    async function dialogAsync() {
        return await new Promise(async (resolve) => {
            new Dialog({
                title: "Elemental Adept",
                content: "<p>Would you like to change the spell damage type?</p>",
                buttons: buttonData,
                close: async () => {
                    resolve(choice);
                }
            }).render(true);
        });
    }

    let newDamageType = await dialogAsync()
    if ((!newDamageType) || (newDamageType == "none")) return;   // no substitution selected

    // mark all targets that are resistant to this damage type now vulnerable    
    for (let i = 0; i < targets.length; i++) {
        //let targetToken = targets[i].data;
        let targetActor = targets[i].actor;
        //let drList = targetActor.data.data.traits.dr.value;

        const match = targetActor.data.data.traits.dr.value.find(element => {
            if (element.includes(newDamageType)) {
                markTargetVulnerable(targetActor, newDamageType, args[0]);
            }
        });
    }

    // remember original damage and damage type so we can put them back later
    // strip damage type from the originalDamage if it exists and add "min2" and the new damage type
    let justDice = itemData.damage.parts[0][0];
    let index = justDice.indexOf('[');
    if (index !== -1) justDice = justDice.slice(0, index);
    let newDamage = justDice + "min2" + "[" + newDamageType + "]";
    let newScalingDamage = itemData.scaling.formula + "min2";

    // set the item with the new values, remember top add min2 to scaling as well
    await setProperty(workflow, "originalDamage", itemData.damage.parts[0][0]);
    await setProperty(workflow, "originalDamageType", itemData.damage.parts[0][1]);
    await setProperty(workflow, "originalScalingDamage", itemData.scaling.formula);
    await setProperty(workflow, "newDamageType", newDamageType);
    await setProperty(workflow, "newDamage", newDamage);
    await setProperty(workflow, "newScalingDamage", newScalingDamage);

} else if (args[0].macroPass === "templatePlaced") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.data.data;

    // set the item with the new values, remember top add min2 to scaling as well
    itemData.damage.parts[0][0] = getProperty(workflow, "newDamage");
    itemData.damage.parts[0][1] = getProperty(workflow, "newDamageType");
    itemData.scaling.formula = getProperty(workflow, "newScalingDamage");

} else if (args[0].macroPass === "preambleComplete") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.data.data;

    // set the item with the new values, remember top add min2 to scaling as well
    itemData.damage.parts[0][0] = getProperty(workflow, "newDamage");
    itemData.damage.parts[0][1] = getProperty(workflow, "newDamageType");
    itemData.scaling.formula = getProperty(workflow, "newScalingDamage");

} else if (args[0].macroPass === "preAttackRoll") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.data.data;

} else if (args[0].macroPass === "preCheckHits") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.data.data;

} else if (args[0].macroPass === "postAttackRoll") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.data.data;

} else if (args[0].macroPass === "preDamageRoll") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.data.data;

} else if (args[0].macroPass === "postDamageRoll") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.data.data;

} else if (args[0].macroPass === "preSave") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.data.data;

} else if (args[0].macroPass === "postSave") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.data.data;
    console.log("MACRO TEST | TEMPLATE ITEM DATA: %O", itemData);
    //console.log("MACRO TEST | TEMPLATE workflow %O",workflow);

} else if (args[0].macroPass === "preDamageApplication") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.data.data;
    console.log("MACRO TEST | TEMPLATE ITEM DATA: %O", itemData);
    //console.log("MACRO TEST | TEMPLATE workflow %O",workflow);

} else if (args[0].macroPass === "preActiveEffects") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.data.data;
    console.log("MACRO TEST | TEMPLATE ITEM DATA: %O", itemData);
    //console.log("MACRO TEST | TEMPLATE workflow %O",workflow);

} else if (args[0].macroPass === "postActiveEffects") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    const targets = args[0].targets;
    let itemData = theItem.data.data;
    console.log("MACRO TEST | TEMPLATE ITEM DATA: %O", itemData);

    // remove any vulnerability previously set on target(s)
    for (let i = 0; i < targets.length; i++) {
        let targetActor = targets[i].actor;
        let effect = await findEffect(targets[i], "EAVulnerability");
        if (effect) await MidiQOL.socket().executeAsGM("removeEffects", { actorUuid: targetActor.uuid, effects: [effect.id] });
    }

    // restore original spell damage type to the primary spell damage and scaling
    theItem.data.data.damage.parts[0][0] = await getProperty(workflow, "originalDamage");
    theItem.data.data.damage.parts[0][1] = await getProperty(workflow, "originalDamageType");
    theItem.data.data.scaling.formula = await getProperty(workflow, "originalScalingDamage");

    console.log("MACRO TEST | WORKFLOW: %O", workflow);
    console.log("MACRO TEST | FINAL ITEM DATA: %O", theItem);
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

// Function to test for an effect
async function findEffect(target, effectName) {
    let effectUuid = null;
    effectUuid = target?.actor.data.effects.find(ef => ef.data.label === effectName);
    return effectUuid;
}