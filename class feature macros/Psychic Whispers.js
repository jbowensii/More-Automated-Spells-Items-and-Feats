/*****
Psionic Power: Psychic Whispers

USEAGE : AUTOMATED
This item should be placed on the character that has Psionic Power: Psychic Whispers  
 
You can establish telepathic communication between yourself and others—perfect for quiet 
infiltration. As an action, choose one or more creatures you can see, up to a number of 
creatures equal to your proficiency bonus, and then roll one Psionic Energy die. For a 
number of hours equal to the number rolled, the chosen creatures can speak telepathically 
with you, and you can speak telepathically with them. To send or receive a message 
(no action required), you and the other creature must be within 1 mile of each other. 
A creature can’t use this telepathy if it can’t speak any languages, and a creature can 
end the telepathic connection at any time (no action required). You and the creature don’t 
need to speak a common language to understand each other.

The first time you use this power after each long rest, you don’t expend the Psionic 
Energy die. All other times you use the power, you expend the die.

v0.1 April 16 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

// make sure between 1 and 3 targets are selected
if ((args[0].targetUuids.length < 1) || (args[0].targetUuids.length > 3)) {
    ui.notifications.error("You need to select one to three targets");
    return;
}

// roll a Psionic Power Die = Durations in Hours
let psionicDie = pcActor.getFlag("dae", "PsionicDie");
const roll = await(new Roll(`${psionicDie}`)).roll();

// place an effect on all targets 0...n for the duration in hours (die roll * 3600)
let psychicDuration = (roll.total * 3600);
let effectData = {
    label: "Psychic Whispers",
    icon: "icons/magic/perception/orb-crystal-ball-scrying-blue.webp",
    origin: actor.uuid,
    disabled: false,
    duration: { seconds: psychicDuration }
}
for (let i = 0; i < targets.length; i++) await MidiQOL.socket().executeAsGM("createEffects", { actorUuid: targets[i].uuid, effects: [effectData] });
return;
