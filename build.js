import fs from 'fs-extra'
import { faker } from '@faker-js/faker'



const generateEntryObject = () => ({
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    aliases: [
        faker.name.findName(),
        faker.name.findName(),
        faker.name.findName(),
        faker.name.findName(),
        faker.name.findName(),
        faker.name.findName(),
        faker.name.findName(),
        faker.name.findName(),
        faker.name.findName(),
        faker.name.findName(),
        faker.name.findName(),
    ],
    status: faker.finance.transactionType(),
    bundleIds: [
        faker.datatype.uuid(),
        faker.datatype.uuid(),
        faker.datatype.uuid(),
        faker.datatype.uuid(),
        faker.datatype.uuid(),
        faker.datatype.uuid(),
        faker.datatype.uuid(),
        faker.datatype.uuid(),
        faker.datatype.uuid(),
    ],
    lastUpdated: faker.date.recent(),
    text: faker.lorem.paragraph(),
    slug: faker.lorem.slug(),
    endpoint: faker.internet.url(),
    category: {
        label: faker.lorem.word(),
        slug: faker.lorem.slug(),
    },
    tags: [
        faker.lorem.word(),
        faker.lorem.word(),
        faker.lorem.word(),
        faker.lorem.word(),
        faker.lorem.word(),
        faker.lorem.word(),
        faker.lorem.word(),
    ],
    relatedLinks: [
        {
            href: faker.internet.url(),
            label: faker.lorem.word(),
        },
        {
            href: faker.internet.url(),
            label: faker.lorem.word(),
        },
        {
            href: faker.internet.url(),
            label: faker.lorem.word(),
        },
        {
            href: faker.internet.url(),
            label: faker.lorem.word(),
        },
        {
            href: faker.internet.url(),
            label: faker.lorem.word(),
        },
    ]
})


const startMarkerName = 'build-start'
// const endMarkerName = 'build-end'


const build = async () => {

    // 50k entries
    const numberOfEntries = 50_000
    const entriesDirectory = 'dist/entry'

    const entries = new Set()

    // Delete any existing files
    console.log('Deleting existing files...')
    await fs.remove( entriesDirectory )

    // Ensure that the entry directory exists
    console.log('Creating entry directory...')
    await fs.ensureDir( entriesDirectory)

    // Generate the entries
    console.log(`Generating ${numberOfEntries} entries...`)
    for (let index = 0; index < numberOfEntries; index++) {
        const entry = generateEntryObject()
        const entryPath = `${entriesDirectory}/${entry.id}.json`

        // Write entry to json file
        await fs.writeFile( entryPath, JSON.stringify(entry, null, 2))

        // Add entry to set
        entries.add({
            index, 
            entryPath
        })
    }

    // Store the set of entries in a json file
    console.log('Writing entries to index file...')
    await fs.writeFile( 'dist/index.json', JSON.stringify(Array.from(entries), null, 2))

    // Count files in directory
    const files = await fs.readdir(entriesDirectory)
    console.log(`${ files.length } files written to ${ entriesDirectory }`)

    // performance.mark( endMarkerName )
    performance.measure( 'Build time', startMarkerName)

    // Pull out all of the measurements.
    for ( const entry of performance.getEntriesByType('measure') ) {
        const entryDurationSeconds = (entry.duration / 1000).toFixed(2)
        const durationPerFile = (entry.duration / files.length).toFixed(2)

        console.log(`${ entry.name }: ${ entryDurationSeconds }s (${ durationPerFile }ms per file)`)
    }
    // console.log('Performance: ', performance.getEntriesByType('measure'))

    process.exit()
}

performance.mark( startMarkerName )
build()