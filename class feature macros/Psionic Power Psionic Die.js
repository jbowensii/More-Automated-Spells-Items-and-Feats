/*****
Psionic Power: Psionic Power

USEAGE : PASSIVE
This energy is represented by your Psionic Energy dice, which are each a d6. 
You have a number of these dice equal to twice your proficiency bonus, and 
they fuel various psionic powers you have, which are detailed below.

Some of your powers expend the Psionic Energy die they use, as specified 
in a power’s description, and you can’t use a power if it requires you to 
use a die when your dice are all expended. You regain all your expended Psionic 
Energy dice when you finish a long rest. In addition, as a bonus action, you 
can regain one expended Psionic Energy die, but you can’t do so again until you 
finish a short or long rest.

When you reach certain levels in this class, the size of your Psionic Energy 
dice increases: at 5th level (d8), 11th level (d10), and 17th level (d12). T
he powers below use your Psionic Energy dice.

v0.1 April 15 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

if (args[0] === "on") {
    const pcActor = await fromUuid(args[args.length - 1].actorUuid);
    let rogueLevel = testClass (pcActor, "rogue", "Soulknife", 3)?.levels ?? 0;
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
function testClass (testActor, className, subClassName, levels) {
    let theClass = testActor.data.data.classes[className] ;
    if (theClass) {
        if ((levels > 0) && (theClass.levels >= levels)) {
            if (subClassName === null || (theClass.subclass === subClassName)) {
                return theClass;
            }
        }
    }
    return null;
}