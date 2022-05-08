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
    let actorClass = testClass(pcActor, "cleric", null, 1)?.levels ?? 0;
    if (!actorClass) return;
    if (actorClass.levels > 16) crDestroy = 4;
    else if (actorClass.levels > 13) crDestroy = 3;
    else if (actorClass.levels > 10) crDestroy = 2;
    else if (actorClass.levels > 7) crDestroy = 1;
    else if (actorClass.levels > 4) crDestroy = 0.5;

    // set HP = 0 for all targets of the CR or less
    const macro = game.macros.getName("Make Dead");
    for (let target of workflow.targets) {
        if (target.actor.data.data.details.cr <= crDestroy) {
            macro.execute(target.actor.uuid);
        }
    }
}

// Test PC Class, Subclass and Class Level
// RETURN the class object (TRUE) or null (FALSE)
function testClass(testActor, className, subClassName, levels) {
    let theClass = testActor.data.data.classes[className];
    if (theClass) {
        if ((levels > 0) && (theClass.levels >= levels)) {
            if (subClassName === null || (theClass.subclass.identifier.toLowerCase() === subClassName.toLowerCase())) {
                return theClass;
            }
        }
    }
    return null;
}