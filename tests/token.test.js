const { validateOperation } = require('@taquito/utils');
const axios = require('axios');
const qs = require('qs');

describe('Test de l\'API mint', () => {
    test('verifier si le hash reçu en retour est correct', async () => {

        const url = 'http://localhost:3000/mint';

        let data = qs.stringify ({
            transfer_to: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
            ipfs_url: 'ipfs://QmUQsfAufCrBdEGQU3tZ8Ym8SAL6Grv7xfmGyvy6taoPUg'
        });

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-BLOCKCHAIN': 'TEZOS',
            'X-API-KEY': 'testKey'
        };
        const response = await axios.post(url, data, { headers });
        expect(validateOperation(response.data.tx_hash)).toBe(3);
    }, 20000);
});



    //try {
    //j'effectue la requête HTTP
    //expect(response.data.hash.length).toBeGreaterThan(0);
    //ooF52Gj5J7Jj3FiVj5p1FDnAqMSDgUvD13fg2MwkoyQFg37hc42
    //opCWaAcPb3AasiuAYpPPA8a8J6m3cydBUSJJkKCm6Y4hw2hatv4
    //je vérifie le status de la réponse
    //expect(response.status).toBe(200);
    //je vérifie que le hash est défini
    //je vérifie que le type du hash est une chaîne de caractère
    //expect(typeof response.data.tx_hash).toBe("string");
    //} catch (error) {
        //on affiche ce message en cas d'erreur
        // throw new Error(`la requête a échoué : ${error.message}`);
        //}
//console.log('RESULTAT', response.data.tx_hash);
//expect(response.data.tx_hash).toMatch(/^[a-fA-F0-9]+$/);
//expect(response.status).toBe(200);
//expect(response.data.hash).toBeDefined();
//expect(response.data.hash).toBe('string');
//expect(hash).toMatch(/^[a-fA-F0-9]+$/);
//const mintTokenURL = 'localhost:3000';

//TextDecoderStream('Test de l\'API Mint/ verification du hash')
// explication du mot clé "await" il est utilisé pour attendre qu'une opération asynchrone soit terminée avant de passer à la suite de l'exécution du programme
/*async function retrievedatafromAPI() {
    const response = await fetch('localhost:3000'); //recherche des données dans l'api et les stocker dans la variable response
    const data = await response.json(); //effectuer une requete http asynchrone vers un serveur et obtenir des données de réponse 'response' sous la forme d'un objet JSON, l'objet contient plusieurs infos : status, en-tetes, corps de la réponse
    //.JSON format de données 
    return data;
}

describe('Test de l\'API Mint', () => {
    it('Doit récupérer les donnés de l\'API', async () => {
        const data = await retrievedatafromAPI('localhost:3000');
        expect(data).toBeDefined();
        expect(Array.isArray(data)).toBe(true);
        exepct 

    })



})

//la fonction describe est une fonction de regroupement, elle permet de créer des suites  de tests en regroupant des cas de tests liés les uns aux autres

0x523ff928561487d06977361029a34e3b440009424ae5d637c304d2ad0cf5b264*/