/*****
Elemental Adept 

When you gain this feat, choose one of the following damage types: acid, cold, fire, lightning, or thunder.
    - Spells you cast ignore resistance to damage of the chosen type. 
    - In addition, when you roll damage for a spell you cast that deals damage of that type, you can treat any 1 on a damage die as a 2.
You can select this feat multiple times. Each time you do so, you must choose a different damage type.

Before you roll for spell damage:
    - retreive the damage type fromt thew DAE variable = damageType 
    - duplicate the ITEM on the workflow as OriginalItem
    - search through all damage on the workfolow ITEM for the given damage type
    - if found add "min2" to all damages
    - test all targets for resistance to damageType
    - for every target with resistance set vulnerability
    - CLEANUP: restore the item and remove the vulnerability form all target(s)

v0.7 April 10 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

// make sure the attempted hit was made with a spell attack of some type
if (!["msak","rsak","save"].includes(args[0].item.data.actionType)) return;       
const damageType = "lightning";

if (args[0].macroPass === "preItemRoll") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    const targets = args[0].targets;

    // backup the whole original item as a property on the workflow
    let backupItem = theItem.clone();
    await setProperty(workflow, "originalItem", backupItem);

    // mark all targets that are resistant to this damage type now vulnerable to cancel the resistance
    // replace this later with a .map function  
    for (let i = 0; i < targets.length; i++) {
        let targetActor = targets[i].actor;
        const match = targetActor.data.data.traits.dr.value.find(element => {
            if (element.includes(damageType)) markTargetVulnerable(targetActor, damageType, args[0]); });
    }

} else if (args[0].macroPass === "preambleComplete") {
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.data.data;

    // strip damage type in [] from the originalDamage if it exists and add "min2" and the damage type back in []
    // replace this later with a .map function 
    for (let i=0; i < itemData.damage.parts.length; i++) {
        let oldDamage = itemData.damage.parts[i][1];
        let oldDice   = itemData.damage.parts[i][0];
        if (oldDamage === damageType) {
            let index = oldDice.indexOf('[');
            if (index !== -1) oldDice = oldDice.slice(0, index); // remove everything after the first open bracket '['
            itemData.damage.parts[i][1] = damageType;
            itemData.damage.parts[i][0] = oldDice+"min2"+"["+damageType+"]";
            itemData.scaling.formula = itemData.scaling.formula+"min2";
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
        if (effect) await MidiQOL.socket().executeAsGM("removeEffects", {actorUuid: targetActor.uuid, effects:[effect.id]});
    }

    // restore original spell damage and scaling from the backup item
    let backupItem = await getProperty(workflow, "originalItem");
    // replace this later with a .map function 
    for (let i = 0; i < backupItem.data.data.damage.parts.length; i++) theItem.data.data.damage.parts[i] = backupItem.data.data.damage.parts[i];
    theItem.data.data.scaling = backupItem.data.data.scaling;

} return; 

// if the character has resistance to the new damage type, set vulnerability to negate it
async function markTargetVulnerable(target, damageType, args) {
    const effectData = {
        label : "EAVulnerability",
        icon : "icons/magic/defensive/barrier-shield-dome-deflect-blue.webp",
        origin: args.uuid,
        changes: [{
          "key": "data.traits.dv.value",        
          "value": `${damageType}`,
          "mode": 2,
          "priority": 20
          }],
         disabled: false
       }
    await MidiQOL.socket().executeAsGM("createEffects", {actorUuid: target.uuid, effects: [effectData]});
}

// Function to test for an effect
async function findEffect (target, effectName) {
    let effectUuid = null;
    effectUuid = target?.actor.data.effects.find(ef=> ef.data.label === effectName);
    return effectUuid;
}