# Process Internal Modes (PIM)

## About 

This is a short and simple Javascript script that uses Regex on a supplied log file
in order to find Normal Mode Tables. These Tables are then processed by
1. First, converting `center numbers` to `atom symbols`. This is done by using an array of element symbols in order of atomic number and using another table within the log file for `center number` to `atomic number` mappings.
   Then, merging rows with the same mode and atoms (up to the first 3 positions of their definitons) 
   1. here, the `relative weights` of the matching rows are summed
   2. we also catalogue the names of all merged rows in order to support observing what rows were merged to produce each process row.
2. We print out that new processed tables.

### Note

 - [MathJS](https://mathjs.org/) is used to ensure no floating point arithmetic errors ocurr. See [here](https://mathjs.org/docs/datatypes/bignumbers.html#roundoff-errors) for a simple example

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

3. Install PIM

you can save this to whatever folder you like but I would recommend placing it somewhere near the log files you aim to process.
This way you paths can be nice and short.

```sh
npm install -g git+https://github.com/KevinCorcor/PIM.git
```

## Execution

To run this script all you need is the path to the log file you wish to process. This can be a relative of full path.

Follow this structure, 
```sh
pim --target PATH/TO/LOG/FILE.log
```

For Example, if my script is in the same location as my log file and my terminal 
is already in that location I could just run the following.

```sh
pim --target ./BeTAP_Int.log
```

## CLI Options

| key | Alias | Type | Description | Required |
| -- | -- | -- | -- | -- |
| target | t | some/path/to/target.file | The path (absolute or relative) of the file we want to process | true |
| output | o | some/path/to/output.file | The path (absolute or relative) to save the results. This will replace an existing file of the same name or create a new file if none exist.  | false |
| silent | s |  | hide the console output of results | false |
| no-prettyPrint |  |  | log the results to the console in json | false |

### Examples

#### Output

if the output fie does not exist one will be created.
```sh
pim -t ./normalModes.log -o ./results_15052022.json
# .
# ..
# ...
# (R)	0.80000%	C - H          	Stretch		R23,R28
# --------------------------------------------------------------------------
# NORMAL MODE: 93
# --------------------------------------------------------------------------
# (R)	80.80000%	C - H          	Stretch		R8,R10,R23,R28,R29,R37,R39,R40
# (R)	4.80000%	C - C          	Stretch		R7,R22,R27,R36
# (R)	4.00000%	C - C          	Stretch		R1,R4,R9,R13,R18,R20,R24,R38
# (A)	2.40000%	C - C - H      	Bend		A8,A12,A26,A32,A35,A53,A57,A62
# --------------------------------------------------------------------------
# Saved results to /user/Documants/res.json
```

If you want to save the `prettyPrint` console text to a file, try the following
```sh
pim -t ./normalModes.log > path/to/save/console/output.log
```

#### No-prettyPrint
```sh
pim -t ./normalModes.log --no-prettyPrint
# .
# ..
# ...
#       'A(CCN) 0.0142': [Object],
#       'A(CCN) 0.0156': [Object],
#       'A(CCC) 0.0149': [Object],
#       'A(CCH) 0.017': [Object]
#     }
#   },
#   {
#     rows: {
#       'R(CC) 0.0181': [Object],
#       'R(CC) 0.0467': [Object],
#       'R(CH) 0.3854': [Object],
#       'A(CCH) 0.012': [Object]
#     }
#   }
# ]
```

#### Silent
```sh
pim -t ./normalModes.log -o ./results_15052022.json -s
# Saved results to /user/Documants/res.json
```

