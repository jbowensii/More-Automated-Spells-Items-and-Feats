/*****
Channel Divinity: Inspiring Smite

USE: Manually triggered after to hit with divine smite
Create a healing pool - roll 2d8 + class level
Store the healing pool on the character in a DAE variable that terminates at the end of the actors turn

v1.0 May 7 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

if (args[0] === "on") {
    const pcActor = await fromUuid(args[args.length - 1].actorUuid);

    let paladinClass = testClass(pcActor, "paladin", "oath-of-glory", 3)?.levels ?? 0;
    if (!paladinClass) {
        ui.notifications.error("You are not a Oath of Glory Paladin of at least 3rd level.");
        return;
    }

    //roll 2d8 + paladinClass.levels and store result in flag.dae.healingPool
    const roll = await(new Roll(`2d8 + ${paladinClass.levels}`)).roll();
    pcActor.setFlag("dae", "healingpool", roll.total);
    return;

} else if (args[0] === "off") {
    const pcActor = await fromUuid(args[args.length - 1].actorUuid);
    pcActor.unsetFlag("dae", "healingpool");
    return;
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