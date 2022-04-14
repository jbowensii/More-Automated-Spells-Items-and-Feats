/*****
Slasher

Once per turn when you hit a creature with an attack that deals slashing damage, 
you can reduce the speed of the target by 10 feet until the start of your next turn.

When you score a critical hit that deals slashing damage to a creature, 
you grievously wound it. Until the start of your next turn, the target has 
disadvantage on all attack rolls.

v0.1 April 13 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

// make sure the attempted hit was made with a weapon attack
if (!["mwak","rwak"].includes(args[0].item.data.actionType)) return;

if (args[0].macroPass === "preDamageRoll") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].itemUuid);
    let targetToken = await fromUuid(args[0].hitTargetUuids[0]);
    let targetActor = targetToken.actor;
    let theItem = workflow.item.data.data;

    if (theItem.damage.parts[0][1] !== "slashing") return;   // not a slashing weapon  
        else {
            let effect = await findEffect(targetActor, "Reduced Movement");
            if (!effect) await applyReduceMovementEffect(targetActor, args[0].uuid);
            if (workflow.isCritical) await applyAttackDisadvantageEffect(targetActor, args[0].uuid);
        }
    return; 
}

// Apply the fightened effect to the target
async function applyReduceMovementEffect(target, originUuid) {
    let effectData = {
        label : "Reduced Movement",
        icon : "systems/dnd5e/icons/items/equipment/boots-leather.jpg",
        origin: originUuid,
        changes: [ { "key": "data.attributes.movement.all", "value": `-10`, "mode":0, "priority": 20 } ],
        disabled: false,
        flags: { dae: {specialDuration: ["turnStartSource"]}, }
       }
    await MidiQOL.socket().executeAsGM("createEffects", {actorUuid: target.uuid, effects: [effectData]});
}

// Apply the fightened effect to the target
async function applyAttackDisadvantageEffect(target, originUuid) {
    let effectData = {
        label : "Attack Disadvantage",
        icon : "systems/dnd5e/icons/skills/weapon_08.jpg",
        origin: originUuid,
        changes: [ { "key": "flags.midi-qol.disadvantage.attack.all", "value": `1`, "mode": 0, "priority": 20 } ],
        disabled: false,
        flags: { dae: {specialDuration: ["turnStartSource"]}, }
       }
    await MidiQOL.socket().executeAsGM("createEffects", {actorUuid: target.uuid, effects: [effectData]});
}

// Function to test for an effect
async function findEffect (thisActor, effectName) {
    let effectUuid = null;
    effectUuid = thisActor?.effects.find(ef=> ef.data.label === effectName);
    return effectUuid;        
}