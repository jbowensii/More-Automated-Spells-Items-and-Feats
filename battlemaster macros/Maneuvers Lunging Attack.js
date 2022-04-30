/*****
Fighter Battlemaster Maneuvers: Lunging Attack

*** AWAITING SOLUTION FROM MIDI TO GET THIS TO WORK WITH RANGE CHECKING ***

USEAGE : ACTIVATE BEFORE ATTACK
This Maneuver must be activated BEFORE the character makes an attack.  
This will setup any bonuses and effects on the TARGET character.  
A Superiority Die will be expended immediately.
 
MANEUVER DESCRIPTION:
When you make a melee weapon attack on your turn, you can expend one 
superiority die to increase your reach for that attack by 5 feet. 
If you hit, you add the superiority die to the attack’s damage roll.

v0.4 March 31 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

// Activate on preActiveEffects
if (args[0].macroPass === "preItemRoll") {

    // Item itself defining the workflow 
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;

    // make sure the attempted hit was made with a melee weapon attack
    if ((theItem != null) && (theItem.name != "Maneuvers: Lunging Attack")) {
        if (!["mwak"].includes(args[0].item.data.actionType)) {
            ui.notifications.error("Lunging Attack only works with a melee weapon attack");
            await incrementResource(pcActor, "Superiority Dice", 1);
            return;
        }
        else {
            let range = theItem.data.data.range.value;
            theItem.data.data.range.value = (range + 5);
        }
    }
}
return;

//---------------------------------- MY FUNCTIONS -------------------------------------------

// Increment available resource
async function incrementResource(testActor, resourceName, numValue) {
    let actorDup = duplicate(testActor);
    let resources = Object.values(actorDup.data.resources);
    let foundResource = resources.find(i => i.label.toLowerCase() === resourceName.toLowerCase());
    if (foundrResource) {
        foundResource.value = foundResource.value + numValue;
        await testActor.update(actorDup);
    } else ui.notifications.error("You have not setup a Superiority Dice resource.");
    return;
}
