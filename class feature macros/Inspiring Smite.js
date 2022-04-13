/*****
Inspiring Smite
Immediately after you deal damage to a creature with your Divine Smite feature, you can use your Channel Divinity
as a bonus action and distribute temporary hit points to creatures of your choice within 30 feet of you, which 
can include you. The total number of temporary hit points equals 2d8 + your level in this class, divided among 
the chosen creatures however you like.

USE: Must Manually triggered after channel divinity: Inspiring Smite to distribute healing pool
Check to make sure Channel Divinity: Inspiring Smite created a healing pool > 0
Check to make sure one target is targeted
    - display dialog how much of the pool is left
    - display dialog how much the target actor needs healing
    - allow them to type in the amount (default max to heal target)
    - [heal] [cancel]
    - Apply healing if requested to the target

NOTE: PARTS OF THIS AUTOMATION WERE TAKEN FROM "MidiQOL Sample Items" SPELL: LAY ON HANDS
By Author: Tim Poseney   https://gitlab.com/tposney/midi-qol

v0.1 April 13 2022 jbowens #0415 (Discord) https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats.git 
*****/

if (args[0].macroPass === "preItemRoll") {
    // get healthpool if not available send a notification
    let healingPool = actor.getFlag("dae","healingpool");
    if ((!healingPool) || (!healingPool > 0)) {
        ui.notifications.warn("You either have no healing pool left or you have not used Channel Divinity: Inspiring Smite...");
        return false;
    }
    
    // check to make sure there is a target to heal and only one is selected
    let theTarget = args[0].targets[0];
    if ((!theTarget) || (args[0].targets.length > 1)) {
        ui.notifications.warn("Please select a target to heal with Inspiring Smite");
        return false;
    }
  
    // does not work on undead/constructs - not sure if this is RAW but makes sense given Inspiring Smite 
    let invalid = ["undead", "construct"].some(type => (theTarget?.actor.data.data.details.type?.value || "").toLowerCase().includes(type));
    if (invalid) {
        ui.notifications.warn("Inspiring Smite can't affect undead/constructs")
        return false;
    }

    let targetToken = await fromUuid(args[0].targetUuids[0]);
    let targetActor = targetToken.actor;
    let targetDamage = targetActor.data.data.attributes.hp.max - targetActor.data.data.attributes.hp.value;

    // prompt for how much to use...
    let d = new Promise((resolve, reject) => {
      let theDialog = new Dialog({
        title: "Inspiring Smite",
        content: `<p>Your targets current damage level: ${targetDamage}</p>
                  <p>How many points to use? ${healingPool} left in your Healing Pool<input id="mqlohpoints" type="number" min="0" step="1.0" max="${healingPool}"></input></p>`,
        buttons: {
          heal: {
            icon: '<p></p><img src = "icons/magic/life/heart-cross-blue.webp" width="60" height="60"></>',
            label: "<p>HEAL</p>",
            callback: (html) => { resolve(Math.clamped(Math.floor(Number(html.find('#mqlohpoints')[0].value)), 0, healingPool)); }
          },
          abort: {
            icon: '<p></p><img src = "icons/svg/cancel.svg" width="60" height="60"></>',
            label: "<p>CANCEL</p>",
            callback: () => { resolve(false) }
          },
        },
        default: "abort",
      }).render(true);
    });
    const consumed = await d;
    if (!consumed) return false;

    const workflow = MidiQOL.Workflow.getWorkflow(args[0].uuid);
    const theItem = workflow.item;
    let updates;
    if (consumed > 0) {
      updates = {
        "data.consume.amount": Math.abs(consumed),
        "data.damage.parts": [[`${Math.max(0, consumed)}`, "healing"]],
        "data.chatFlavor": "Inspiring Smite"
      };
    } 

    // remove consumed from pool
    healingPool = healingPool - consumed;
    actor.setFlag("dae","healingpool",healingPool);

    return theItem.update(updates);
  }
  return true;