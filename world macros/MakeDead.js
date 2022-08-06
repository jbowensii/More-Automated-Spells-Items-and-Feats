let targetUuid = args[0];
console.log("MACRO TEST | MAKE DEAD");
const target = (await fromUuid(targetUuid));
console.log("MACRO TEST | target: %O", target);
await target.actor.update({ "data.attributes.hp.value": 0 });