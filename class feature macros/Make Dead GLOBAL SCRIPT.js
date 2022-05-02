let targetUuid = args[0];
const target = (await fromUuid(targetUuid));
await target.actor.update({ "data.attributes.hp.value": 0 });