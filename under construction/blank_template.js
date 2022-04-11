/*****
TITLE

DESCRIPTION

v0.7 April 10 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

// make sure the attempted hit was made with a spell attack of some type
//if (!["msak","rsak","save"].includes(args[0].item.data.actionType)) return;       

console.log("MACRO TEST | MACROPASS %s",args[0].macroPass);

if (args[0].macroPass === "preItemRoll") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.data.data;
    console.log("MACRO TEST | TEMPLATE ITEM DATA: %O",itemData);
    // console.log("MACRO TEST | TEMPLATE workflow %O",workflow);

} else if (args[0].macroPass === "templatePlaced") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.data.data;
    console.log("MACRO TEST | TEMPLATE ITEM DATA: %O",itemData);
    // console.log("MACRO TEST | TEMPLATE workflow %O",workflow);
 
} else if (args[0].macroPass === "preambleComplete") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.data.data;
    console.log("MACRO TEST | TEMPLATE ITEM DATA: %O",itemData);
    //console.log("MACRO TEST | TEMPLATE workflow %O",workflow);

} else if (args[0].macroPass === "preAttackRoll") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.data.data;
    console.log("MACRO TEST | TEMPLATE ITEM DATA: %O",itemData);
    //console.log("MACRO TEST | TEMPLATE workflow %O",workflow);

} else if (args[0].macroPass === "preCheckHits") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.data.data;
    console.log("MACRO TEST | TEMPLATE ITEM DATA: %O",itemData);
    //console.log("MACRO TEST | TEMPLATE workflow %O",workflow);

} else if (args[0].macroPass === "postAttackRoll") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.data.data;
    console.log("MACRO TEST | TEMPLATE ITEM DATA: %O",itemData);
    //console.log("MACRO TEST | TEMPLATE workflow %O",workflow);

} else if (args[0].macroPass === "preDamageRoll") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.data.data;
    console.log("MACRO TEST | TEMPLATE ITEM DATA: %O",itemData);
    //console.log("MACRO TEST | TEMPLATE workflow %O",workflow);

} else if (args[0].macroPass === "postDamageRoll") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.data.data;
    console.log("MACRO TEST | TEMPLATE ITEM DATA: %O",itemData);
    //console.log("MACRO TEST | TEMPLATE workflow %O",workflow);

} else if (args[0].macroPass === "preSave") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.data.data;
    console.log("MACRO TEST | TEMPLATE ITEM DATA: %O",itemData);
    //console.log("MACRO TEST | TEMPLATE workflow %O",workflow);

} else if (args[0].macroPass === "postSave") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.data.data;
    console.log("MACRO TEST | TEMPLATE ITEM DATA: %O",itemData);
    //console.log("MACRO TEST | TEMPLATE workflow %O",workflow);

} else if (args[0].macroPass === "preDamageApplication") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.data.data;
    console.log("MACRO TEST | TEMPLATE ITEM DATA: %O",itemData);
    //console.log("MACRO TEST | TEMPLATE workflow %O",workflow);

} else if (args[0].macroPass === "preActiveEffects") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.data.data;
    console.log("MACRO TEST | TEMPLATE ITEM DATA: %O",itemData);
    //console.log("MACRO TEST | TEMPLATE workflow %O",workflow);

} else if (args[0].macroPass === "postActiveEffects") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = MidiQOL.Workflow.getWorkflow(args[0].uuid).item;
    let itemData = theItem.data.data;
    console.log("MACRO TEST | TEMPLATE ITEM DATA: %O",itemData);
    // console.log("MACRO TEST | TEMPLATE workflow %O",workflow);

} return; 

