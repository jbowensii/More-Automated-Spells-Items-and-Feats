/*****
Cleric: Turn Undead

USEAGE : ACTIVATE TO CHANNEL DIVINITY : TURN UNDEAD
Click on this item to activate the turn undead.  
Please remember to setup usage consumption in the itme itself.  

This Macro requires a GAME LEVEL MACRO: MAKE DEAD 

v1.4 August 13 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/
// if (!game.modules.get("warpgate")?.active) return ui.notifications.error("Turn Undead requires warpgate module");

if (args[0].macroPass === "preambleComplete") {
    let workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    // I am stealing the activation condition as a string for the creature type I want to hit
    const activationCondition = args[0].itemData.data.activation.condition.toLowerCase();
    let immunity = ["Turn Immunity"];
    for (let target of workflow.targets) {
        let creatureType = target.actor.data.data.details.type;
        // remove targets that are not creatures (aka PCs etc)
        if ((creatureType === null) || (creatureType === undefined)) {
            workflow.targets.delete(target);
        }
        // remove creatures that are not undead 
        else if (!([creatureType.value.toLowerCase(), creatureType.subtype.toLowerCase()].includes(activationCondition.toLowerCase()))) {
            workflow.targets.delete(target);
        }
        // remove creatures with turn immunity
        else if (target.actor.items.find(i => immunity.includes(i.name))) {
            workflow.targets.delete(target);
        }

        // check for i, if so give advanatage on tragets next save
        let resistance = ["Turn Resistance"];
        if (target.actor.items.find(i => resistance.includes(i.name))) {
            // add resistance to next save 
            await markTurnResistance(target.actor, args);
        }

        game.user.updateTokenTargets(Array.from(workflow.targets).map(t => t.id));
    }
} else if (args[0].macroPass === "postSave") {
    let workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const pcActor = workflow.actor;

    let crDestroy = 0.0;
    if (workflow.targets.size === 0) return;
    let actorClass = pcActor.classes.cleric.data.data.levels;
    if (actorClass > 16) crDestroy = 4;
    else if (actorClass > 13) crDestroy = 3;
    else if (actorClass > 10) crDestroy = 2;
    else if (actorClass > 7) crDestroy = 1;
    else if (actorClass > 4) crDestroy = 0.5;

    // set HP = 0 for all targets of the CR or less that have been turned
    for (let target of workflow.failedSaves) {
        if (target.actor.data.data.details.cr < crDestroy) {
            //let target = failedSave.actor;
            let maxHP = Number(target.actor.data.data.attributes.hp.max);
            let updates = {
                actor: { "data.attributes.hp.value": 0, "data.attributes.hp.max": maxHP }
            };
            let mutateCallbacks = "";
            await warpgate.mutate(target.document, updates, mutateCallbacks, { permanent: true });
        }
    }
    return;
}

// if the character has resistance to the new damage type, set vulnerability to negate it
async function markTurnResistance(target, args) {
    const effectData = {
        label: "Turn Resistance",
        icon: "systems/dnd5e/icons/skills/affliction_21.jpg",
        origin: args.uuid,
        changes: [{
            "key": "flags.midi-qol.advantage.ability.check.wis",
            "value": 1,
            "mode": 0,
            "priority": 20
        }],
        disabled: false,
        flags: {
            dae: {
                specialDuration: ["isSave"]
            }
        }
    }
    await MidiQOL.socket().executeAsGM("createEffects", { actorUuid: target.uuid, effects: [effectData] });
    return;
}