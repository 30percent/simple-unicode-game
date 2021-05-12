# Quick
* ~~Load state from json~~
* ~~Add way to create locations from file~~
* ~~Basic inventory~~
* Move interface to separate class 
  * (allow for subsection modification and clarity)
* Interactions Window
* Re-add furniture (method to remove status effects)
* Simple Styling (gives room for Mediums)
  * center map in box
  * box for object current map
* ~~Display current inventory~~
* Item pickup
  * Containers in map
* ~~"Kill" Person on hp 0 (ignore in state, combat skips over)~~
* Allow map config to reference a .json/.map for new Objects

# Medium
* Use doodads instead of just walls
* Routines should support "prioritization"
* NPC decision-based pathing
* Items and inventory
  * Method to use inventory?
  * Set item active
* Build out "City"
* Drop inventory on death
* Routines from config
* Map "larger" than viewing window
* Movement between zones based on ingress "vector"
  * When user enters zone, should be based on some logic (instead of )

# Long
* "Minion" interaction
  * Some form of "combat"
  * Start with "dummy"
* Basic Dialog (Form on side?)
* Display only section of map *around* player
* Basic Encounter-Map generation
  * Use DnD BG as inpiration?
* "Relationship"
  * Stat tracking (ways to ^ and v rel)
  * Representing the interactions

# Cleanup | Maintenance
* Fix garbage config code
* ~~Consider immer.js~~
* Improve immer integration, rely less on `place = place...`
* Remove `Map<string, T>` (it complicates for no benefit)
* ~~Improve "scenery" handling (walls)~~



(Unicode Characters)
⇑ ⇒ ⇐ ⇓
⌂ ⍝ ⍲ ⎄
⌯ ⍾ ⎈ ⍯