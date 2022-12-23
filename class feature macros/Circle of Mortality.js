/*****
Circle of Mortality

v2.0 December 18 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

if (args[0].macroPass === "postDamageRoll") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].itemUuid);
    let targetTokenUuid = args[0].hitTargetUuids[0];
    let targetToken = await fromUuid(targetTokenUuid);
    let targetActor = targetToken.actor;

    // if Target HP > 0 return 
    if (targetActor.system.attributes.hp.value != 0) return;

    // check to make sure only one target is selected
    if ((args[0].targetUuids.length < 1) || (args[0].targetUuids.length > 1)) {
        ui.notifications.error("You need to select a single target.");
        return;
    }

    // compute maximum healing for the spell cast
    let healingRollMax = 0;
    for (let i = 0; i < workflow.damageRoll.terms.length; i++)
        if (workflow.damageRoll.terms[i]?.faces) healingRollMax = healingRollMax + (workflow.damageRoll.terms[i].faces * workflow.damageRoll.terms[i].number);
        else if (workflow.damageRoll.terms[i]?.number) healingRollMax = healingRollMax + workflow.damageRoll.terms[i].number;
    let bonusHealing = (healingRollMax - workflow.damageRoll.total);
    await setProperty(workflow, "BonusHealing", bonusHealing);

    return;

} else if (args[0].tag === "DamageBonus") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].itemUuid);
    const actorUuid = workflow.tokenUuid;
    const actorToken = canvas.tokens.get(workflow.tokenId);
    let bonusHealing = await getProperty(workflow, "BonusHealing");

    // Bonus Healing
    if (bonusHealing > 0) {
        await setProperty(workflow, "BonusHealing", 0);
        return { damageRoll: `${bonusHealing}[healing]`, flavor: "Circle of Mortality Bonus Healing" };
    } else return;
}