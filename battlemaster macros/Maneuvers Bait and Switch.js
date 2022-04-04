/*****
Fighter Battlemaster Maneuver: Bait and Switch

USEAGE : ACTIVATE ANYTIME
This is a utility Maneuver and can be used whenever your character can take an action.  
This will setup any bonuses and effects on the TARGET actor.  
A Superiority Die will be expended immediately.

MANEUVER DESCRIPTION:
When you’re within 5 feet of a creature on your turn, you can expend one superiority die and switch places with that creature, 
provided you spend at least 5 feet of movement and the creature is willing and isn’t incapacitated. 
This movement doesn’t provoke opportunity attacks.  Roll the superiority die. Until the start of your next turn, 
you or the other creature (your choice) gains a bonus to AC equal to the number rolled.
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
        await incrementResource (pcActor, "Superiority Dice", 1);
        return;
    }

    // check to make sure target is not incapacitated
    console.log("MACRO TEST | targetActor: %O", targetActor);
    if (!(targetActor.data.data.attributes.hp.value > 0)) {
        ui.notifications.error("Your target must be conscious!");
        await incrementResource (pcActor, "Superiority Dice", 1);
        return;
    }

    let superiorityDie = pcActor.getFlag("dae", "SuperiorityDie");
    if (superiorityDie === null) {
        ui.notifications.error("You are not a fighter battlemaster of at least level 3!");
        await incrementResource (pcActor, "Superiority Dice", 1);
        return;
    }

    // Roll superiority die for AC Bonus result
    const acBonusRoll = await (new Roll(`${superiorityDie}`)).roll();    
  
    //prompt for who gets the AC bonus
    let dialog = new Promise((resolve, reject) => {
        new Dialog({
        // localize this text
        title: "Battle Master: Bait and Switch",
        content: "<p>Who gets the AC bonus for 1 turn You or Target?</p>",
        buttons: {
            one: {
                icon: '<p> </p><img src = "systems/dnd5e/icons/skills/water_09.jpg" width="60" height="60"></>',
                label: "<p>You</p>",
                callback: () => resolve("YOU")
            },
            two: {
                icon: '<p> </p><img src = "systems/dnd5e/icons/skills/shadow_19.jpg" width="60" height="60"></>',
                label: "<p>Target</p>",
                callback: () => {resolve("TARGET")}
            }
        },
        default: "two"
        }).render(true);
        });
    
    let choiceACBonus = await dialog;
                
    if (choiceACBonus === "YOU") {
        // Set Actor Active Effect for AC bonus
        await pcActor.createEmbeddedDocuments("ActiveEffect", [{
            "changes":  [{"key":"data.attributes.ac.bonus","mode":2,"value": `${acBonusRoll.total}`,"priority":"20"}],
            "label": "Bait and Switch AC Bonus",
            "duration": {seconds: 0, rounds: 0, turns: 1},
            "origin": args[0].itemUuid,
            "icon": "systems/dnd5e/icons/skills/gray_10.jpg",
        }]);
    } else {
        // Set Target Active Effect for AC bonus
        await targetActor.createEmbeddedDocuments("ActiveEffect", [{
            "changes":  [{"key":"data.attributes.ac.bonus","mode":2,"value": `${acBonusRoll.total}`,"priority":"20"}],
            "label": "Bait and Switch AC Bonus",
            "duration": {seconds: 0, rounds: 0, turns: 1},
            "origin": args[0].itemUuid,
            "icon": "systems/dnd5e/icons/skills/gray_10.jpg",
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
    travelRay = Ray.fromAngle(pcMoveToken.data.x, pcMoveToken.data.y, angle, travelRay.distance);
    snappedPosition = canvas.grid.getSnappedPosition(travelRay.B.x,travelRay.B.y);
    canvas.grid.diagonalRule = diagonalRule;
    await pcMoveToken.document.update(canvas.grid.getSnappedPosition(travelRay.B.x, travelRay.B.y));

    // Move Target to OLD Actor Location
    travelRay = new Ray(targetCenter, pcCenter); //  create a ray to measure the angle to travel
    angle = travelRay.angle;
    travelRay = Ray.fromAngle(targetMoveToken.data.x, targetMoveToken.data.y, angle, travelRay.distance);
    snappedPosition = canvas.grid.getSnappedPosition(travelRay.B.x,travelRay.B.y);
    canvas.grid.diagonalRule = diagonalRule;
    await targetMoveToken.data.document.update(canvas.grid.getSnappedPosition(travelRay.B.x, travelRay.B.y));

    return;
}

// Increment available resource
async function incrementResource (testActor, resourceName, numValue) {
    let actorDup = duplicate(testActor.data._source);
    let resources = Object.values(actorDup.data.resources);
    let foundResource = resources.find(i => i.label.toLowerCase() === resourceName.toLowerCase());
    if (foundrResource) {
        foundResource.value = foundResource.value + numValue;
        await testActor.update(actorDup); 
    } else ui.notifications.error("You have not setup a Superiority Dice resource.");
    return;
}