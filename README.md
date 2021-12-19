# Process Internal Modes (PIM)

## About 

This is a short and simple Javascript script that uses Regex on a supplied log file
in order to find Normal Mode Tables. These Tables are then processed by
1. First, converting `center numbers` to `atom symbols`. This is done by using an array of element symbols in order of atomic number and using another table within the log file for `center number` to `atomic number` mappings.
   Then, merging rows with the same mode and atoms (up to the first 3 positions of their definitons) 
   1. here, the `relative weights` of the matching rows are summed
   2. we also catalogue the names of all merged rows in order to support observing what rows were merged to produce each process row.
2. We print out that new processed tables.

## Install NodeJs

1. Install NodeJs > v15.0.0

Literally just download and install [NodeJs](https://nodejs.org/en/)

2. Confirm installation
Open a fresh terminal(powershell/cmd for windows) and run

```sh
node -v
```
you should get the version number of your installation returned. 
**Note:** Make sure it is 15 or greater.

3. Download my script `pim.js`

you can save this to whatever folder you like but I would recommend placing it somewhere near the log files you aim to process.
This way you paths can be nice and short.

## Execution

To run this script all you need is the path to the log file you wish to process. This can be a relative of full path.

Follow this structure, 
```sh
node PATH/TO/THIS/SCRIPT.js PATH/TO/LOG/FILE.log
```

For Example, if my script is in the same location as my log file and my terminal 
is already in that location I could just run the following.

```sh
node ./pim.js ./BeTAP_Int.log
```
