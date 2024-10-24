import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_KEY!
});

async function createNamespace() {
    const index = getIndex();
    const namespace = index.namespace('cool-namespace');
}

type CoolType = {
    coolness: number,
    reference: string
}
function getIndex() {
    const  index = pc.index<CoolType>('cool-index');
    return index;
}
async function listIndexes() {
    const result = await pc.listIndexes();
    console.log(result);
}

function generateNumberArray(length: number) {
    return Array.from({length},  () => Math.random())
}

async function upsertVector() {
    const embedding = generateNumberArray(1536);
    const index = getIndex();
    const upsertResult = await index.upsert([{
        id: 'id-1',
        values: embedding,
        metadata: {
            coolness: 3,
            reference: 'asd'
        }
    }]);
}

async function queryVector() {
    const index= getIndex();
    const result = await index.query({
        id: 'id-1',
        topK: 1,
        includeMetadata: true
    })
    console.log(result)
}

async function createIndex() {
    await pc.createIndex({
        name: 'cool-index',
        dimension: 1536, // Replace with your model dimensions
        metric: 'cosine', // Replace with your model metric
        spec: { 
          serverless: { 
            cloud: 'aws', 
            region: 'us-east-1' 
          }
        } 
    });
}

// createIndex();
// listIndexes();
// upsertVector();
queryVector();