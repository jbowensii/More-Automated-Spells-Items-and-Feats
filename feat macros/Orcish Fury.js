/*****
Orcish Fury

USEAGE : AUTOMATIC
This item should be placed on the character that has the Orcish Fury Feat.  
Until used, during each melee attack the player will be prompted if they
want to use this ability.
 
v2.0 December 18 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
Bug fixes provided by tposney#1462 and callbritton#5405 thank you both
*****/

// make sure the attempted hit was made with a weapon attack

if (!["mwak", "rwak"].includes(args[0].item.system.actionType)) return;

const pcActor = MidiQOL.MQfromActorUuid(args[0].actorUuid);
if (args[0].hitTargetUuids.length === 0) return;
const target = await fromUuid(args[0].hitTargetUuids[0] ?? "");

// check to make sure only one target is selected
if ((args[0].targetUuids.length < 1) || (args[0].targetUuids.length > 1)) {
    ui.notifications.error("You need to select a single target.");
    return;
}

// Find Superiority Dice Resourcet
let orcishFury = await findSheetResource(pcActor, "Orcish Fury");
if (!orcishFury) {
    ui.notifications.error("Could not find a resource labeled 'Orcish Fury'...");
    return;
} else if (orcishFury.value < 1) return;

// create a dialog and prompt to spend a superiority die
let dialog = new Promise((resolve) => {
    new Dialog({
        // localize this text
        title: "Orcish Fury:",
        content: "<p>Use Orcish Fury for extra damage?</p>",
        buttons: {
            one: {
                icon: '<p> </p><img src = "icons/skills/melee/unarmed-punch-fist.webp" width="60" height="60"></>',
                label: "<p>Yes</p>",
                callback: () => resolve(true)
            },
            two: {
                icon: '<p> </p><img src = "icons/svg/cancel.svg" width="60" height="60"></>',
                label: "<p>No</p>",
                callback: () => { resolve(false) }
            }
        },
        default: "two"
    }).render(true);
});
let choice = await dialog;

if (!choice) return;

// if YES subtract a superiorty die
await decrimentSheetResource(pcActor, "Orcish Fury", 1);

// get the live MIDI-QOL workflow so we can make changes
const diceMult = args[0].isCritical ? 2 : 1;
let baseDice = (1 * diceMult);
let die = args[0].item.system.damage.parts[0][0].split('[')[0];  // everything before the [
die = die.toLowerCase();                                         // convert the string to lower case
let baseDie = die.split('d')[1];                                 //everything after the 'd' the die size and any mods
let furyRoll = (baseDice + "d" + baseDie);                       // assemble the FuryRoll

const damageType = args[0].item.system.damage.parts[0][1];       // get teh damage type from the weapon in use   

return { damageRoll: `${furyRoll}[${damageType}]`, flavor: "Orcish Fury" };

//---------------------------------- MY FUNCTIONS -------------------------------------

// Test for available resource
// Return resource object
async function findSheetResource(testActor, resourceName) {
    let resources = Object.values(testActor.system.resources);
    let foundResource = resources.find(i => i.label.toLowerCase() === resourceName.toLowerCase());
    return foundResource;
}

// Decriment available resource
async function decrimentSheetResource(testActor, resourceName, numValue) {
    const resourceKey = Object.keys(testActor.system.resources).find(k => testActor.system.resources[k].label.toLowerCase() === resourceName.toLowerCase());
    let newResources = duplicate(testActor.system.resources);
    newResources[resourceKey].value -= 1;
    await actor.update({"system.resources": newResources});
    return;
}
