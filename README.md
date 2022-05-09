# More Automated Spells Items and Feats
FoundryVTT More Automated Spells Items and Feats (MASIF amounts of automation) Module

This module is still active as I work out any issues to get re-listed on FoundryVTT (if that is even possible).

    I AM REMOVED THE OLD GITHUB AND REBUILT IT WITHOUT SOME MISTAKENLY INCLUDED COPYRIGHT MATERIAL

To manually install use this URL: https://github.com/jbowensii/More-Automated-Spells-Items-and-Feats/releases/download/1.0.0/module.json

This module requires the following modules to function:

- MIDI-QOL                              https://foundryvtt.com/packages/midi-qol/
- Dynamic Active Effects (dae)          https://foundryvtt.com/packages/dae  
- DFreds Convenient Effects             https://foundryvtt.com/packages/dfreds-convenient-effects
- Advanced Macros                       https://foundryvtt.com/packages/advanced-macros
- 5e Sheet Resource plus (recommended)  https://foundryvtt.com/packages/resourcesplus

<details>
<summary> PREAMBLE </summary>
<p>&nbsp;</p>
So it has been many years since I have been a practicing developer, and this is my first time writing in javascript. My code is much more verbose than necessary with unnecesary space and descriptive variablenames.  I did this is hopes that folks like me could follow along with the code and understand how it works.  I know that javascript can be much more compact.  When I first looked at javascript it was way more intimidating than writting 68030 assembly back in my early days after college (yes I just dated myself).  Once I have mastered javascript I am sure I will write much more compact code, but I hope this inspires some of you to follow along and try your hand at automating something you really want.  In fact most of my automations are NOT macros at all (javascript).  MIDI-QOL and DAE provide a huge framework to do 90% of everything most people would want without writing a line of javascript code.  

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
    
There is also a global MACRO folder, as a GameMaster (DungeonMaster) import these and make sure they are marked as execute as a GM.  

The descriptions for each feature are empty, since including then MAY violate copyright, so please insert your own descriptions.  

There will also be notes in the description that instruct you HOW and WHEN to use the item to automate your game play. 
<b>Please remember to click on the collapsible icon <img width="15" alt="image" src="https://user-images.githubusercontent.com/76136571/164912225-f8485d94-56bd-4e1d-baf9-58873cb426a4.png"> to open a section and read the instructions.</b> 

If you have a character sheet runs out of resource spaces, might I suggest the module 5e Sheet Resource Plus ... https://github.com/ardittristan/5eSheet-resourcesPlus

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
    
</details>

DISCORD (jbowens#0415) 
