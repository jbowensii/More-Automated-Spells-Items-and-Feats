/*****
Shadow Step
At 6th level, you gain the ability to step from one shadow into another. 
When you are in dim light or darkness, as a bonus action you can teleport 
up to 60 feet to an unoccupied space you can see that is also in dim light 
or darkness. You then have advantage on the first melee attack you make 
before the end of the turn.

NOTE: PARTS OF THIS AUTOMATION WERE TAKEN FROM "MIDI-SRD" SPELL: MISTY STEP
By Author: Kandashi   https://github.com/kandashi/Dynamic-Effects-SRD

v0.2 April 12 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git
*****/

if (args[0].macroPass === "preItemRoll") {
    let pcToken = token;
    let pcActor = token.actor.data.data;
    const target = canvas.tokens.get(pcToken.tokenId) || token;

    let range = canvas.scene.createEmbeddedDocuments("MeasuredTemplate", [{
        t: "circle",
        user: game.user.id,
        x: target.x + canvas.grid.size / 2,
        y: target.y + canvas.grid.size / 2,
        direction: 0,
        distance: 60,
        borderColor: "#FF0000",
        flags: { DAESRD: { ShadowStep: { ActorId: pcActor.id } } }
    }]);

    range.then(result => {
        let templateData = {
            t: "rect",
            user: game.user.id,
            distance: 7.5,
            direction: 45,
            x: 0,
            y: 0,
            fillColor: game.user.color,
            flags: { DAESRD: { ShadowStep: { ActorId: pcActor.id } } }
        };

        Hooks.once("createMeasuredTemplate", deleteTemplatesAndMove);
        let doc = new CONFIG.MeasuredTemplate.documentClass(templateData, { parent: canvas.scene });
        let template = new game.dnd5e.canvas.AbilityTemplate(doc);
        template.actorSheet = pcActor.sheet;
        template.drawPreview();

        async function deleteTemplatesAndMove(template) {
            let removeTemplates = canvas.templates.placeables.filter(i => i.data.flags.DAESRD?.MistyEscape?.ActorId === pcActor.id);
            let templateArray = removeTemplates.map(function (w) { return w.id });
            await target.data.document.update(canvas.grid.getSnappedPosition(template.data.x, template.data.y));
            if (removeTemplates) await canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", templateArray);
        };
    });
} return;
