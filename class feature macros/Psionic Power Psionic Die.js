/*****
Psionic Power: Psionic Power

USEAGE : PASSIVE
This energy is represented by your Psionic Energy dice, which are each a d6. 
You have a number of these dice equal to twice your proficiency bonus, and 
they fuel various psionic powers you have, which are detailed below.

v1.0 May 7 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

if (args[0] === "on") {
    const pcActor = await fromUuid(args[args.length - 1].actorUuid);
    let rogueLevel = testClass(pcActor, "rogue", "Soulknife", 3)?.levels ?? 0;
    if (!rogueLevel) {
        ui.notifications.error("You are not a Rogue: Soulknife of at least 3rd level.");
        return;
    }
    let flagData;
    if (rogueLevel > 16) flagData = "+ 1d12";
    else if (rogueLevel > 10) flagData = "+ 1d10";
    else if (rogueLevel > 4) flagData = "+ 1d8";
    else if (rogueLevel > 0) flagData = "+ 1d6";
    pcActor.setFlag("dae", "PsionicDie", flagData)

} else if (args[0] === "off") {
    const pcActor = await fromUuid(args[args.length - 1].actorUuid);
    pcActor.unsetFlag("dae", "PsionicDie");
}

// Test PC Class, Subclass and Class Level
// RETURN the class object (TRUE) or null (FALSE)
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