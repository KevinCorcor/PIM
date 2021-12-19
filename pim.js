const fs = require('fs')

/** Order is important here. Position 0(the first) is null since there is no atomic number of 0 */
const ELEMENT_SYMBOLS = [
    'null',
    'H',
    'He',
    'Li',
    'Be',
    'B',
    'C',
    'N',
    'O',
    'F',
    'Ne',
    'Na',
    'Mg',
    'Al',
    'Si',
    'P',
    'S',
    'Cl',
    'Ar',
    'K',
    'Ca',
    'Sc',
    'Ti',
    'V',
    'Cr',
    'Mn',
    'Fe',
    'Co',
    'Ni',
    'Cu',
    'Zn',
    'Ga',
    'Ge',
    'As',
    'Se',
    'Br',
    'Kr',
    'Rb',
    'Sr',
    'Y',
    'Zr',
    'Nb',
    'Mo',
    'Tc',
    'Ru',
    'Rh',
    'Pd',
    'Ag',
    'Cd',
    'In',
    'Sn',
    'Sb',
    'Te',
    'I',
    'Xe',
    'Cs',
    'Ba',
    'La',
    'Ce',
    'Pr',
    'Nd',
    'Pm',
    'Sm',
    'Eu',
    'Gd',
    'Tb',
    'Dy',
    'Ho',
    'Er',
    'Tm',
    'Yb',
    'Lu',
    'Hf',
    'Ta',
    'W',
    'Re',
    'Os',
    'Ir',
    'Pt',
    'Au',
    'Hg',	
	'Tl',
    'Pb',
    'Bi',
    'Po',
    'At',
    'Rn',
    'Fr',
    'Ra',
    'Ac',
    'Th',
    'Pa',
    'U',
    'Np',
    'Pu',
    'Am',
    'Cm',
    'Bk',
    'Cf',
    'Es',
    'Fm',
    'Md',
    'No',
    'Lr',
    'Rf',
    'Db',
    'Sg',
    'Bh',
    'Hs',
    'Mt',
    'Ds',
    'Rg',
    'Cn',
    'Uut',
    'Fl',
    'Uup',
    'Lv',
    'Uus',
    'Uuo'
]

/** 
 * create a mapping of center numbers to Element Symbol (using the atomic number) one way,
 * such that you can query the returned object with a Center Number 
 * and get the corresponding Element.
 * 
 * For this we parse the Standard Orieentation table's columns 1 and 2
*/
function getElementCenterNumberMapping(fileSnippet) {
    /* extract the table */
    const headerRegex = /^\s+Standard orientation:\s+\n\s-+\n\s.+\n.+\n\s-+\n/gm
    let SOTable = fileSnippet.split(headerRegex)[1]
    SOTable = SOTable.substring(0, SOTable.search(/\n\s-+\n/m))
    
    /* Separate rows and create mapping */
    const rows = SOTable.trim().split(/\r?\n/)
    const elementsByCN= {}
    rows.forEach(row => {
        const rowColumns = row.trim().split(/\s+/g)
        elementsByCN[rowColumns[0]] = ELEMENT_SYMBOLS[rowColumns[1]]
    })

    return elementsByCN
}

/**
 * simply return the mode type for a given mode symbol
 */
function getMode(definition) {
    switch (definition[0]) {
        case ('A'):
            return 'Bend'
        case ('R'):
            return 'Stretch'
        case ('L'):
            return 'Linear Bend'
        case ('D'):
            return 'Torsion'
    }
}

/** process the normal mode table by grouping rows of the same atoms and mode then summing relative weights */
function processNormalModeTables(filePath) {
    /** read in specified file */
    const rawFile = fs.readFileSync(filePath, 'UTF-8')
    /** extract normal mode tables */
    const headerRegex = /-*\s+-+\s+!\sNormal Mode\s+\d{1,3}\s+!\s+-+\s+-+\s\s!\sName\s+Definition\s+Value\s+Relative Weight \(%\)\s+!\s+-+$/gm
    const NMTables = rawFile.split(headerRegex)

    /** because we split(delimit) by the headerRegex we end up with the first item having 
     * no Normal Mode tables but does include some other useful information. */
    const elementsByCN = getElementCenterNumberMapping(NMTables.shift())
    /** because we split(delimit) by the headerRegex we end up with the last item having 
     * a Normal Mode table with tonnes morer info we don't want with it. Lets remove that extra info here */
    const finalNMTable = NMTables.pop()
    NMTables.push(finalNMTable.substring(0, finalNMTable.search(/-+\n/m)))

    let processedNormalModes = []
    NMTables.forEach((NMTable, NMTableNo) => {
        processedNormalModes[NMTableNo] = { rows: {} }

        const rows = NMTable.replaceAll('!', '').trim().split(/\r?\n/)
        rows.forEach((row) => {
            // break row into its columns
            const rowColumns = row.trim().split(/\s+/g)
            // convert center nums to element symbols
            const centerNumbers = rowColumns[1].replaceAll(/\D/g, ' ').trim().split(' ')
            // get some values ready
            const mode = getMode(rowColumns[1])
            const atoms = centerNumbers.map(coord => elementsByCN[coord])
            if(mode === 'Torsion') {
                atoms.length = 4
            } else {
                atoms.length = atoms.length > 3 ? 3 : atoms.length
            }
            const signature = rowColumns[1][0] + '(' + atoms.sort().join('') + ')'

            if(atoms.length > processedNormalModes[NMTableNo].maxAtoms) {
                processedNormalModes[NMTableNo].maxAtom = atoms.length
                console.log(processedNormalModes[NMTableNo].maxAtom)
            }
            if(!processedNormalModes[NMTableNo].rows[signature]) {
                // if it is the first ocurrence of this combination of mode and elements
                processedNormalModes[NMTableNo].rows[signature] = {
                    names: [rowColumns[0]],
                    definition: {
                        modeSymbol: rowColumns[1][0],
                        mode,
                        atoms,
                    },
                    value: parseFloat(rowColumns[2]),
                    relativeWeight: parseFloat(rowColumns[3]),
                }
            } else {
                // otherwise just update these values
                processedNormalModes[NMTableNo].rows[signature].relativeWeight += parseFloat(rowColumns[3])
                processedNormalModes[NMTableNo].rows[signature].names.push(rowColumns[0])
            }
        })
    })

    return processedNormalModes
}

function printTables(tables) {
    tables.forEach((table, tableNo) => {
        console.info(`NORMAL MODE: ${tableNo + 1}`)
        console.info('--------------------------------------------------------------------------')
        const sortedRows = Object.values(table.rows).sort((a, b) => b.relativeWeight - a.relativeWeight)
        sortedRows.forEach((row) => {
            console.log(`(${row.definition.modeSymbol})\t${row.relativeWeight.toFixed(5)}%\t${row.definition.atoms.join(' - ').padEnd(15, ' ')}\t${row.definition.mode}\t\t${row.names}`)
        })
        console.info('--------------------------------------------------------------------------')
    })
}

const pnmt = processNormalModeTables(process.argv[2])
printTables(pnmt)
