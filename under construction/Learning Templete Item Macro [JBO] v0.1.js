//Set debug Console Log value
let debug = true;

// all ItemMacros have arguments passed into the call
debugLog("Arguments: ", args, "OBJECT");

// get the live MIDI-QOL workflow so we can make changes
const workflow = MidiQOL.Workflow.getWorkflow(args[0].itemUuid);

//------------------------------- SET STANDARD VARIABLES ---------------------------------------

// Get PC UUID, Token and Actor objects
let pcTokenUuid = args[0].tokenUuid;
debugLog("PC Token UUID: ", pcTokenUuid, "STRING");
let pcToken = token;
debugLog("PC Token: ", pcToken, "OBJECT");
let pcActor = token.actor.data.data;
debugLog("PC Actor: ", pcActor, "OBJECT");

// The targets is an 'array of targets'
let targets = args[0].targets;

// Get 1st Target UUID, Token and Actor objects
let targetTokenUuid = args[0].hitTargetUuids[0];
debugLog("Target Token UUID: ", targetTokenUuid, "STRING");
let targetToken = await fromUuid(targetTokenUuid);
debugLog("Target Token: ", targetToken, "OBJECT");
let targetActor = targetToken.actor;
debugLog("Target Actor: ", targetActor, "OBJECT");

//---------------------------------- TEST MY FUNCTIONS ---------------------------------------

// Test call for function findEffect
let effect = null;
effect = await findEffect(targetActor, "Rage");
if (effect) {
    // remove the effect
    debugLog("The effect was found?", effect, "OBJECT");
    await removeEffect(targetActor.uuid, effect.data.id);
    debugLog("The effect was removed", effect, "OBJECT");
}
else {
    // effect not found
    debugLog("The effect was not found", effect, "OBJECT");
}

// Test find resource
let resource = null;
resource = await testResource(pcActor, "Superiority Dice");
if (resource) {
    // found the resource
    debugLog("The resource was found?", resource, "OBJECT");
}
else {
    // effect the resource was not found
    debugLog("The resource was not found", effect, "OBJECT");
}

// Test PC Class, Subclass and Class Level
// class test will be TRUE or FALSE
let classTest = await testClass(pcActor, "Fighter", "Battle Master", 3);
debugLog("Class Test - returned object", classTest, "OBJECT");

// Test for combat flags
let testFlag = 0;
await addCombatFlag(pcActor, "Parry", 5000);
testFlag = await getCombatFlag(pcActor, "Parry");
await addCombatFlag(pcActor, "Parry", 100);
testFlag = await getCombatFlag(pcActor, "Parry");
await removeCombatFlag(pcActor, "Parry");

//---------------------------------- MY FUNCTIONS -------------------------------------------

// Function Console Log
// Allows for turning off and on debug messages with one script global setting
function debugLog(messageText, data, objectFormat) {
    //if debugging is false, do not log a messgae to the console 
    if (!debug) return;

    switch (objectFormat) {
        case "STRING":
            console.log("TEST MACRO | %s %s", messageText, data);
            break;
        case "INTEGER":
            console.log("TEST MACRO | %s %i", messageText, data);
            break;
        case "FLOAT":
            console.log("TEST MACRO | %s %f", messageText, data);
            break;
        case "OBJECT":
            console.log("TEST MACRO | %s %O", messageText, data);
            break;
    }
    return;
}

// Function to test for an effect
async function findEffect(thisActor, effectName) {
    let effectUuid = null;
    effectUuid = thisActor?.effects.find(ef => ef.data.label === effectName);
    if (effectUuid) {
        debugLog("You found effect:", effectName, "STRING");
        return effectUuid;
    } else {
        debugLog("You did not find effect:", effectName, "STRING");
        return effectUuid;
    }
}

// Function to remove an effect
async function removeEffect(thisActorUuid, EffectId) {
    await MidiQOL.socket().executeAsGM("removeEffects", { actorUuid: thisActorUuid, effects: [EffectId] });
    debugLog("You removed effect uuid:", effectId, "STRING");
    return;
}

// Function to add an effect
async function addEffect(thisTokenUuid, effectName) {
    debugLog("List of Effects", CONFIG.statusEffects, "OBJECT");
    let effect = CONFIG.statusEffects.find(e => e.label === effectName);
    if (effect) {
        debugLog("Found Effect", effect, "OBJECT");
        await game.dfreds.effectInterface.addEffect({ effectName: effectName, uuid: thisTokenUuid });
        return;
    } else {
        debugLog("Effect Not Found:", effectName, "STRING");
        return;
    }
}

// Function to test if a COMBAT FLAG is set during this round of combat
async function getCombatFlag(thisActor, testFlag) {
    let flagValue = thisActor.getFlag("midi-qol", testFlag);
    debugLog("GET COMABT FLAG value:", flagValue, "INTEGER");
    return flagValue;
}

// add a COMBAT FLAG
async function addCombatFlag(thisActor, setFlag, flagValue) {
    let addFlag = thisActor.setFlag("midi-qol", setFlag, flagValue);
    debugLog("ADD COMBAT FLAG object:", addFlag, "OBJECT");
    debugLog("ADD COMBAT FLAG value:", flagValue, "INTEGER");
    return;
}

// remove a COMBAT FLAG is set
async function removeCombatFlag(thisActor, setFlag) {
    let removeFlag = await thisActor.unsetFlag("midi-qol", setFlag);
    debugLog("REMOVED COMBAT FLAG object:", removeFlag, "OBJECT");
    return;
}

// Test for available resource
// Return resource object
async function testResource(testActor, resourceName) {
    debugLog("Actor resource list:", testActor.data.data.resources, "OBJECT");

    let resources = Object.values(testActor.data.data.resources);
    let foundResource = resources.find(i => i.label.toLowerCase() === resourceName.toLowerCase());
    debugLog("Found Resource:", foundResource, "OBJECT");

    return foundResource;
}

// Decriment available resource
async function decrimentResource(testActor, resourceName, numValue) {
    let actorDup = duplicate(testActor);
    debugLog("Duplicate Updated Actor:", actorDup, "OBJECT");

    let resources = Object.values(actorDup.data.resources);
    let foundResource = resources.find(i => i.label.toLowerCase() === resourceName.toLowerCase());
    foundResource.value = foundResource.value - numValue;

    debugLog("Decriment Resouce:", foundResource.value, "OBJECT");
    await testActor.update(actorDup);

    return;
}

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

// Test PC Class, Subclass and Class Level
// RETURN the class object (TRUE) or null (FALSE)
// Test PC Class, Subclass and Class Level, RETURN the class object or null
function testClass(testActor, className, subClassName, levels) {
    let theClass = testActor.data.data.classes[className];
    if (theClass) {
        if ((levels > 0) && (theClass.levels >= levels)) {
            if (subClassName === null || (theClass.subclass === subClassName)) {
                return theClass;
            }
        }
    }
    return null;
}

// Check if Module is enabled
async function checkModule(moduleName) {
    if (!game.modules.get(`${moduleName}`)?.active) {
        ui.notifications.error("Please enable %s module", moduleName);
        return false;
    }
    return true;
}

// if the character has resistance to the new damage type, set vulnerability to negate it
async function markTargetVulnerable(target, damageType, args) {
    const effectData = {
        label: "EAVulnerability",
        icon: "icons/magic/defensive/barrier-shield-dome-deflect-blue.webp",
        origin: args.uuid,
        changes: [{
            "key": "data.traits.dv.value",
            "value": `${damageType}`,
            "mode": 2,
            "priority": 20
        }],
        disabled: false
    }
    await MidiQOL.socket().executeAsGM("createEffects", { actorUuid: target.uuid, effects: [effectData] });
}

//setup dynamic buttons and dialog 
function dynamicButtonsDialog() {
    // setup buttons with all elemental types known on the character sheet 
    let buttonData = {};
    if (getProperty(pcActor, "flags.dae.EAAcid"))
        buttonData.acid = {
            icon: '<p> </p><img src = "systems/dnd5e/icons/skills/affliction_20.jpg" width="60" height="60"></>',
            label: "<p>Acid</p>",
            callback: () => choice = "acid"
        };
    if (getProperty(pcActor, "flags.dae.EACold"))
        buttonData.cold = {
            icon: '<p> </p><img src = "systems/dnd5e/icons/skills/ice_09.jpg" width="60" height="60"></>',
            label: "<p>Cold</p>",
            callback: () => choice = "cold"
        };
    if (getProperty(pcActor, "flags.dae.EAFire"))
        buttonData.fire = {
            icon: '<p> </p><img src = "systems/dnd5e/icons/skills/fire_10.jpg" width="60" height="60"></>',
            label: "<p>Fire</p>",
            callback: () => choice = "fire"
        };
    if (getProperty(pcActor, "flags.dae.EALightning"))
        buttonData.lightning = {
            icon: '<p> </p><img src = "systems/dnd5e/icons/skills/blue_21.jpg" width="60" height="60"></>',
            label: "<p>Lightning</p>",
            callback: () => choice = "lightning"
        };
    if (getProperty(pcActor, "flags.dae.EAThunder"))
        buttonData.thunder = {
            icon: '<p> </p><img src = "systems/dnd5e/icons/skills/shadow_06.jpg" width="60" height="60"></>',
            label: "<p>Thunder</p>",
            callback: () => choice = "thunder"
        };
    buttonData.none = {
        icon: '<p> </p><img src = "icons/svg/cancel.svg" width="60" height="60"></>',
        label: "<p>No</p>",
        callback: () => choice = "none"
    }
    if (!buttonData.length > 1) {   // No Elemental Adept Feats present 
        ui.notifications.error("No Elemental Adepts Feats Present on the Character Sheet...");
        return;
    }

    // display dialog to substitute damage
    let choice = "";
    async function dialogAsync() {
        return await new Promise(async (resolve) => {
            new Dialog({
                title: "Elemental Adept",
                content: "<p>Would you like to change the spell damage type?</p>",
                buttons: buttonData,
                close: async () => {
                    resolve(choice);
                }
            }).render(true);
        });
    }

    let newDamageType = await dialogAsync()
    if ((!newDamageType) || (newDamageType == "none")) return;   // no substitution selected
}
// Example test for DAE flag
// let useSneak = getProperty(actor.data, "flags.dae.autoSneak");

// Apply the fightened effect to the target
async function applyFrightenedEffect(target, args) {
    effectData = {
        label: "Frightened",
        icon: "modules/dfreds-convenient-effects/images/frightened.svg",
        origin: args.uuid,
        changes: [
            { "key": "flags.midi-qol.disadvantage.attack.all", "value": `1`, "mode": 0, "priority": 20 },
            { "key": "flags.midi-qol.disadvantage.ability.check.all", "value": `1`, "mode": 0, "priority": 20 }
        ],
        disabled: false,
        flags: {
            dae: { specialDuration: ["turnEndSource"] },
            core: { statusId: "Convenient Effect: Frightened" }
        }
    }
    await MidiQOL.socket().executeAsGM("createEffects", { actorUuid: target.uuid, effects: [effectData] });
}

// await game.dfreds.effectInterface?.addEffect({ effectName: "the name of the effect", uuid: "uuid of the target", origin: "uuid of the source item/actor", metadata: "extra data" });

//let effect = target.actor.effects.find(i => i.data.label === "whatever");
//if (effect) await MidiQOL.socket().executeAsGM("removeEffects", { actorUuid: target.actor.uuid, effects: [effect.id] });
