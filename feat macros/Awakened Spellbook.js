/*****
Awakened Spellbook 
Using specially prepared inks and ancient incantations passed down by your wizardly order, 
you have awakened an arcane sentience within your spellbook.

While you are holding the book, it grants you the following benefits:
- When you cast a wizard spell with a spell slot, you can temporarily replace its damage type 
with a type that appears in another spell in your spellbook, which magically alters the spell’s 
formula for this casting only. The latter spell must be of the same level as the spell slot you expend.

v0.4 April 10 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

// make sure the attempted hit was made with a spell attack of some type
if (!["msak","rsak","save"].includes(args[0].item.data.actionType)) return;       

console.log("MACRO TEST | MACROPASS %s",args[0].macroPass);

if (args[0].macroPass === "templatePlaced") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    console.log("MACRO TEST | TEMPLATE workflow %O",workflow);

} else if (args[0].macroPass === "preItemRoll") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    const pcActor = token.actor.data.data;
    const targets = args[0].targets;
    console.log("MACRO TEST | PRE ITEM workflow %O",workflow);
    // setup buttons with all elemental types known on the character sheet 
    let buttonData = {};
    if (getProperty(pcActor, "flags.dae.EAAcid")) 
        buttonData.acid = {
                icon: '<p> </p><img src = "systems/dnd5e/icons/skills/affliction_20.jpg" width="60" height="60"></>',
                label: "<p>Acid</p>",
                callback: () => choice = "acid"
            };        
    if (getProperty(pcActor, "flags.dae.EACold")) 
        buttonData.cold = {
                icon: '<p> </p><img src = "systems/dnd5e/icons/skills/ice_09.jpg" width="60" height="60"></>',
                label: "<p>Cold</p>",
                callback: () => choice = "cold"
            };
    if (getProperty(pcActor, "flags.dae.EAFire")) 
        buttonData.fire = {
                icon: '<p> </p><img src = "systems/dnd5e/icons/skills/fire_10.jpg" width="60" height="60"></>',
                label: "<p>Fire</p>",
                callback: () => choice = "fire"
            };
    if (getProperty(pcActor, "flags.dae.EALightning")) 
            buttonData.lightning = {
                    icon: '<p> </p><img src = "systems/dnd5e/icons/skills/blue_21.jpg" width="60" height="60"></>',
                    label: "<p>Lightning</p>",
                    callback: () => choice = "lightning"
                };
    if (getProperty(pcActor, "flags.dae.EAThunder")) 
            buttonData.thunder = {
                    icon: '<p> </p><img src = "systems/dnd5e/icons/skills/shadow_06.jpg" width="60" height="60"></>',
                    label: "<p>Thunder</p>",
                    callback: () => choice = "thunder"
                };
    buttonData.none = {
        icon: '<p> </p><img src = "icons/svg/cancel.svg" width="60" height="60"></>',
        label: "<p>No</p>",
        callback: () => choice = "none"
    }
    if (!buttonData.length > 1) {   // No Elemental Adept Feats present 
        ui.notifications.error("No Elemental Adepts Feats Present on the Character Sheet...");
        return;  
    }

    // display dialog to substitute damage
    let choice = "";
    async function dialogAsync(){
        return await new Promise(async (resolve) => {
            new Dialog({
                title : "Elemental Adept" , 
                content: "<p>Would you like to change the spell damage type?</p>",
                buttons: buttonData,
                close : async() => {
                    resolve(choice);
                }
            }).render(true);
        });
    }

    let newDamageType = await dialogAsync()
    if ((!newDamageType) || (newDamageType == "none")) return;   // no substitution selected

    // mark all targets that are resistant to this damage type now vulnerable    
    for (let i = 0; i < targets.length; i++) {
        //let targetToken = targets[i].data;
        let targetActor = targets[i].actor;
        //let drList = targetActor.data.data.traits.dr.value;
        
        const match = targetActor.data.data.traits.dr.value.find(element => {
            if (element.includes(newDamageType)) {
                 markTargetVulnerable(targetActor, newDamageType, args[0]); 
            }    
        });
    }

    // remember original damage and damage type so we can put them back later
    console.log("MACRO TEST | THE ITEM: %O",theItem);
    await adjustDamage (workflow, theItem.data.data, newDamageType);
    //if (theItem.data.actionType === "save") await adjustDamage (workflow, theItem.data, newDamageType);
    //    else await adjustDamage (workflow, theItem.data.data, newDamageType);

} else if (args[0].macroPass === "postActiveEffects") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    const targets = args[0].targets;

    // remove any vulnerability previously set on target(s)
    for (let i = 0; i < targets.length; i++) {
        let targetActor = targets[i].actor;
        let effect = await findEffect(targets[i], "EAVulnerability");
        if (effect) await MidiQOL.socket().executeAsGM("removeEffects", {actorUuid: targetActor.uuid, effects:[effect.id]});
    }

    // restore original spell damage type to the primary spell damage and scaling
    theItem.data.data.damage.parts[0][0] = getProperty(workflow, "originalDamage");
    theItem.data.data.damage.parts[0][1] = getProperty(workflow, "originalDamageType");
    theItem.data.data.scaling.formula    = getProperty(workflow, "originalScalingDamage");
}
return; 

// if the character has resistance to the new damage type, set vulnerability to negate it
async function markTargetVulnerable(target, damageType, args) {
    const effectData = {
        label : "EAVulnerability",
        icon : "icons/magic/defensive/barrier-shield-dome-deflect-blue.webp",
        origin: args.uuid,
        changes: [{
          "key": "data.traits.dv.value",        
          "value": `${damageType}`,
          "mode": 2,
          "priority": 20
          }],
         disabled: false
       }
    await MidiQOL.socket().executeAsGM("createEffects", {actorUuid: target.uuid, effects: [effectData]});
}

// Function to test for an effect
async function findEffect (target, effectName) {
    let effectUuid = null;
    effectUuid = target?.actor.data.effects.find(ef=> ef.data.label === effectName);
    return effectUuid;
}

// I have no idea why the makeup of ITEM in the workflow is structurally different for SAVE AOE spells as opposed to others
// so I created this... 
async function adjustDamage (workflow, itemData, newDamageType) {
    // remember original damage and damage type so we can put them back later
    console.log("MACRO TEST | ITEM DATA: %O",itemData);
    setProperty(workflow, "originalDamage", itemData.damage.parts[0][0]);
    setProperty(workflow, "originalDamageType", itemData.damage.parts[0][1]);
    setProperty(workflow, "originalScalingDamage", itemData.scaling.formula);
    setProperty(workflow, "newDamageType", newDamageType);

    // strip damage type from the originalDamage if it exists and add "min2" and the new damage type
    let justDice =  itemData.damage.parts[0][0];
    let index = justDice.indexOf('[');
    if (index !== -1) justDice = justDice.slice(0, index);
    let newDamage = justDice+"min2"+"["+newDamageType+"]";

    // set the item with the new values, remember top add min2 to scaling as well
    itemData.damage.parts[0][0] = newDamage;
    itemData.damage.parts[0][1] = newDamageType;
    itemData.scaling.formula    = itemData.scaling.formula+"min2";
}