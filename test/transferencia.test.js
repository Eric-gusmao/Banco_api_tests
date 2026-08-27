const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();

describe('Transferência', () => {
    describe('POST /transferencias', () => {
        it('Deve retornar sucesso com 201 com trasferecia maior ou igual a R$ 10,00', async () => {
            // Capturar token
            const respostaLogin = await request(process.env.BASE_URL)
                .post('/login')
                .set('Content-Type', 'application/json')
                .send({
                    username: 'julio.lima',
                    senha: '123456'
                });

            const token = respostaLogin.body.token;
            
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
            const respostaLogin = await request(process.env.BASE_URL)
                .post('/login')
                .set('Content-Type', 'application/json')
                .send({
                    username: 'julio.lima',
                    senha: '123456'
                });

            const token = respostaLogin.body.token;
            
            const resposta = await request('http://localhost:3000')
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
