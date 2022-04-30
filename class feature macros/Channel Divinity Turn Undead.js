/*****
Cleric: Turn Undead

USEAGE : ACTIVATE TO CHANNEL DIVINITY : TURN UNDEAD
Click on this item to activate the turn undead.  
Please remember to setup usage consumption in the itme itself.  
 
MANEUVER DESCRIPTION:
As an action, you present your holy symbol and speak a prayer censuring the undead. Each undead that 
can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its 
saving throw, it is turned for 1 minute or until it takes any damage.

A turned creature must spend its turns trying to move as far away from you as it can, and it can’t 
willingly move to a space within 30 feet of you. It also can’t take reactions. For its action, it 
can use only the Dash action or try to escape from an effect that prevents it from moving. If there’s 
nowhere to move, the creature can use the Dodge action.

Starting at 5th level, when an undead fails its saving throw against your Turn Undead feature, the 
creature is instantly destroyed if its challenge rating is at or below a certain 
threshold, as shown in the Destroy Undead algorithm below:

if cleric level > 16 ... CR <= 4 DEAD else
    if cleric level > 13 ... CR <= 3 DEAD else
        if cleric level > 10 ... CR <= 2 DEAD else
            if cleric level > 7 ... CR <= 1 DEAD else
                if cleric level >4 ... CR <= 1/2 DEAD
                        
v0.9 April 30 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
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
    const actorClass = testClass(pcActor, "cleric", null, 1);
    if (!actorClass) return;
    if (actorClass.levels > 16) crDestroy = 4;
    else if (actorClass.levels > 13) crDestroy = 3;
    else if (actorClass.levels > 10) crDestroy = 2;
    else if (actorClass.levels > 7) crDestroy = 1;
    else if (actorClass.levels > 4) crDestroy = 0.5;

    // set HP = 0 for all targets of the CR or less
    let target = null;
    for (target of workflow.targets) {
        if (target.actor.data.data.details.cr <= crDestroy) {
            await target.actor.update({ "data.attributes.hp.value": 0 });

        }
    }
}

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