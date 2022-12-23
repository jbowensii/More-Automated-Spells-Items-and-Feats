/*****
Fighter Battlemaster Maneuvers: Grappling Strike

USEAGE : ACTIVATE AFTER ATTACK
This Maneuver must be activated AFTER the character makes an attack and knows that a HIT was successful.  
This will activate any bonuses, saves, effects and extra damage to the TARGET.  
A Superiority Die will be expended immediately.

v2.0 December 17 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

if (args[0].macroPass === "preSave") {

    // define Actor, Target and Item
    const pcActor = MidiQOL.MQfromActorUuid(args[0].actorUuid);
    const targetActor = args[0].targets[0].actor;
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;

    // check to make sure only one target is selected
    if ((args[0].targetUuids.length < 1) || (args[0].targetUuids.length > 1)) {
        ui.notifications.error("You need to select a single target.");
        await incrementResource(pcActor, "Superiority Dice", 1);
        return;
    }

    let superiorityDie = pcActor.getFlag("dae", "SuperiorityDie");
    if (superiorityDie === null) {
        ui.notifications.error("Superiority Die feature is missing on the character sheet.");
        await incrementResource(pcActor, "Superiority Dice", 1);
        return;
    }

    // Set the DC and setup the saving throw
    let pcAthSkillTotal = pcActor.system.skills.ath.total;
    const roll = await(new Roll(`1d20 + ${pcAthSkillTotal} + ${superiorityDie}`)).evaluate({async: true});

    theItem.system.save.dc = roll.total;
    theItem.system.save.scaling = "flat";

    let skill = "acr";
    if (targetActor.system.skills.ath.passive > targetActor.system.skills.acr.passive) skill = "ath";
    setProperty(theItem.flags, "midi-qol.overTimeSkillRoll", skill);

} else if (args[0].macroPass === "postActiveEffects") {
    const item = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    item.system.save.ability = "str";
}
return;

//---------------------------------- MY FUNCTIONS -------------------------------------------

// Increment available resource
async function incrementResource(testActor, resourceName, numValue) {
    const resourceKey = Object.keys(testActor.system.resources).find(k => testActor.system.resources[k].label.toLowerCase() === resourceName.toLowerCase());
    let newResources = duplicate(testActor.system.resources);
    newResources[resourceKey].value += 1;
    await actor.update({"system.resources": newResources});
    return;
}