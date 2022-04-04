/*****
Fighter Battlemaster Maneuvers: Grappling Strike

USEAGE : ACTIVATE AFTER ATTACK
This Maneuver must be activated AFTER the character makes an attack and knows that a HIT was successful.  
This will activate any bonuses, saves, effects and extra damage to the TARGET.  
A Superiority Die will be expended immediately.

 
MANEUVER DESCRIPTION:
Immediately after you hit a creature with a melee attack on your turn, you can expend one superiority die 
and then try to grapple the target as a bonus action (see the Player’s Handbook for rules on grappling). 
Add the superiority die to your Strength (Athletics) check.
*****/

if (args[0].macroPass === "preSaves")  {

    // define Actor, Target and Item
    const pcActor = MidiQOL.MQfromActorUuid(args[0].actorUuid);
    const targetActor = args[0].targets[0].actor;
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;

    // check to make sure only one target is selected
    if ((args[0].targetUuids.length < 1) || (args[0].targetUuids.length > 1)) {
        ui.notifications.error("You need to select a single target.");
        await incrementResource (pcActor, "Superiority Dice", 1);
        return;
    }

    let superiorityDie = pcActor.getFlag("dae", "SuperiorityDie");
    if (superiorityDie === null) {
        ui.notifications.error("Superiority Die feature is missing on the character sheet.");
        await incrementResource (pcActor, "Superiority Dice", 1);
        return;
    }
    
    // Set the DC and setup the saving throw
    let pcAthSkillTotal = pcActor.data.data.skills["ath"].total;
    const roll = await (new Roll(`1d20 + ${pcAthSkillTotal} + ${superiorityDie}`)).roll(); 
    theItem.data.data.save.dc = roll.total;
    theItem.data.data.save.scaling = "flat";

    let skill = "acr";
    if (targetActor.data.data.skills.ath.passive > targetActor.data.data.skills.acr.passive) skill = "ath";
    setProperty(theItem.data.flags, "midi-qol.overTimeSkillRoll", skill);

} else if (args[0].macroPass === "postActiveEffects") {
    const item = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    item.data.data.save.ability = "str";
}
return; 

//---------------------------------- MY FUNCTIONS -------------------------------------------

// Increment available resource
async function incrementResource (testActor, resourceName, numValue) {
    let actorDup = duplicate(testActor.data._source);
    let resources = Object.values(actorDup.data.resources);
    let foundResource = resources.find(i => i.label.toLowerCase() === resourceName.toLowerCase());
    if (foundrResource) {
        foundResource.value = foundResource.value + numValue;
        await testActor.update(actorDup); 
    } else ui.notifications.error("You have not setup a Superiority Dice resource.");
    return;
}
