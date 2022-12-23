/*****
Preserve Life

USE: use this feature AFTER channel divinity: Preserve Life is triggered to create a healing pool

NOTE: PARTS OF THIS AUTOMATION WERE TAKEN FROM "MidiQOL Sample Items" SPELL: LAY ON HANDS
By Author: Tim Poseney   https://gitlab.com/tposney/midi-qol

v2.0 December 18 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

if (args[0].macroPass === "preItemRoll") {
    // get healthpool if not available send a notification
    let lifehealingpool = actor.getFlag("dae", "lifehealingpool");
    if ((!lifehealingpool) || (!lifehealingpool > 0)) {
        ui.notifications.warn("You either have no healing pool left or you have not used Channel Divinity: Preserve Life...");
        return false;
    }

    // check to make sure there is a target to heal and only one is selected
    let theTarget = args[0].targets[0];
    if ((!theTarget) || (args[0].targets.length > 1)) {
        ui.notifications.warn("Please select a target to heal with Preserve Life");
        return false;
    }

    // does not work on undead/constructs - not sure if this is RAW but makes sense given Preserve Life 
    let invalid = ["undead", "construct"].some(type => (theTarget?.actor.system.details.type?.value || "").toLowerCase().includes(type));
    if (invalid) {
        ui.notifications.warn("Preserve Life can't affect undead/constructs")
        return false;
    }

    let targetToken = await fromUuid(args[0].targetUuids[0]);
    let targetActor = targetToken.actor;
    //Target can only be healed up to half their HP
    let targetDamage = ((targetActor.system.attributes.hp.max / 2) - targetActor.system.attributes.hp.value);

    if (targetDamage <= 0) {
        ui.notifications.warn("Target is at or above half health");
        return false;
    }

    // prompt for how much to use...
    let d = new Promise((resolve, reject) => {
        let theDialog = new Dialog({
            title: "Preserve Life",
            content: `<p>Your targets current damage level: ${targetDamage}</p>
                    <p>How many points to use? ${lifehealingpool} left in your Healing Pool<input id="mqlohpoints" type="number" min="0" step="1.0" max="${lifehealingpool}"></input></p>`,
            buttons: {
                heal: {
                    icon: '<p></p><img src = "icons/magic/light/orb-beams-green.webp" width="60" height="60"></>',
                    label: "<p>HEAL</p>",
                    callback: (html) => { resolve(Math.clamped(Math.floor(Number(html.find('#mqlohpoints')[0].value) / 2), 0, lifehealingpool)); }
                },
                abort: {
                    icon: '<p></p><img src = "icons/svg/cancel.svg" width="60" height="60"></>',
                    label: "<p>CANCEL</p>",
                    callback: () => { resolve(false) }
                },
            },
            default: "abort",
        }).render(true);
    });
    let consumed = await d;
    if (!consumed) return false;
    if (consumed > targetDamage) consumed = targetDamage;

    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = workflow.item;
    let updates;
    if (consumed > 0) {
        updates = {
            "data.consume.amount": Math.abs(consumed),
            "data.damage.parts": [[`${Math.max(0, consumed)}`, "healing"]],
            "data.chatFlavor": "Preserve Life"
        };
    }

    // remove consumed from pool
    lifehealingpool = lifehealingpool - consumed;
    actor.setFlag("dae", "lifehealingpool", lifehealingpool);

    return theItem.update(updates);
}
return true;