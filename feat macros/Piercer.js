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
    let baseDie = null;
    let lowestDieRoll = 0;
    let choice = false; 

    // make sure the attempted hit was made with a weapon attack
    if (!["mwak", "rwak"].includes(args[0].item.system.actionType)) return;

    // damage type must be "piercing"    
    if (workflow.defaultDamageType != "piercing") return;

    // breakdown weapon damage to find the base weapon damage die and the lowest die roll
    for (let i = 0; i < workflow.damageRoll.terms.length; i++)
        if (workflow.damageRoll.terms[i]?.faces) {
            baseDie = "1d" + workflow.damageRoll.terms[i].faces;
            lowestDieRoll = workflow.damageRoll.terms[i].results[0].result;
            for (let j = 0; j < workflow.damageRoll.terms[i].results.length; j++)
                if (workflow.damageRoll.terms[i].results[j].result < lowestDieRoll) lowestDieRoll = workflow.damageRoll.terms[i].results[j].result;
        }

    // check if piercer reroll was already used this turn, if true skip dialog prompt 
    if (game.combat) {
        const combatTime = `${game.combat.id}-${game.combat.round + game.combat.turn /100}`;
        const lastTime = actor.getFlag("midi-qol", "Piercer reRoll");
        
        if (combatTime === lastTime) {
            console.log("Piercer reRoll: Already done a Piercer reRoll this turn");
        }
        else {
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
            choice = await dialog;
        }
    }

    await setProperty(workflow, "ReplaceRoll", choice);
    await setProperty(workflow, "LowestRoll", lowestDieRoll);
    await setProperty(workflow, "BaseDie", baseDie);

    if (game.combat) {
        const combatTime = `${game.combat.id}-${game.combat.round + game.combat.turn /100}`;
        const lastTime = actor.getFlag("midi-qol", "Piercer reRoll");
        if (combatTime !== lastTime) {
           await actor.setFlag("midi-qol", "Piercer reRoll", combatTime);
        }
      }
    return;
} 

if (args[0].tag === "DamageBonus") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].itemUuid);
    const actorUuid = workflow.tokenUuid;
    const actorToken = canvas.tokens.get(workflow.tokenId);
    const thisItem = actorToken.actor.items.find(i => i.name === "Piercer");
    const targetToken = await fromUuid(args[0].hitTargetUuids[0] ?? "");
    const targetActor = targetToken.actor;
    let choice = await getProperty(workflow, "ReplaceRoll");
    let lowestDieRoll = await getProperty(workflow, "LowestRoll");
    let baseDie = await getProperty(workflow, "BaseDie");
    
    //let diff = await getProperty(workflow, "Difference");
    let reRoll = null;
    let critRoll = null;

    // test if critical is true, roll extra damage die
    if (workflow?.isCritical) {
        critRoll = await new Roll(baseDie).evaluate({async: true});
    }

    // if reRoll was selected figure out the difference and apply adjustment to the target
    if (choice) {
        reRoll = await new Roll(baseDie).evaluate({async: true});
        let difference = reRoll.result - lowestDieRoll;
        if (difference < 0) {
            // healback difference
            // let difference = lowestDieRoll - reRoll.result;
            //await setProperty(workflow, "Difference", difference);
            if (workflow?.isCritical)
                return { damageRoll: `${difference}[healing] + ${critRoll.total}[piercing]`, flavor: "Piercer Feat: ReRoll was lower + critical bonus" }
            else 
                return { damageRoll: `${difference}[healing]`, flavor: "Piercer Feat: ReRoll was lower" }
        } else if (difference > 0) {
            // damage difference
            // let difference = reRoll.result - lowestDieRoll;
            //await setProperty(workflow, "Difference", difference);
            if (workflow?.isCritical)
                return { damageRoll: `${difference}[piercing] + ${critRoll.total}[piercing]`, flavor: "Piercer Feat: ReRoll was higher + critical bonus" }
            else 
                return { damageRoll: `${difference}[piercing]`, flavor: "Piercer Feat: ReRoll was higher" }
        }
    }  
    else {    // add critical damage if it is a critcal reguardless of reroll
        if (workflow?.isCritical)
            return { damageRoll: `${critRoll.total}[piercing]`, flavor: "Piercer Feat: Critical bonus" }
        else 
            return;   
    }
    return;
}