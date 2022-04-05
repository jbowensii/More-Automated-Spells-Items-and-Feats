/*****
Fighter Battlemaster : Superiority Die

USEAGE : PASSIVE
This item must be on the character for Manuevers to function.  
It does not do anything directly but is a helper effect to determine the Battle Master Hit Die (d8, d10, d12) based on level.
 
MANEUVER DESCRIPTION:
You learn maneuvers that are fueled by superiority dice. 
Maneuvers enhance an attack in some way. You have 5d8 superiority dice per short rest.

v0.6 March 25 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

if (args[0] === "on") {
    const pcActor = await fromUuid(args[args.length - 1].actorUuid);
    let fighterLevel = testClass (pcActor, "fighter", "Battle Master", 3)?.levels ?? 0;
    if (!fighterLevel) {
        ui.notifications.error("You are not a fighter battle master of at least 3rd level.");
        return;
    }
    let flagData;
    if (fighterLevel > 17) flagData = "+ 1d12";
    else if (fighterLevel > 9) flagData = "+ 1d10";
    else if (fighterLevel > 0) flagData = "+ 1d8";
    pcActor.setFlag("dae", "SuperiorityDie", flagData)    

} else if (args[0] === "off") {
    pcActor.unsetFlag("dae", "SuperiorityDie");
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