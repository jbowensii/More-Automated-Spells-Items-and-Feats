/*****
Fighter Battlemaster Maneuvers: Lunging Attack

*** AWAITING SOLUTION FROM MIDI TO GET THIS TO WORK WITH RANGE CHECKING ***

USEAGE : ACTIVATE BEFORE ATTACK
This Maneuver must be activated BEFORE the character makes an attack.  
This will setup any bonuses and effects on the TARGET character.  
A Superiority Die will be expended immediately.

v2.0 December 17 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

// Activate on preActiveEffects
if (args[0].macroPass === "preItemRoll") {

    // Item itself defining the workflow 
    const pcActor = MidiQOL.MQfromActorUuid(args[0].actorUuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;

    // make sure the attempted hit was made with a melee weapon attack
    if ((theItem != null) && (theItem.name != "Maneuvers: Lunging Attack")) {
        if (!["mwak"].includes(args[0].item.system.actionType)) {
            ui.notifications.error("Lunging Attack only works with a melee weapon attack");
            await incrementResource(pcActor, "Superiority Dice", 1);
            return;
        }
        else {
            let range = theItem.system.range.value;
            theItem.system.range.value = (range + 5);
        }
    }
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