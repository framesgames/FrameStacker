# FrameStacker

FrameStacker is a ReactJS webapp I built to help a friend of mine organise inventory in his warehouse and to help myself get reacquainted with ReactJS. The basic steps to use the application are: 

* Choose the height of your stack
* Import blocks from a CSV
* Drag/drop your blocks from the start position to the dropzone on the right side of the screen.

The CSV structure looks like this: 

| id | length | height |
| --- | --- | --- |
| string | number | number |

When the CSV is loaded, blocks are drawn in proportion to the size of the screen such that the largest block is 50% of the dropzone. Since this is a 2D drawing and the height would have been represented as depth in a 3D drawing, we used colour (different shades of grey) to represent height. To represent grey colours, we proportionately scale height to be values within range 50 < x < 200 where the shade would be RGB(x, x, x). 

If you are unhappy with the orientation of any of the blocks, you can start dragging it and hit Spacebar to rotate. This swaps the height and the length values read from the CSV. 

Since all I need is a place to host my static webapp, I've made use of the free hosting on GitHub Pages: https://framesgames.github.io/FrameStacker/
