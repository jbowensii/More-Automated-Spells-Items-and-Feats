/*****
Channel Divinity: Preserve Life

USE: Manually triggered Preserve Life to use the available healing pool on the target
Create a healing pool 
Store the healing pool on the character in a DAE variable that terminates at the end of the actors turn

v1.0 August 17 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

if (args[0] === "on") {
    const pcActor = token.actor;
    // Test Class
    let pcCleric = pcActor.getRollData().classes?.cleric;
    if (pcCleric === null) {
        ui.notifications.error("You are not a cleric!");
        return;
    }

    // Test Subclass
    let pcClericSubclass = pcActor.getRollData().classes.cleric?.subclass.identifier;
    if (pcClericSubclass != "life-domain") {
        ui.notifications.error("You are not a Life Domain cleric!");
        return;
    }

    //5x cleric level healing pool
    const pool = 5 * pcCleric.levels;
    pcActor.setFlag("dae", "lifehealingpool", pool);
    return;

} else if (args[0] === "off") {
    const pcActor = await fromUuid(args[args.length - 1].actorUuid);
    pcActor.unsetFlag("dae", "lifehealingpool");
    return;
}
