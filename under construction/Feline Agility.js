/*****
Feline Agility

*****/

// watch movement if movement = 0 resent this ability counter
// when activated double movement for 1 turn

console.log("MACRO TEST | ARGS: %O", args[0]);

if (args[0].macroPass === "preDamageRoll") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].itemUuid);

    console.log("MACRO TEST | WORKFLOW: %O", workflow);

    return;
}