/*****
Feline Agility

Your reflexes and agility allow you to move with a burst of speed. 
When you move on your turn in combat, you can double your speed until the end of the turn. 
Once you use this trait, you can’t use it again until you move 0 feet on one of your turns.
*****/

// watch movement if movement = 0 resent this ability counter
// when activated double movement for 1 turn

console.log("MACRO TEST | ARGS: %O",args[0]);

if (args[0].macroPass === "preDamageRoll") {
    const workflow = MidiQOL.Workflow.getWorkflow(args[0].itemUuid);
    
    console.log("MACRO TEST | WORKFLOW: %O",workflow);

    return; 
}