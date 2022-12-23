/*****
Psionic Power: Psychic Whispers

USEAGE : AUTOMATED
This item should be placed on the character that has Psionic Power: Psychic Whispers  
 
v1.5 December 18 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
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
