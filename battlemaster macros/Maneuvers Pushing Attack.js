/*****
Fighter Battlemaster Maneuvers: Pushing Attack

USEAGE : ACTIVATE AFTER ATTACK
This Maneuver must be activated AFTER the character makes an attack and knows that a 
HIT was successful.  This will activate any bonuses, saves, effects and extra damage 
to the TARGET.  A Superiority Die will be expended immediately.

v2.0 December 18 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

if (args[0].macroPass === "postSave") {

    // check to make sure only one target is selected
    if ((args[0].targetUuids.length < 1) || (args[0].targetUuids.length > 1)) {
        ui.notifications.error("You need to select a single target.");
        await incrementResource(pcActor, "Superiority Dice", 1);
        return;
    }

    // setup common variables
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const target = await fromUuid(args[0].targetUuids[0]);
    const diagonalRule = canvas.grid.diagonRule;

    // If save failed
    if (workflow.failedSaves.size >= 1) {
        //prompt for push distance
        let dialog = new Promise((resolve, reject) => {
            new Dialog({
                // localize this text
                title: "Battle Master: Pushing Attack",
                content: "<p>How far would you like to push the target?</p>",
                buttons: {
                    one: {
                        icon: '<p> </p><img src = "icons/magic/water/pseudopod-swirl-blue.webp" width="60" height="60"></>',
                        label: "<p>5 ft.</p>",
                        callback: () => resolve(1)
                    },
                    two: {
                        icon: '<p> </p><img src = "icons/magic/air/wind-vortex-swirl-purple.webp" width="60" height="60"></>',
                        label: "<p>10 ft.</p>",
                        callback: () => { resolve(2) }
                    },
                    three: {
                        icon: '<p> </p><img src = "icons/magic/fire/orb-vortex.webp" width="60" height="60"></>',
                        label: "<p>15 ft.</p>",
                        callback: () => { resolve(3) }
                    }
                },
                default: "three"
            }).render(true);
        });

        const distanceTravelled = await dialog;

        //  create a ray to measure the angle to travel
        canvas.grid.diagonalRule = "EUCL";
        let travelRay = new Ray(token.center, target.object.center);
        const angle = travelRay.angle;
        travelRay.distance = travelRay.dx * distanceTravelled;

        // create a new ray with the same angle but shorter to allow for the token sizes
        travelRay = Ray.fromAngle(token.x, token.y, angle,
            Math.floor(travelRay.distance + Math.sqrt(target.object.height ** 2 + target.object.width ** 2) / 2));
        canvas.grid.diagonalRule = diagonalRule;

        // update the canvas to move the token
        //await target.document.update(canvas.grid.getSnappedPosition(travelRay.B.x, travelRay.B.y));
        await target.update(canvas.grid.getSnappedPosition(travelRay.B.x, travelRay.B.y));
    }
}
return;

//---------------------------------- MY FUNCTIONS -------------------------------------------

// Increment available resource
async function incrementResource(testActor, resourceName, numValue) {
    const resourceKey = Object.keys(testActor.system.resources).find(k => testActor.system.resources[k].label.toLowerCase() === resourceName.toLowerCase());
    let newResources = duplicate(testActor.system.resources);
    newResources[resourceKey].value += 1;
    await actor.update({"system.resources": newResources});
    return;
}