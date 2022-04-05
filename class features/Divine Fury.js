/*****
Divine Fury | Auto Divine Fury

USEAGE : PASSIVE
PLease place these two items on a Barbarian Zealot
 
MANEUVER DESCRIPTION:
Starting when you choose this path at 3rd level, you can channel divine fury into your 
weapon strikes. While you’re raging, the first creature you hit on each of your turns 
with a weapon attack takes extra damage equal to 1d6 + half your barbarian level. 
The extra damage is necrotic or radiant; you choose the type of damage when you gain this feature.

v0.3 March 27 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

if (["mwak","rwak"].includes(args[0].item.data.actionType)) {
    pcActor = token.actor;
    const barbarian = testClass (pcActor, "barbarian", "zealot", 3)?.levels ?? 0;
    return {damageRoll: `${baseDice * diceMult}d6 + ${barbarian.levels/2}`, flavor: "Divine Fury"};    
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
