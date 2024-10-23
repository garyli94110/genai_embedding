import { EmbeddingData, generateEmbedding, loadJsonData } from "./main";

function dotProduct(a:number[], b:number[]) {
    return a.map((value, index) => value * b[index]).reduce((a,b)=> a+b, 0);
}

function cosineSimilarity(a: number[], b:number[]) {
    const product = dotProduct(a,b);
    const aMagnitude = Math.sqrt(a.map(value => value*value).reduce((a,b)=> a+b, 0));
    const bMagnitude = Math.sqrt(b.map(value => value*value).reduce((a,b)=> a+b, 0));
    return product / (aMagnitude * bMagnitude);
}

async function main () {
    const dataWithEmbeddings = loadJsonData<EmbeddingData[]>('releaseDatesEmbedding.json');
    
    const input = '';
    const inputEmbedding = await generateEmbedding(input);

    const similarities: {
        input: string,
        similarity: number
    }[] = [];

    for(const entry of dataWithEmbeddings) {
        const similarity = cosineSimilarity(
            entry.embedding,
            inputEmbedding.data[0].embedding
        );
        similarities.push( {
            input: entry.input,
            similarity
        })
    }

    console.log(`similarity of ${input} with: `);
    const sortedSimilarities = similarities.sort((a,b)=> b.similarity - a.similarity);
    sortedSimilarities.forEach(similarity => {
        console.log(`${similarity.input}: ${similarity.similarity}`);
    });
}

main()