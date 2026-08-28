const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const { obterToken } = require('../Helpers/authenticacao');

describe('ContasGet', () => {
    let token;

    beforeEach(async () => {
        token = await obterToken('julio.lima', '123456');
    });

    describe('GET /contas/{id}', () => {
        it('Deve retornar 200 e informações da conta procurada', async () => {
            const idConta = 1;

            const resposta = await request(process.env.BASE_URL)
                .get(`/contas/${idConta}`)
                .set('Authorization', `Bearer ${token}`);

            expect(resposta.status).to.equal(200);
            expect(resposta.body.id).to.equal(idConta);
            expect(resposta.body.id).to.be.a('number');
            expect(resposta.body.titular).to.equal('João da Silva');
            expect(resposta.body.saldo).to.be.a('string');
            expect(resposta.body.saldo).to.match(/^\d+\.\d{2}$/);

            const saldo = Number(resposta.body.saldo);
            expect(saldo).to.be.at.least(0);
            expect(resposta.body.ativa).to.equal(1);
        });
    });

    describe('GET /contas', () => {
        it('Deve retornar um array das listas presentes de acordo com o tamanho', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/contas?page=1&limit=10')
                .set('Authorization', `Bearer ${token}`);

            expect(resposta.status).to.equal(200);
            expect(resposta.body.contas).to.be.an('array');
            expect(resposta.body.contas).to.have.lengthOf.at.most(10);

            if (resposta.body.contas.length > 0) {
                const primeiraConta = resposta.body.contas[0];

                expect(primeiraConta.id).to.equal(1);
                expect(primeiraConta.id).to.be.a('number');
                expect(primeiraConta.titular).to.equal('João da Silva');
                expect(primeiraConta.saldo).to.be.a('string');
                expect(primeiraConta.saldo).to.match(/^\d+\.\d{2}$/);

                const saldo = Number(primeiraConta.saldo);
                expect(saldo).to.be.at.least(0);
                expect(primeiraConta.ativa).to.equal(1);
            }
        });
    });
});