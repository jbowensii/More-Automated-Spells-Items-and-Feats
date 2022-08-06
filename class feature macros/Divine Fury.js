/*****
Divine Fury | Auto Divine Fury  [there are two items to make this function]

NOTE: I used Tom Posney's MIDI-QOL Sneak Attack / Auto Sneak Attack as a templete for this

USEAGE : PASSIVE
Please place these two items on a Barbarian Zealot the rest is automated
 
v1.1 August 6 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

if (["mwak", "rwak"].includes(args[0].item.data.actionType)) {
    let pcActor = token.actor;

    // Test Class
    let pcBarbarian = pcActor.getRollData().classes?.barbarian;
    if (pcBarbarian === null) {
        ui.notifications.error("You are not a Barbarian!");
        return;
    }

    // Test Subclass
    let pcBarbarianSubclass = pcActor.getRollData().classes.barbarian?.subclass.identifier;
    if (pcBarbarianSubclass != "path-of-the-zealot") {
        ui.notifications.error("You are not a Barbarian Zealot!");
        return;
    }

    // Test if rage is active
    let effect = await findEffect(token, "Rage");
    if (!effect) {
        ui.notifications.error("You are not Raging!");
        return;
    }

    // Check to see if you have already made a divine fury attack this round
    if (game.combat) {
        const combatTime = `${game.combat.id}-${game.combat.round + game.combat.turn / 100}`;
        const lastTime = actor.getFlag("midi-qol", "divineFuryTime");
        if (combatTime === lastTime) return {};  // already used divine fury this round
    }

    // check to see if autoDivineFury is active, if it is skip the prompt
    let useDivineFury = getProperty(actor.data, "flags.dae.autoDivineFury");
    if (!useDivineFury) {
        console.log("MACRO | prompt user with dialog to use Divine Fury");
        let dialog = new Promise((resolve, reject) => {
            new Dialog({
                // localize this text
                title: "Conditional Damage",
                content: `<p>Use Divine Fury?</p>`,
                buttons: {
                    one: {
                        icon: '<i class="fas fa-check"></i>',
                        label: "Confirm",
                        callback: () => resolve(true)
                    },
                    two: {
                        icon: '<i class="fas fa-times"></i>',
                        label: "Cancel",
                        callback: () => { resolve(false) }
                    }
                },
                default: "two"
            }).render(true);
        });
        useDivineFury = await dialog;
    }
    if (!useDivineFury) return {};  // do not use divine fury

    // the player wants to use divine fury or autoDivineFury is active
    const diceMult = args[0].isCritical ? 2 : 1;
    const baseDice = 1;
    const baseBonus = Math.ceil(pcBarbarian.levels / 2);

    if (game.combat) {
        const combatTime = `${game.combat.id}-${game.combat.round + game.combat.turn / 100}`;
        const lastTime = actor.getFlag("midi-qol", "divineFuryTime");
        if (combatTime !== lastTime) {
            await actor.setFlag("midi-qol", "divineFuryTime", combatTime)
        }
    }
    return { damageRoll: `${baseDice * diceMult}d6 + ${baseBonus}`, flavor: "Divine Fury" };
}

// Function to test for an effect
async function findEffect(target, effectName) {
    let effectUuid = null;
    effectUuid = target?.actor.data.effects.find(ef => ef.data.label === effectName);
    return effectUuid;
}