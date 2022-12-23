/*****
Fighter Battlemaster Maneuver: Bait and Switch

USEAGE : ACTIVATE ANYTIME
This is a utility Maneuver and can be used whenever your character can take an action.  
This will setup any bonuses and effects on the TARGET actor.  
A Superiority Die will be expended immediately.

v2.0 December 17 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

// Activate on preActiveEffects
if (args[0].macroPass === "preActiveEffects") {

    // define Actor, Target and Workflow
    const pcActor = MidiQOL.MQfromActorUuid(args[0].actorUuid);
    const targetActor = args[0].targets[0].actor;
    let pcToken = token;
    let targetToken = await fromUuid(args[0].hitTargetUuids[0]);
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    
    // check to make sure only one target is selected
    if ((args[0].targetUuids.length < 1) || (args[0].targetUuids.length > 1)) {
        ui.notifications.error("You need to select a single target.");
        await incrementResource(pcActor, "Superiority Dice", 1);
        return;
    }

    // check to make sure target is not incapacitated
    if (!(targetActor.system.attributes.hp.value > 0)) {
        ui.notifications.error("Your target must be conscious!");
        await incrementResource(pcActor, "Superiority Dice", 1);
        return;
    }

    let superiorityDie = pcActor.getFlag("dae", "SuperiorityDie");
    if (superiorityDie === null) {
        ui.notifications.error("You are not a fighter battlemaster of at least level 3!");
        await incrementResource(pcActor, "Superiority Dice", 1);
        return;
    }

    // Roll superiority die for AC Bonus result
    //const surge = await new Roll("1d20").evaluate({async: true});
    const acBonusRoll = await(new Roll(`${superiorityDie}`)).evaluate({async: true});

    //prompt for who gets the AC bonus
    let dialog = new Promise((resolve, reject) => {
        new Dialog({
            // localize this text
            title: "Battle Master: Bait and Switch",
            content: "<p>Who gets the AC bonus for 1 turn You or Target?</p>",
            buttons: {
                one: {
                    icon: '<p> </p><img src = "icons/skills/social/thumbsup-approval-like.webp" width="60" height="60"></>',
                    label: "<p>You</p>",
                    callback: () => resolve("YOU")
                },
                two: {
                    icon: '<p> </p><img src = "icons/skills/social/diplomacy-handshake.webp" width="60" height="60"></>',
                    label: "<p>Target</p>",
                    callback: () => { resolve("TARGET") }
                }
            },
            default: "two"
        }).render(true);
    });

    let choiceACBonus = await dialog;

    if (choiceACBonus === "YOU") {
        // Set Actor Active Effect for AC bonus
        await pcActor.createEmbeddedDocuments("ActiveEffect", [{
            "changes": [{ "key": "data.attributes.ac.bonus", "mode": 2, "value": `${acBonusRoll.total}`, "priority": "20" }],
            "label": "Bait and Switch AC Bonus",
            "duration": { seconds: 0, rounds: 0, turns: 1 },
            "origin": args[0].itemUuid,
            "icon": "icons/magic/defensive/shield-barrier-blue.webp",
        }]);
    } else {
        // Set Target Active Effect for AC bonus
        await targetActor.createEmbeddedDocuments("ActiveEffect", [{
            "changes": [{ "key": "data.attributes.ac.bonus", "mode": 2, "value": `${acBonusRoll.total}`, "priority": "20" }],
            "label": "Bait and Switch AC Bonus",
            "duration": { seconds: 0, rounds: 0, turns: 1 },
            "origin": args[0].itemUuid,
            "icon": "icons/magic/defensive/shield-barrier-blue.webp",
        }]);
    }

    // Swap the token positions positions on the canvas
    await SwapTokens(pcToken, targetToken, canvas);
}
return;

//---------------------------------- MY FUNCTIONS -------------------------------------------

async function SwapTokens(pcMoveToken, targetMoveToken, thisCanvas) {
    let targetCenter = targetMoveToken.object.center;
    let pcCenter = pcMoveToken.center;
    let snappedPosition = null;

    thisCanvas.grid.diagonalRule = "EUCL";
    const diagonalRule = canvas.grid.diagonRule;

    // Move Actor to OLD Target Location
    let travelRay = new Ray(pcCenter, targetCenter); //  create a ray to measure the angle to travel
    let angle = travelRay.angle;
    travelRay = Ray.fromAngle(pcMoveToken.x, pcMoveToken.y, angle, travelRay.distance);
    snappedPosition = canvas.grid.getSnappedPosition(travelRay.B.x, travelRay.B.y);
    canvas.grid.diagonalRule = diagonalRule;
    await pcMoveToken.document.update(canvas.grid.getSnappedPosition(travelRay.B.x, travelRay.B.y));

    // Move Target to OLD Actor Location
    travelRay = new Ray(targetCenter, pcCenter); //  create a ray to measure the angle to travel
    angle = travelRay.angle;
    travelRay = Ray.fromAngle(targetMoveToken.x, targetMoveToken.y, angle, travelRay.distance);
    snappedPosition = canvas.grid.getSnappedPosition(travelRay.B.x, travelRay.B.y);
    canvas.grid.diagonalRule = diagonalRule;
    await targetMoveToken.update(canvas.grid.getSnappedPosition(travelRay.B.x, travelRay.B.y));

    return;
}

//---------------------------------- MY FUNCTIONS -------------------------------------------

// Increment available resource
async function incrementResource(testActor, resourceName, numValue) {
    const resourceKey = Object.keys(testActor.system.resources).find(k => testActor.system.resources[k].label.toLowerCase() === resourceName.toLowerCase());
    let newResources = duplicate(testActor.system.resources);
    newResources[resourceKey].value += 1;
    await actor.update({"system.resources": newResources});
    return;
}