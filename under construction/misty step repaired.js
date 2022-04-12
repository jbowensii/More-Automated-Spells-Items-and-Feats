//DAE Macro Execute, Effect Value = "Macro Name" @target 
if (!game.modules.get("advanced-macros")?.active) ui.notifications.error("Please enable the Advanced Macros module")

const lastArg = args[args.length - 1];
let tactor;
if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
else tactor = game.actors.get(lastArg.actorId);
const target = canvas.tokens.get(lastArg.tokenId) || token;


if (args[0] === "on") {
    let range = canvas.scene.createEmbeddedDocuments("MeasuredTemplate", [{
        t: "circle",
        user: game.user._id,
        x: target.x + canvas.grid.size / 2,
        y: target.y + canvas.grid.size / 2,
        direction: 0,
        distance: 30,
        borderColor: "#FF0000",
        flags: {
            DAESRD: {
                MistyStep: {
                    ActorId: tactor.id
                }
            }
        }
        //fillColor: "#FF3366",
    }]);

    range.then(result => {
        let templateData = {
            t: "rect",
            user: game.user._id,
            distance: 7.5,
            direction: 45,
            x: 0,
            y: 0,
            fillColor: game.user.color,
            flags: {
                DAESRD: {
                    MistyStep: {
                        ActorId: tactor.id
                    }
                }
            }
        };

        Hooks.once("createMeasuredTemplate", deleteTemplatesAndMove);
        let doc = new CONFIG.MeasuredTemplate.documentClass(templateData, { parent: canvas.scene })
        let template = new game.dnd5e.canvas.AbilityTemplate(doc);
        template.actorSheet = tactor.sheet;
        template.drawPreview();

        async function deleteTemplatesAndMove(template) {

            let removeTemplates = canvas.templates.placeables.filter(i => i.data.flags.DAESRD?.MistyStep?.ActorId === tactor.id);
            let templateArray = removeTemplates.map(function (w) {
                return w.id
            });
            await target.data.document.update(canvas.grid.getSnappedPosition(template.data.x, template.data.y));
            if (removeTemplates) await canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", templateArray);
            await tactor.deleteEmbeddedDocuments("ActiveEffect", [lastArg.effectId]); 
        };
    });
    
}

