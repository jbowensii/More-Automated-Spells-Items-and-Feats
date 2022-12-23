/*****
Piercer

USAGE: Automatic just place on a character 

v2.0 December 18 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

if (args[0].macroPass === "postDamageRoll") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].itemUuid);
    const actorUuid = workflow.tokenUuid;
    const actorToken = canvas.tokens.get(workflow.tokenId);
    const thisItem = actorToken.actor.items.find(i => i.name === "Piercer");

    // make sure the attempted hit was made with a weapon attack
    if (!["mwak", "rwak"].includes(args[0].item.system.actionType)) return;

    // damage type must be "piercing"    
    if (workflow.defaultDamageType != "piercing") return;

    // breakdown weapon damage to find the base die, if there was a critical, and the lowest die roll
    let baseDie = null;
    let lowestDieRoll = 0;
    for (let i = 0; i < workflow.damageRoll.terms.length; i++)
        if (workflow.damageRoll.terms[i]?.faces) {
            baseDie = "1d" + workflow.damageRoll.terms[i].faces;
            lowestDieRoll = workflow.damageRoll.terms[i].results[0].result;
            for (let j = 0; j < workflow.damageRoll.terms[i].results.length; j++)
                if (workflow.damageRoll.terms[i].results[j].result < lowestDieRoll) lowestDieRoll = workflow.damageRoll.terms[i].results[j].result;
        }

    // create a dialog and prompt to re-roll lowest die
    let dialog = new Promise((resolve) => {
        new Dialog({
            // localize this text
            title: "Piercer Feat:",
            content: `<p>would you like to re-roll your lowest damage die?</p><p>Lowest Die Roll: ${lowestDieRoll}</p>`,
            buttons: {
                one: {
                    icon: '<p> </p><img src = "icons/skills/ranged/arrow-flying-broadhead-metal.webp" width="60" height="60"></>',
                    label: "<p>Yes</p>",
                    callback: () => resolve(true)
                },
                two: {
                    icon: '<p> </p><img src = "icons/svg/cancel.svg" width="60" height="60"></>',
                    label: "<p>No</p>",
                    callback: () => { resolve(false) }
                }
            },
            default: "two"
        }).render(true);
    });
    let choice = await dialog;

    if (choice) await setProperty(workflow, "ReplaceRoll", choice);
    await setProperty(workflow, "LowestRoll", lowestDieRoll);
    await setProperty(workflow, "BaseDie", baseDie);

    // trigger BonusDamage to apply the extra damage / adjustments outside of the normal damage roll
    let effectData = {
        label: "Piercer reRoll",
        changes: [{ key: "flags.dnd5e.DamageBonusMacro", mode: 0, value: `ItemMacro.Piercer`, priority: 20 }],
        icon: thisItem.img,
        origin: thisItem.uuid,
        duration: { turns: 1 }
    };
    await MidiQOL.socket().executeAsGM("createEffects", { actorUuid: actorUuid, effects: [effectData] });
    return;

} else if (args[0].tag === "DamageBonus") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].itemUuid);
    const actorUuid = workflow.tokenUuid;
    const actorToken = canvas.tokens.get(workflow.tokenId);
    const thisItem = actorToken.actor.items.find(i => i.name === "Piercer");
    const targetToken = await fromUuid(args[0].hitTargetUuids[0] ?? "");
    const targetActor = targetToken.actor;
    let choice = await getProperty(workflow, "ReplaceRoll");
    let lowestDieRoll = await getProperty(workflow, "LowestRoll");
    let baseDie = await getProperty(workflow, "BaseDie");
    let reRoll = null;

    // remove extra damage effect 
    let effect = await findEffect(actorToken.actor, "Piercer reRoll");
    // await MidiQOL.socket().executeAsGM("removeEffects", { actorUuid: actorUuid, effects: [effect.id] });

    // test if critical is true, apply extra damage die
    if (workflow?.isCritical) {
        reRoll = await new Roll(baseDie).evaluate({async: true});
        new MidiQOL.DamageOnlyWorkflow(targetActor, targetToken, reRoll.total, "piercing", [targetToken], reRoll, { flavor: "Piercer Feat: Critical Extra Damage", itemData: thisItem, itemCardId: "new" });
    }

    // if reRoll was selected figure out the difference and apply adjustment to the target
    if (choice) {
        reRoll = await new Roll(baseDie).evaluate({async: true});
        if (reRoll.result < lowestDieRoll) {
            // healback difference
            let difference = lowestDieRoll - reRoll.result;
            return { damageRoll: `${difference}[healing]`, flavor: "Piercer Feat: ReRoll Adjustment" }
        } else {
            // damage difference
            let difference = reRoll.result - lowestDieRoll;
            return { damageRoll: `${difference}[piercing]`, flavor: "Piercer Feat: ReRoll Adjustment" }
        }
    }
    return;
}

//---------------------------------- MY FUNCTIONS -------------------------------------

// Function to test for an effect
async function findEffect(target, effectName) {
    let effectUuid = null;
    effectUuid = target?.effects.find(ef => ef.label === effectName);
    return effectUuid;
}