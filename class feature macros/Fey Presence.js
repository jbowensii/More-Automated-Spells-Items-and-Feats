/*****
Fey Presence

Once per short rest, as an action, you can cause each creature in a 10-ft. cube 
from you to make a WIS saving throw (DC +14) or become charmed or frightened by 
you (your choice) until the end of your next turn.

- target evertything in a ten foot cube 
v0.3 April 11 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

if (args[0].macroPass === "preambleComplete") {
    let workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    // prompt user for the fightened or charmed effect, store on the workflow as feyPresenceEffect 
    let dialog = new Promise((resolve) => {
        new Dialog({
            // localize this text
            title: "Fey Presence:",
            content: "<p>Select the desired effect fightened or charmed?</p>",
            buttons: {
                one: {
                    icon: '<p> </p><img src = "modules/dfreds-convenient-effects/images/frightened.svg" width="60" height="60"></>',
                    label: "<p>Frightened</p>",
                    callback: () => resolve("Frightened")
                },
                two: {
                    icon: '<p> </p><img src = "modules/dfreds-convenient-effects/images/charmed.svg" width="60" height="60"></>',
                    label: "<p>Charmed</p>",
                    callback: () => {resolve("Charmed")}
                }
            },
            default: "one"
        }).render(true);
    });
    let selectedEffect = await dialog;
    await setProperty(workflow, "feyPresenceEffect", selectedEffect);

} else if (args[0].macroPass === "postActiveEffects") {
    let workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    //for every target the failed the saving throw apply the selected feyPresenceEffect
    let effect = getProperty(workflow, "feyPresenceEffect");
    if (effect)
        for (target of args[0].failedSaves) {
            let targetActor = target.actor;
            if (effect === "Frightened") await applyFrightenedEffect(targetActor, args);
                else if (effect === "Charmed") await applyCharmedEffect(targetActor, args);
                else ui.notifications.error("An error occured applying the effect.");
        }
} return;

// Apply the fightened effect to the target
async function applyFrightenedEffect(target, args) {
    let effectData = {
        label : "Frightened",
        icon : "modules/dfreds-convenient-effects/images/frightened.svg",
        origin: args.uuid,
        changes: [
            { "key": "flags.midi-qol.disadvantage.attack.all", "value": `1`, "mode": 0, "priority": 20 },
            { "key": "flags.midi-qol.disadvantage.ability.check.all", "value": `1`, "mode": 0, "priority": 20 }
        ],
        disabled: false,
        flags: {
                dae: {specialDuration: ["turnEndSource"]},
                core: {statusId: "Convenient Effect: Frightened"}
               }
       }
    await MidiQOL.socket().executeAsGM("createEffects", {actorUuid: target.uuid, effects: [effectData]});
}

// Apply the charmed effect to the target
async function applyCharmedEffect(target, args) {
    let effectData = {
        label : "Charmed",
        icon : "modules/dfreds-convenient-effects/images/charmed.svg",
        origin: args.uuid,
        disabled: false,
        flags: {
                dae: {specialDuration: ["turnEndSource"]},
                core: {statusId: "Convenient Effect: Charmed"}
               }
    }   
    await MidiQOL.socket().executeAsGM("createEffects", {actorUuid: target.uuid, effects: [effectData]});
}