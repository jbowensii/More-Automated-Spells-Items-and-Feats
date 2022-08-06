/*****
Fighter Battlemaster : Superiority Die

USEAGE : PASSIVE
This item must be on the character for Manuevers to function.  
It does not do anything directly but is a helper effect to determine the Battle Master Hit Die (d8, d10, d12) based on level.
 
v1.2 May 7 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

if (args[0] === "on") {
    const pcActor = await fromUuid(args[args.length - 1].actorUuid);
    console.log("MACRO TEST | PC Actor: %O", pcActor);

    // Test Class
    let pcFighter = pcActor.getRollData().classes?.fighter;
    if (pcFighter === null) {
        ui.notifications.error("You are not a Fighter!");
        return;
    }

    // Test Subclass
    let pcFighterSubclass = pcActor.getRollData().classes.fighter?.subclass.identifier;
    if (pcFighterSubclass != "battle-master") {
        ui.notifications.error("You are not a Fighter Battlemaster!");
        return;
    }

    //const roll = await(new Roll(`2d8 + ${pcPaladin.levels}`)).roll();
    let fighterLevel = pcFighter.levels;
    console.log("MACRO TEST | Fighter Levels: %s", fighterLevel);

    let flagData;
    if (fighterLevel > 17) flagData = "+ 1d12";
    else if (fighterLevel > 9) flagData = "+ 1d10";
    else if (fighterLevel > 0) flagData = "+ 1d8";
    pcActor.setFlag("dae", "SuperiorityDie", flagData)

} else if (args[0] === "off") {
    const pcActor = await fromUuid(args[args.length - 1].actorUuid);
    pcActor.unsetFlag("dae", "SuperiorityDie");
}