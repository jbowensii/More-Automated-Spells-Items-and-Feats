/*****
Channel Divinity: Inspiring Smite

USE: Manually triggered after to hit with divine smite
Create a healing pool - roll 2d8 + class level
Store the healing pool on the character in a DAE variable that terminates at the end of the actors turn

v2.0 December 18 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

if (args[0] === "on") {
    const pcActor = await fromUuid(args[args.length - 1].actorUuid);

    // Test Class
    let pcPaladin = pcActor.getRollData().classes?.paladin;
    if (pcPaladin === null) {
        ui.notifications.error("You are not a Paladin!");
        return;
    }

    // Test Subclass
    let pcPaladinSubclass = pcActor.getRollData().classes.paladin?.subclass.identifier;
    if (pcPaladinSubclass != "oath-of-glory") {
        ui.notifications.error("You are not a Oath of Glory Paladin!");
        return;
    }

    //roll 2d8 + pcPaladin.levels and store result in flag.dae.healingPool
    const roll = await(new Roll(`2d8 + ${pcPaladin.levels}`)).evaluate({async: true});
    pcActor.setFlag("dae", "healingpool", roll.total);
    return;

} else if (args[0] === "off") {
    const pcActor = await fromUuid(args[args.length - 1].actorUuid);
    pcActor.unsetFlag("dae", "healingpool");
    return;
}