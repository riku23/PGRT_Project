![Main logo](https://i.imgur.com/lZsKfI4.jpg)
----------
<i class="icon-info"></i> :information_source: **Description**
-------------
**Temple of Light** is a computer game in which you have to play with color theory and lights to win. Developed during the Real-Time Ghrapics Programming course at the University of Milan, it shows some graphics effects and materials using shader written in GLSL and WebGL API. 

**The Game**  
The game's aim is to reach the Heart of the Temple of the light. In order to do so the player has to exceed all the levels. Each level is composted of 4 rooms and in one of them there's a door that connects the current level to the next one. There's also a headlight with a white light that points against the door. The player has to change the colour of the spotlight, that has to match with the door, by choosing the right filter that can be found inside other rooms in the current level. If the colour of the light is different from the door , the player can mix different colours in order to create the one he's looking for.

<img src="https://raw.githubusercontent.com/andrea29292/PGRT_Project/master/images/screenshots/endgame.png" width="700">
  
----------
<i class="icon-info"></i> :video_game:  **Controls**
---------- 
**WASD** - move inside the temple  
**1 and 2** - select filter slot  
**R** - reset current level  
**I** - activate an alert that lists game controls  
**Cursor movement** - move your head inside the game  
**Left mouse click on a filter** - take the filter  
**Left mouse click on the headlight** - put the filter in the headlight 
**Left mouse click on the "combine" button** - combine colors in slots 1,2 and 3 (if there is a saturation filter)
      
----------
<i class="icon-info"></i> :hammer:  **Materials Used**
----------  
 
**Phong material**: since it gaves a good polished effect we use this material with the headlight and all the torches around the rooms.    
<img src="https://raw.githubusercontent.com/andrea29292/PGRT_Project/master/images/screenshots/headlight.png" width="200">
<img src="https://raw.githubusercontent.com/andrea29292/PGRT_Project/master/images/screenshots/torch.png" width="400">  

--------------

**Lambertian material**: looking for a more rough appearance we choose to use this material for the table which is theoretically made of wood.  

  
<img src="https://raw.githubusercontent.com/andrea29292/PGRT_Project/master/images/screenshots/table.png" width="400">  
------------

**Cook-Torrance with procedural texture**: looking for a marble effect on the wall we use this material combined with a procedural texture

<img src="https://raw.githubusercontent.com/andrea29292/PGRT_Project/master/images/screenshots/cook-torrance.png" width="400">


----------
<i class="icon-user"></i> :space_invader: **Play the game**
----------
> **Note:**

> - If you download this project from Github please use Firefox to run it.


Link to Temple of Light: 
