const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const { obterToken } = require('../Helpers/authenticacao');

describe('Transferência', () => {
    describe('POST /transferencias', () => {
        let token;
        
        beforeEach(async () => {
            token = await obterToken('julio.lima', '123456');
        });

        it('Deve retornar sucesso com 201 com trasferecia maior ou igual a R$ 10,00', async () => {
            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    contaOrigem: 1,
                    contaDestino: 2,
                    valor: 11,
                    token: "string"
                });

                expect(resposta.status).to.equal(201);
        });

        it('Deve retornar erro com 422 quando valor de transferencia menor que R$ 10.00', async () => {
            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    contaOrigem: 1,
                    contaDestino: 2,
                    valor: 9,
                    token: "string"
                });

                expect(resposta.status).to.equal(422);
        });
    });
});
