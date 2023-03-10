# More Automated Spells Items and Feats
FoundryVTT More Automated Spells Items and Feats (MASIF amounts of automation) Module




NEW UPDATE: I have been talking to Chris (Chris#8375 on discord) great guy and a fantastic module... when he finishes absorbing the automations in my module I will be closing this module down.  

https://github.com/chrisk123999/chris-premades




Version 2.0.0

Updates for D&D 5e 2.0.3 and FoundryVTT V10 Complete

This module is produced for FREE under the Wizard of the Coast Fan Content Policy: https://company.wizards.com/en/legal/fancontentpolicy

This fan work is meant to ease the online gameplay of Wizards of the Coast Dungeons and Dragons 5e game.

Please use your purchased D&D 5e books and online materials to provide descriptions of the features included in this Fan work.

To manually install use this URL: https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/releases/latest/download/module.json

This module requires the following modules to function:

- MIDI-QOL                              https://foundryvtt.com/packages/midi-qol/
- Dynamic Active Effects (dae)          https://foundryvtt.com/packages/dae  
- DFreds Convenient Effects             https://foundryvtt.com/packages/dfreds-convenient-effects
- Advanced Macros                       https://foundryvtt.com/packages/advanced-macros
- warpgate                              https://github.com/trioderegion/warpgate
- 5e Sheet Resource plus (recommended)  https://foundryvtt.com/packages/resourcesplus

<details>
<summary> PREAMBLE </summary>
<p>&nbsp;</p>
So it has been many years since I have been a practicing developer, and this is my first time writing in javascript. My code is much more verbose than necessary with unnecesary space and descriptive variable names and comments.  I did this is hopes that folks like me could follow along with the code and understand how it works.  I know that javascript can be much more compact.  When I first looked at javascript it was way more intimidating than writting 68030 assembly back in my early days after college (yes I just dated myself).  Once I have mastered javascript I am sure I will write much more compact code, but I hope this inspires some of you to follow along and try your hand at automating something you really want.  In fact most of my automations are NOT macros at all (javascript).  MIDI-QOL and DAE provide a huge framework to do 90% of everything most people would want without writing a line of javascript code.  

These three videos did a great job explaining how to get started writing foundry macros. I highly recommend them... they were made by spacemandev.

https://www.youtube.com/watch?v=-HSCybI0txc

https://www.youtube.com/watch?v=0S7HjMN52I4

https://www.youtube.com/watch?v=raM_Z0e7ov8

So after playing with some scripts and helping debug some of my favorite modules with their authors, I broke down and decided to see if I could help automate some features that had not been automated as yet.  
    
A shout out to Tim Posney, the creator of MIDI-QOL and DAE. A fantastic person who is a great help, especially as he answered all of my crazy stupid questions and helped me solve some truely puxzzling probelms. (and he pointed out a whole bunch of obvious things that did not click for me)... Thank you Tim.
<p>&nbsp;</p>
</details>

<details open>
<summary> IMPORTING AN AUTOMATION ITEM </summary>
<p>&nbsp;</p>

Once the compendium module is installed you can import one of the items into your game.  Most of them are completely setup from the start and can be dropped on the appropriate character and just function.  
    
The descriptions for each feature ARE EMPTY, since including descriptions would violate the Wizard of the Coast Fan Content Policy, so please insert your own descriptions from your purchased D&D 5e materials.  

There will also be notes in the description that instruct you HOW and WHEN to use the item to automate your game play. 
<b>Please remember to click on the collapsible icon <img width="15" alt="image" src="https://user-images.githubusercontent.com/76136571/164912225-f8485d94-56bd-4e1d-baf9-58873cb426a4.png"> to open a section and read the instructions.</b> 

If you have a character sheet runs out of resource spaces, might I suggest the module 5e Sheet Resource Plus ... https://github.com/ardittristan/5eSheet-resourcesPlus

<p>&nbsp;</p>
</details>

<details>
<summary> DETAILED INSTRUCTIONS provided by rprejean</summary>


First, thank you rprejean for this writeup... 

This document is to assist those with setting up MASIE to use the Battle Master Module. Its purpose is to clearly detail the steps needed to get the Battle Master module working. It assumes that you have loaded all of the prerequisite modules mentioned on Github.

Visit the Github link above to download the latest version and find out more about the module. I am not the developer nor do I have any experience in developing modules. For questions regarding the module, again, see the Github link above. 

Step 1:  Download, install and activate the module. Then locate the assets in the compendium. 

![Picture1](https://user-images.githubusercontent.com/76136571/209366254-6d6f054d-645e-4ec6-9142-b3779b83097f.png)
![Picture2](https://user-images.githubusercontent.com/76136571/209366257-bbd24ecd-86ff-4895-92e6-f39501a7abb2.png)

Step 2: Set up the character to be a Battle Master
Create a resource pool named “Superiority Die” set as seen below with the allotted pool corresponding to character’s level. See the D&D PHB. 

![Picture10](https://user-images.githubusercontent.com/76136571/209366682-55b673ca-f33d-443a-9e45-31b4a7ac11c1.png)

Create a subclass and link it to the Fighter main class.
Create a new item named “Battle Master” with the type “Subclass”

![Picture11](https://user-images.githubusercontent.com/76136571/209366711-82d2612c-6456-410c-8d6d-137b3266563b.png)

Open the item and change: (all lowercase)
Identifier:  battle-master
Class Identifier: fighter

![Picture12](https://user-images.githubusercontent.com/76136571/209366746-75b7cf6c-584b-4e2f-aa55-9558127b15ef.png)

Drag the new subclass to the fighter's Character sheet.

![Picture13](https://user-images.githubusercontent.com/76136571/209366786-fbc41795-e833-42f0-a3e7-7dad72810e2e.png)

Go to the BM compendium and drag “Superiority Die” to the character.It will appear in the features tab and create a passive effect under effects.

![Picture14](https://user-images.githubusercontent.com/76136571/209366851-d36541c6-5189-46db-9f04-623f82cf8b95.png)

This item requires no modification

Step 3: Configuring Battle Master Maneuvers

![image](https://user-images.githubusercontent.com/76136571/209367065-ec4b63fa-d79a-4a19-a011-a60d108da762.png)

●	Choose a Maneuver and drag it to the character sheet.

●	They will appear under Active Abilities

●	Open the settings for each Maneuver

![Picture15](https://user-images.githubusercontent.com/76136571/209366914-0131cec6-8856-4120-b4ac-d1e7878cbb79.png)

●	Details: Resource Consumption

○	Attribute

○	Resources.primary

○	1

●	Every Maneuver will be setup like this.

○	This causes all of them to use the same resource pool that was generated earlier


![Picture16](https://user-images.githubusercontent.com/76136571/209366972-3d1e166f-4011-4768-851b-5fd496ab3954.png)

<p>&nbsp;</p>
</details>


<details>
<summary> AUTOMATION ITEMS IN THIS MODULE</summary>
    
    
    The WIKI pages are currently empty but will be filled out shortly.

- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Divine-Fury">`Divine Fury`</a>
- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Channel-Divinity:-Turn-Undead">`Channel Divinity: Turn Undead`</a>
- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Eyes-of-the-Night">`Eyes of the Night`</a>
- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Battlemaster-Maneuvers">`Battlemaster Maneuvers`</a>
- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Peerless-Athlete">`Peerless Athlete`</a>
- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Steps-of-the-Night">`Steps of the Night`</a>
- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Vigilant-Blessing">`Vigilant Blessing`</a>
- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Help-Action">`Help Action`</a>
- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Vitrolic-Sphere">`Vitrolic Sphere`</a> 
- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Stunning-Strike">`Stunning Strike`</a>
- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Fey-Presence">`Fey Presence`</a>
- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Misty-Escape">`Misty Escape`</a>
- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Elemental-Adept">`Elemental Adept`</a>
- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Shadow-Step">`Shadow Step`</a>
- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Orcish-Fury">`Orcish Fury`</a>
- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Channel-Divinity:-Inspiring-Smite">`Channel Divinity: Inspiring Smite`</a>
- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Slasher">`Slasher`</a>
- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Piercer">`Piercer`</a>
- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Channel-Divinity:-Path-to-the-Grave">`Channel Divinity: Path to the Grave`</a>
- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Circle-of-Mortality">`Circle of Mortality`</a>
- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Psionic-Power">`Psionic Power`</a>
- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Aura-of-Alacrity">`Aura of Alacrity`</a>
- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Incisive-Sense">`Incisive Sense`</a>
- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Channel-Divinity:-Radiance-of-the-Dawn">`Channel Divinity: Radiance of the Dawn`</a>
- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Wrath-of-the-storm">`Wrath of the storm`</a>
- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Zealous-Presence">`Zealous Presence`</a>
- <a href="https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/wiki/Channel-Divinity:-Preserve-Life">`Channel Divinity: Preserve Life`</a>
    
</details>

DISCORD (jbowens#0415) 
Wizard of the Coast Fan Content Policy: https://company.wizards.com/en/legal/fancontentpolicy
