/*****
Cleric: Turn Undead

USEAGE : ACTIVATE TO CHANNEL DIVINITY : TURN UNDEAD
Click on this item to activate the turn undead.  
Please remember to setup usage consumption in the itme itself.  

This Macro requires a GAME LEVEL MACRO: MAKE DEAD 

v1.1 May 7 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

if (args[0].macroPass === "preambleComplete") {
    let workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    // I am stealing the activation condition as a string for the creature type I want to hit
    const activationCondition = args[0].itemData.data.activation.condition.toLowerCase();
    for (let target of workflow.targets) {
        let creatureType = target.actor.data.data.details.type;
        if ((creatureType === null) || (creatureType === undefined))    // that is not a creature
            workflow.targets.delete(target);
        else if (!([creatureType.value.toLowerCase(), creatureType.subtype.toLowerCase()].includes(activationCondition.toLowerCase()))) {
            workflow.targets.delete(target);
        }
        game.user.updateTokenTargets(Array.from(workflow.targets).map(t => t.id));
    }
} else if (args[0].macroPass === "postActiveEffects") {
    let workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const pcActor = workflow.actor;

    // set CR to destory
    let crDestroy = 0.0;
    if (workflow.targets.size === 0) return;
    //console.log("MACRO TEST | Actor: %O", pcActor);
    //console.log("MACRO TEST | Actor Classes: %O", pcActor.data.document.classes);
    //let actorClass = testClass(pcActor, "cleric", null, 1)?.levels ?? 0;
    //if (!actorClass) return;
    let actorClass = pcActor.classes.cleric.data.data.levels;
    if (actorClass > 16) crDestroy = 4;
    else if (actorClass > 13) crDestroy = 3;
    else if (actorClass > 10) crDestroy = 2;
    else if (actorClass > 7) crDestroy = 1;
    else if (actorClass > 4) crDestroy = 0.5;

    // set HP = 0 for all targets of the CR or less that have been turned
    //const macro = game.macros.getName("MakeDead");
    const macro = game.macros.find(i => i.name === "MakeDead");
    console.log("MACRO TEST | Macro Object: %O", macro);
    console.log("MACRO TEST | Actor Class: %O", actorClass);
    for (let target of workflow.targets) {
        console.log("MACRO TEST | CRDestroy 2: %s", crDestroy);
        console.log("MACRO TEST | target: %O", target);
        console.log("MACRO TEST | target actor before: %O", target.actor);
        let turned = null;
        turned = await targetFindEffect(target.actor, "Channel Divinity: Turn Undead");
        console.log("MACRO TEST | turned: %O", turned);
        console.log("MACRO TEST | target actor: %O", target.actor);
        console.log("MACRO TEST | CR: %s", target.actor.data.data.details.cr);
        if (target.actor.data.data.details.cr <= crDestroy) {
            console.log("MACRO TEST | CHECK FOR DEAD!");
            if (turned != undefined) {
                console.log("MACRO TEST | destroyed!");
                await macro.execute(target.actor.uuid);
            }
        }
    }
}

/* 
// Test PC Class, Subclass and Class Level
// RETURN the class object (TRUE) or null (FALSE)
function testClass(testActor, className, subClassName, levels) {
    //let theClass = testActor.data.data.classes[className];
    let className = testActor.classes.cleric;
    let classLevels = testActor.classes.cleric.data.data.levels;
    let subclassName =
        console.log("MACRO TEST | THE CLASS: %O", theClass);
    console.log("MACRO TEST | THE CLASS Levels: %i", testActor.classes.cleric.levels);
    console.log("MACRO TEST | THE CLASS subclass: %s", testActor.classes.cleric.subclass.name);

    if (theClass) {
        if ((levels > 0) && (theClass.levels >= levels)) {
            if (subClassName === null || (theClass.subclass.identifier.toLowerCase() === subClassName.toLowerCase())) {
                return theClass;
            }
        }
    }
    return null;
}
*/

// Function to test for an effect
async function targetFindEffect(target, effectName) {
    let effectUuid = null;
    console.log("MACRO TEST | target effects: %O", target.data.effects);
    console.log("MACRO TEST | effect name: %s", effectName);
    //effectUuid = target?.data.actorData.effects.find(ef => ef.name === effectName);
    effectUuid = target.data.effects.find(ef => ef.sourceName === effectName);
    console.log("MACRO TEST | effect UUID: %O", effectUuid);
    return effectUuid;
}