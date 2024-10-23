import { readFileSync, writeFileSync } from 'fs';
import OpenAI from 'openai';
import { join } from 'path';
import { json } from 'stream/consumers';

const openai = new OpenAI();

export async function generateEmbedding(input: string | string[]) {
    const response = await openai.embeddings.create(
        {
            input: input,
            model: 'text-embedding-3-small'
        }
    );
    console.log(response.data[0]);
    console.log(response.data[1]);
    return response;
}

export function loadJsonData<T>(fileName: string):T {
    const path = join(__dirname, fileName);
    const rawData = readFileSync(path);
    return JSON.parse(rawData.toString());
}

export function saveDataToJsonFile(data: any, fileName: string) {
    const dataString = JSON.stringify(data);
    const dataBuffer = Buffer.from(dataString);
    const path = join(__dirname, fileName);
    writeFileSync(path, dataBuffer);
    console.log(`save data to ${fileName}`);
}

export type EmbeddingData = {
    input: string,
    embedding: number[]
}

async function main() {
    const data =loadJsonData<string[]>('releaseDates.json');
    const embeddings = await generateEmbedding(data);
    const embeddingData: EmbeddingData[] = [];
    for (let i = 0; i< data.length; i++) {
        embeddingData.push({
            input: data[i],
            embedding: embeddings.data[i].embedding
        })
    }
    saveDataToJsonFile(embeddingData, 'releaseDatesEmbedding.json')
}
// main()


