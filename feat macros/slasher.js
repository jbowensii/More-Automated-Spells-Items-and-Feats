/*****
Slasher

USAGE: Automatic just place on a character 

v2.0 December 22 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

// make sure the attempted hit was made with a weapon attack
if (!["mwak", "rwak"].includes(args[0].item.system.actionType)) return;

if (args[0].macroPass === "preDamageRoll") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].itemUuid);
    let targetToken = await fromUuid(args[0].hitTargetUuids[0]);
    let targetActor = targetToken.actor;
    let theItem = workflow.item;

    if (theItem.labels.damageTypes !== "Slashing") return;   // not a slashing weapon  
    else {
        let effect = await findEffect(targetActor, "Reduced Movement");
        if (!effect) await applyReduceMovementEffect(targetActor, args[0].uuid);
        if (workflow.isCritical) await applyAttackDisadvantageEffect(targetActor, args[0].uuid);
    }
    return;
}
return;

//---------------------------------- MY FUNCTIONS -------------------------------------

// Apply the reduce movement to the target
async function applyReduceMovementEffect(target, originUuid) {
    let effectData = {
        label: "Reduced Movement",
        icon: "icons/equipment/feet/boots-leather-engraved-brown.webp",
        origin: originUuid,
        changes: [{ "key": "data.attributes.movement.all", "value": `-10`, "mode": 0, "priority": 20 }],
        disabled: false,
        flags: { dae: { specialDuration: ["turnStartSource"] }, }
    }
    await MidiQOL.socket().executeAsGM("createEffects", { actorUuid: target.uuid, effects: [effectData] });
}

// Apply the Disadvantage effect to the target
async function applyAttackDisadvantageEffect(target, originUuid) {
    let effectData = {
        label: "Attack Disadvantage",
        icon: "icons/magic/light/beam-explosion-pink-purple.webp",
        origin: originUuid,
        changes: [{ "key": "flags.midi-qol.disadvantage.attack.all", "value": `1`, "mode": 0, "priority": 20 }],
        disabled: false,
        flags: { dae: { specialDuration: ["turnStartSource"] }, }
    }
    await MidiQOL.socket().executeAsGM("createEffects", { actorUuid: target.uuid, effects: [effectData] });
}

// Function to find an effect on an actor
async function findEffect(thisActor, effectName) {
    let effectUuid = null;
    effectUuid = thisActor?.effects.find(ef => ef.label === effectName);
    return effectUuid;
}