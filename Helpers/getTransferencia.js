const request = require('supertest');

const obterTransferenciaPorId = async (id, token) => {
    const resposta = await request(process.env.BASE_URL)
        .get(`/transferencias/${id}`)
        .set('Authorization', `Bearer ${token}`);

    return resposta;
};

module.exports = {
    obterTransferenciaPorId
};