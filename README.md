# More Automated Spells Items and Feats
FoundryVTT More Automated Spells Items and Feats (MASIF amounts of automation) Module

This module requires the following modules to function:

- MIDI-QOL                              https://foundryvtt.com/packages/midi-qol/
- Dynamic Active Effects (dae)          https://foundryvtt.com/packages/dae  
- DFreds Convenient Effects             https://foundryvtt.com/packages/dfreds-convenient-effects
- Advanced Macros                       https://foundryvtt.com/packages/advanced-macros
- Link Item and Resource (recommended)  https://foundryvtt.com/packages/link-item-resource-5e
- 5e Sheet Resource plus (recommended)  https://foundryvtt.com/packages/resourcesplus

I started automating the Fighter Battlemaster Maneuvers and just kept on going I guess...

One day, I hope that the More Automated Spells Items and Feats (MASIF) becomes a massive collection of automated items for FoundryVTT D&D5e.

Latest module manifest: https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/releases/latest/download/module.json

<details>
<summary> PREAMBLE </summary>
<p>&nbsp;</p>

So it has been many years since I have been a practicing developer, and this is my first time writing in javascript. I the code much more verbose than necessary with unnecesary space and descriptive variablenames.  I did this is hopes that folks like me could follow along with the code and understand how it works.  I know that javascript can be much more compact.  When I first looked at javascript it was way more intimidating than writting 68030 assembly back in my early days after college (yes I just dated myself).  Once I have mastered javascript I am sure I will write much more compact code, but I hope this inspires some of you to follow along and try your hand at automating something you really want.  In fact most of my automations are NOT macros at all (javascript).  MIDI-QOL and DAE provide a huge framework to do 90% of everything most people would want without writing a line of javascript code.  

These three videos did a great job explaining how to get started writing foundry macros. I highly recommend them... they were made by spacemandev.

https://www.youtube.com/watch?v=-HSCybI0txc

https://www.youtube.com/watch?v=0S7HjMN52I4

https://www.youtube.com/watch?v=raM_Z0e7ov8

So after playing with some scripts and helping debug some of my favorite modules with their authors, I broke down and decided to see if I could help automate the Fighter: Battlemaster. In several of the games I run or play in there has been a Fighter Battlemaster character, it was hard to believe no one has done this yet.    

I was shocked to learn that there is a ton of complication in automating a Battlemaster however... but if you are going to swim you might as well dive in. :) 

So before I explain how to setup and use these scripts, a shout out to Tim Posney, the creator of MIDI-QOL and DAE. A fantastic person who is a great help, especially as he answered all of my crazy stupid questions and helped me solve some truely puxzzling probelms. (and he pointed out a whole bunch of obvious things that did not click for me)... Thank you Tim.
<p>&nbsp;</p>
</details>

<details>
<summary> IMPORTING AN AUTOMATION ITEM </summary>
<p>&nbsp;</p>

Once the compendium module is installed you can import one of the items into your game.  Most of them are completely setup from the start and can be dropped on the appropriate character and just function.  

<img width="233" alt="image" src="https://user-images.githubusercontent.com/76136571/161750222-0040e632-682c-46d2-b618-37924df4a61f.png">
<img width="275" alt="image" src="https://user-images.githubusercontent.com/76136571/161781725-f7503eb7-7a27-41b4-b26d-0f03234e1040.png">

Occassionaly there will be notes in the description that instruct you HOW and WHEN to use the item to automate your game play. 

<img width="554" alt="image" src="https://user-images.githubusercontent.com/76136571/161777420-071b1894-8a1d-4546-b587-a7fac64d3aa4.png">

Sometimes there is even more setup like linking those items to a character sheet resources.  

<img width="569" alt="image" src="https://user-images.githubusercontent.com/76136571/161775726-fb67bb97-5fd1-45c5-8301-bbb17e2d0f1d.png">

If you have a character sheet runs out of resource spaces, might I suggest the module 5e Sheet Resource Plus ... https://github.com/ardittristan/5eSheet-resourcesPlus
    
<img width="415" alt="image" src="https://user-images.githubusercontent.com/76136571/161781506-a938a292-2be8-4f9f-bb3c-21911904fe08.png">

<p>&nbsp;</p>
</details>

<details open>
<summary> AUTOMATION ITEMS IN THIS MODULE</summary>

- Divine Fury, Auto Divine Fury
- Channel Divinity: Turn Undead
- Eyes of the Night / Gift of the Eyes of the Night
- ALL 23 Fighter: Battlemaster Maneuvers and support item(s)
- Peerless Athlete
- Steps of the Night
- Vigilant Blessing
- Help Action
- Vitrolic Sphere (with automatic DoT Damage) 
- Stunning Strike
- Fey Presence
- Misty Escape
- Elemental Adept feat (all 5)
- Shadow Step
- Orcish Fury
- Channel Divinity: Inspiring Smite & Inspiring Smite (These two go together)
- Slasher (Critical hit and reduce speed)
- Piercer (Critical Hit bonus and reroll damage die)
- Channel Divinity: Path to the Grave
- Circle of Mortality
- Psionic Power: Psionic Die
- Aura of Alacrity
- Incisive Sense
- Channel Divinity: Radiance of the Dawn
- Wrath of the storm
- Zealous Presence
    
</details>
    
<details open>
<summary> BATTLEMASTER MANEUVER SETUP</summary>
<p>&nbsp;</p>

Install and enable the module, it adds a single compendium with all of the maneuvers... 

<img width="290" alt="image" src="https://user-images.githubusercontent.com/76136571/161349973-bee1cb45-832b-40c5-b07b-c1c7dfbf7c95.png">

(1) You must setup a resource named "Superiority Dice" and set it ro refresh on SHORT and LONG rest. 

<img width="554" alt="image" src="https://user-images.githubusercontent.com/76136571/161351746-5ee51777-1f4d-40c7-8c8d-2b18cc083563.png">

(2) All Fighter Battlemasters must have the Supriority Die effect on their character, just drag it onto the character and forget about it. 

<img width="312" alt="image" src="https://user-images.githubusercontent.com/76136571/161349990-5278e1ba-d067-485c-9149-5fd59a638f03.png">
<img width="562" alt="image" src="https://user-images.githubusercontent.com/76136571/161350068-5a7acf3f-3f01-4ebf-829c-5e31ff2db2cc.png">

(3) Copy over the maneuvers your fighter knows and drop them onto the character sheet.  
    If there are alreay items with duplicate names on your sheet they MUST be removed. 
    
<img width="552" alt="image" src="https://user-images.githubusercontent.com/76136571/161350220-cee0b620-f132-4b2a-9d42-36c6c72a6498.png">

   Then ```FOR EACH``` Maneuver ```EXCEPT Precision Attack``` you have added to the character you must set the resource consumption. 
   
   (unfortunately I do not know of a way to automate this, I know precision attack being the exception is annoying)

<img width="493" alt="image" src="https://user-images.githubusercontent.com/76136571/161351660-f1f4bcb5-0a9b-4143-bed9-e122eb706286.png">

(4) read each one, they come with ```USAGE INSTRUCTIONS``` at the top of every description

<img width="493" alt="image" src="https://user-images.githubusercontent.com/76136571/161350367-1de90956-203d-464c-b4cc-28243279e681.png">

(5) Have fun and report issues :) 
<p>&nbsp;</p>
</details>

<details>
<summary> WHAT TO KNOW ABOUT USING BATTLEMASTER MANEUVERS </summary>
<p>&nbsp;</p>
Fighter Battlemaster Maneuvers are divided into several categories: Utility, Before Attack, After Attack, and Automated.

Utility Maneuvers can be identified by the EYE GRAPHIC, these can be activated whenever your characters can act. 

<img width="533" alt="image" src="https://user-images.githubusercontent.com/76136571/161350457-1397a181-7785-4e24-98d4-dd2a79f037d4.png">

BEFORE ATTACK MANEUVERS must be activated before you roll your weapon attack.

<img width="517" alt="image" src="https://user-images.githubusercontent.com/76136571/161350573-e52d1a5f-ad36-475d-b10f-865cbd930973.png">

AFTER THE ATTACK must be activated if a hit is made.

<img width="464" alt="image" src="https://user-images.githubusercontent.com/76136571/161350995-46f3d4a8-6ace-485c-912c-87348905a63b.png">

AUTOMATED is just as it sounds, these will appear if you are using MIDI-QOL, DAE and DF Convenient Effects.

<img width="929" alt="image" src="https://user-images.githubusercontent.com/76136571/161351112-f4bae672-9866-442b-9e4d-9a2bf655d486.png">
</details>

<details>
<summary> KNOWN ISSUES </summary>
<p>&nbsp;</p>
</details>

<details>
<summary> AUTOMATIONS I AM WORKING ON</summary>

- combat wildshape
- Fighting Style: Great Weapon Fighting
- Starry Forms (all 3)
- Steady
- shadow arts
- warding flare
- hound of ill omen
- channel divinity destructive wrath
- Sourcery Point Meta Magic Effects
- Primevil Awareness
- Arcane Recovery
- Awakened Spellbook: Replace Damage
- Spear Master
- Fighter Maneuver Lunging Attack
- Fighter Maneuver Goading Attack
- Fighter Maneuver Pushing Attack
- Feline Agility
- Relentless Endurance
- Brave
- Psionic Power: Psionic Wispers 
- Psionic Power: Psi-Bolstered Knack
- Dimension Door (cape of mountebank)
- Channel Divinity: Path to the Grave
                                                                                                      
<p>&nbsp;</p>
</details>

DISCORD (jbowens#0415) 
