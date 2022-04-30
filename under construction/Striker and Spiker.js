// get the live workflow so we can make changes
const workflow = MidiQOL.Workflow.getWorkflow(args[0].itemUuid);
// Process at the end of the workflow
if (args[0].macroPass === "postDamageRoll") {
    // Get the single selected target token
    if (args[0].targetUuids.length === 1) {
        // assign target   
        const target = await fromUuid(args[0].targetUuids[0]);
        let target_actor = target.data.actorData;
        // DEBUG: output to log the single target_actor

        // Test if the target actor has been spiked
        if (target_actor.effects.find(e => e.label === "Spiked")) {
            // Setup workflow and roll other damage
            const damageRoll = await new CONFIG.Dice.DamageRoll("1d12[piercing]", {}, { critical: workflow.isCritical }).roll();
            workflow.otherDamageRoll = damageRoll;
            workflow.otherDamageTotal = damageRoll.total;
            workflow.otherDamageHTML = await damageRoll.render();
            workflow.shouldRollOtherDamage = true;
        } else return;
    } else return;
} else return;