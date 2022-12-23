/*****
Shadow Step

NOTE: PARTS OF THIS AUTOMATION WERE TAKEN FROM "MIDI-SRD" SPELL: MISTY STEP
By Author: Kandashi   https://github.com/kandashi/Dynamic-Effects-SRD

v2.0 December 18 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git
*****/

if (args[0].macroPass === "preItemRoll") {
    let pcToken = token;
    let pcActor = token.actor;
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
            let removeTemplates = canvas.templates.placeables.filter(i => i.data.flags.DAESRD?.ShadowStep?.ActorId === pcActor.id);
            let templateArray = removeTemplates.map(function (w) { return w.id });
            await target.document.update(canvas.grid.getSnappedPosition(template.x, template.y));
            if (removeTemplates) await canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", templateArray);
        };
    });
} return;
