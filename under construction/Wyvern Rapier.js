// get the live workflow so we can make changes
const workflow = MidiQOL.Workflow.getWorkflow(args[0].itemUuid);
if (args[0].macroPass === "preItemRoll") {
    // record the number of charges before the roll
    setProperty(workflow, "wyvernBlade.preRollCharges", args[0].itemData.data.uses.value)
} else if (args[0].macroPass === "preambleComplete") {
    // if the number of charges is not the same we must have used a charge
    const chargeUsed = getProperty(workflow, "wyvernBlade.preRollCharges") !== args[0].itemData.data.uses.value;
    setProperty(workflow, "wyvernBlade.chargeUsed", chargeUsed)
    if (chargeUsed && args[0].targetUuids.length === 1) { // move towards target
        const target = await fromUuid(args[0].targetUuids[0]);
        const diagonalRule = canvas.grid.diagonRule;
        try {
            const distanceTravelled = MidiQOL.getDistance(token, target);
            if (distanceTravelled >= 30) workflow.advantage = true;
            // set advantage if moved more that 30 feet
            canvas.grid.diagonalRule = "EUCL";
            // now the tricky bit - move the token.
            // get the angle of the move by drawing a line between the centers of the selected token and the target
            let travelRay = new Ray(token.center, target.object.center); //  create a ray to measure the angle to travel
            const angle = travelRay.angle;
            // create a new ray with the same angle but shorter to allow for the token sizes
            travelRay = Ray.fromAngle(token.x, token.y, angle,
                Math.floor(travelRay.distance - Math.sqrt(target.object.height ** 2 + target.object.width ** 2) / 2));
            const snappedPosition = canvas.grid.getSnappedPosition(travelRay.B.x, travelRay.B.y);
            canvas.grid.diagonalRule = diagonalRule;
            // move the token next to the target
            await token.document.update(canvas.grid.getSnappedPosition(travelRay.B.x, travelRay.B.y));

        } finally {
            canvas.grid.diagonalRule = diagonalRule;
        }
    }
} else if (args[0].macroPass === "postDamageRoll") {
    if (getProperty(workflow, "wyvernBlade.chargeUsed")) {
        const damageRoll = await new CONFIG.Dice.DamageRoll("4d6[poison]", {}, { critical: workflow.isCritical }).roll();
        workflow.otherDamageRoll = damageRoll;
        workflow.otherDamageTotal = damageRoll.total;
        workflow.otherDamageHTML = await damageRoll.render();
        workflow.shouldRollOtherDamage = true;
        setProperty(workflow, "wyvernBlade.chargeUsed", false)
    }
}