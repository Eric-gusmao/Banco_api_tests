const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const { obterToken } = require('../Helpers/authenticacao');
const { obterTransferenciaPorId } = require('../Helpers/getTransferencia');
const postTransferencias = require('../fixtures/postTransferencias.json');

describe('Transferência', () => {
    let token;
        
    beforeEach(async () => {
        token = await obterToken('julio.lima', '123456');
    });

    describe('POST /transferencias', () => {
        it('Deve retornar sucesso com 201 com trasferecia maior ou igual a R$ 10,00', async () => {
            const bodyTransferencias = { ...postTransferencias };
            
            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyTransferencias);

                expect(resposta.status).to.equal(201);
        });

        it('Deve retornar erro com 422 quando valor de transferencia menor que R$ 10.00', async () => {
            const bodyTransferencias = { ...postTransferencias };
            bodyTransferencias.valor = 9;

            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyTransferencias);

                expect(resposta.status).to.equal(422);
        });
    });

    describe('GET /transferencias/{id}', () => {
        it('Deve retornar sucesso com 200 e dados iguais ao registro de transferencia contido no banco de dados quando o ID for valido', async () => {
            const resposta = await obterTransferenciaPorId(7, token);

            expect(resposta.status).to.equal(200);
            expect(resposta.body.id).to.equal(7);
            expect(resposta.body.id).to.be.a('number');
            expect(resposta.body.conta_origem_id).to.equal(7);
            expect(resposta.body.valor).to.equal(11.00);
        });
    });

    describe('GET /transferencias', () => {
        it ('Deve retornar 10 elementos na paginacao quando informar limite de 10 registros', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/transferencias?page=1&limite=10')
                .set('authorization', `Bearer ${token}`)
            
            expect(resposta.status).to.equal(200)
            expect(resposta.body.limit).to.equal(10)
            expect(resposta.body.transferencias).to.have.lengthOf(10);
        });
    });

    describe('DELETE /transferencias/{id}', () => {
        it('Deve deletar uma transferencia válida com sucesso e confirmar que foi removida', async () => {
            const respostaListagemInicial = await request(process.env.BASE_URL)
                .get('/transferencias?page=1&limite=100')
                .set('Authorization', `Bearer ${token}`);

            expect(respostaListagemInicial.status).to.equal(200);
            expect(respostaListagemInicial.body.transferencias).to.be.an('array');

            const idsIniciais = new Set(
                respostaListagemInicial.body.transferencias.map(transferencia => transferencia.id)
            );

            const respostaPost = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({ ...postTransferencias });

            expect(respostaPost.status).to.equal(201);

            const respostaReconsulta = await request(process.env.BASE_URL)
                .get('/transferencias?page=1&limite=100')
                .set('Authorization', `Bearer ${token}`);

            expect(respostaReconsulta.status).to.equal(200);
            expect(respostaReconsulta.body.transferencias).to.be.an('array');

            const transferenciaCriada = respostaReconsulta.body.transferencias.find(
                transferencia => !idsIniciais.has(transferencia.id)
            );

            expect(transferenciaCriada).to.exist;
            expect(transferenciaCriada.id).to.be.a('number');

            const respostaDelete = await request(process.env.BASE_URL)
                .delete(`/transferencias/${transferenciaCriada.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(respostaDelete.status).to.equal(204);

            const respostaGet = await request(process.env.BASE_URL)
                .get(`/transferencias/${transferenciaCriada.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(respostaGet.status).to.equal(404);
        });
    });
});
