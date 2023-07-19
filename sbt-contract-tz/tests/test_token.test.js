const axios = require('axios');

describe('Test de l\'API mint', () => {
    test('verifier si le hash reçu en résultat en résultat est correct', async () => {
        const response = await axios.post('http://localhost:3000/mint', {
            //faut-il mettre d'autres paramètres ?
        });
        expect(response.data.hash).toBeDefined();
        expect(response.data.hash).toBe('string');
        expect(hash).toMatch(/^[a-fA-F0-9]+$/);
        expect(response.data.hash.length).toBeGreaterThan(0);
    });
});

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