// Netlify Deploys - https://app.netlify.com/sites/json-benchmark/deploys
// Vercel Deploys - https://vercel.com/samcarlton/json-benchmark/deployments
import fs from 'fs-extra'
// https://github.com/faker-js/faker
import { faker } from '@faker-js/faker'
import { performance, PerformanceObserver } from 'perf_hooks'



const entriesDirectory = 'dist/entry'

// Sleep for a given number of milliseconds
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Count number of entry files
async function countEntryFiles () {
    const files = await fs.readdir(entriesDirectory)
    return files.length
}


const obs = new PerformanceObserver((items) => {

    items.getEntries().forEach((entry) => {
        // console.log(item.name, + ' ' + item.duration)

        countEntryFiles()
            .then( fileCount => {
                const entryDurationSeconds = ( entry.duration / 1000 ).toFixed(2)
                const durationPerFile = ( entry.duration / fileCount ).toFixed(2)

                console.log(`${ entry.name }: ${ entryDurationSeconds }s (${ durationPerFile }ms per file)`)
            })

    })
})
obs.observe({entryTypes: ['measure']})


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
    lastUpdated: {
        raw: faker.date.past(),
        formatted: faker.date.past().toLocaleString(),
        timestamp: faker.date.past().getTime(),
    },
    channel: {
        id: faker.datatype.uuid(),
        name: faker.name.findName(),
        description: faker.lorem.sentence(),
        status: faker.finance.transactionType(),
    },
    timestamps: [
        {
            raw: faker.date.past(),
            formatted: faker.date.past().toLocaleString(),
            timestamp: faker.date.past().getTime(),
        },
        {
            raw: faker.date.past(),
            formatted: faker.date.past().toLocaleString(),
            timestamp: faker.date.past().getTime(),
        },
        {
            raw: faker.date.past(),
            formatted: faker.date.past().toLocaleString(),
            timestamp: faker.date.past().getTime(),
        },
        {
            raw: faker.date.past(),
            formatted: faker.date.past().toLocaleString(),
            timestamp: faker.date.past().getTime(),
        },
        {
            raw: faker.date.past(),
            formatted: faker.date.past().toLocaleString(),
            timestamp: faker.date.past().getTime(),
        },
        {
            raw: faker.date.past(),
            formatted: faker.date.past().toLocaleString(),
            timestamp: faker.date.past().getTime(),
        },
    ],
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
    const fileCount = await countEntryFiles()
    console.log(`${ fileCount } files written to ${ entriesDirectory }`)

    // performance.mark( endMarkerName )
    performance.measure( 'Build time', startMarkerName )

    // Sleep to allow performance to report
    await sleep(2_000)

    process.exit()
}

performance.mark( startMarkerName )
build()