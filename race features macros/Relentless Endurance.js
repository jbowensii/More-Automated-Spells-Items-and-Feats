/*****
Relentless Endurance
When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. 
You can’t use this feature again until you finish a long rest.

v0.2 April 13 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

if (args[0].macroPass === "postDamageRoll") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].itemUuid);
    const actorUuid = workflow.tokenUuid;
    const actorToken = canvas.tokens.get(workflow.tokenId);
    const thisItem = actorToken.actor.items.find(i => i.name === "Relentless Endurance")?.data;

    // if Target HP > 0 return 
    if (actor.data.data.attributes.hp.value != 0) return;

    // Find Superiority Dice Resource
    let relentlessEndurance = await findSheetResource(pcActor, "Relentless Endurance");
    if (!resource) {
        ui.notifications.error("Could not find a recource labeled 'Relentless Endurance'...");
        return;
    }
    // moust have at least one use of Relentless Endurance remaining; reduce one point
    if (relentlessEndurance < 1) return;
    await decrimentSheetResource(actor, "Relentless Endurance", 1);

    // trigger BonusDamage to apply the extra damage / adjustments outside of the normal damage roll
    let effectData = {
        label: "Relentless",
        changes: [{ key: "flags.dnd5e.DamageBonusMacro", mode: 0, value: `ItemMacro.Relentless Endurance,all`, priority: 20 }],
        icon: thisItem.img,
        origin: thisItem.uuid,
        duration: { turns: 1 }
    };

    await MidiQOL.socket().executeAsGM("createEffects", { actorUuid: actorUuid, effects: [effectData] });
    return;

} else if (args[0].tag === "DamageBonus") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].itemUuid);
    const actorUuid = workflow.tokenUuid;
    const actorToken = canvas.tokens.get(workflow.tokenId);

    // remove extra damage effect 
    let effect = await findEffect(actorToken, "Relentless");
    await MidiQOL.socket().executeAsGM("removeEffects", { actorUuid: actorUuid, effects: [effect.id] });

    // Bonus Healing
    return { damageRoll: `1[healing]`, flavor: "Relentless Endurance" };
}

//---------------------------------- MY FUNCTIONS -------------------------------------

// Find available resource by name and return resource object
async function findSheetResource(testActor, resourceName) {
    let resources = Object.values(testActor.data.data.resources);
    let foundResource = resources.find(i => i.label.toLowerCase() === resourceName.toLowerCase());
    return foundResource;
}

// Decriment available resource
async function decrimentSheetResource(testActor, resourceName, numValue) {
    let actorDup = duplicate(testActor);
    let resources = Object.values(actorDup.data.resources);
    let foundResource = resources.find(i => i.label.toLowerCase() === resourceName.toLowerCase());
    foundResource.value = foundResource.value - numValue;
    await testActor.update(actorDup);
    return;
}

// Function to test for an effect
async function findEffect(target, effectName) {
    let effectUuid = null;
    effectUuid = target?.actor.data.effects.find(ef => ef.data.label === effectName);
    return effectUuid;
}