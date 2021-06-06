const Usuarios = require('../models/usuarioModel')

const { getPostData } = require('../utils')

module.exports = {

    async getUsuario(req, res, email) {//retorna se o usario está cadastrado ou nao no bd
        try {
            const usuario = await Usuarios.findById(email)
            if (!usuario) {//se nao encontrar o usuario
                res.writeHead(406, { 'access-control-allow-origin': '*'})//retorna 406 significa nao aceitavel
                res.end()
            } else {
                res.writeHead(200, { 'access-control-allow-origin': '*'})
                res.end(JSON.stringify(usuario))//retorna as informações relativas ao usuario
            }
        } catch (error) {
            console.log(error)
        }
    },

    async criaMensagem(req, res) {//permite o usuario enviar uma mensagem para outro usuario, caso o outro n esteja cadastrado entao este é criado antes do envio da mensagem
        try {

            const body = await getPostData(req)

            const { remetente, destinatario, assunto, corpo, respondida, encaminhada } = JSON.parse(body)

            const msg = {
                remetente,
                destinatario,
                assunto,
                corpo,
                respondida,
                encaminhada
            }
            const novaMsg = await Usuarios.create(msg)
            res.writeHead(201, { 'access-control-allow-origin': '*', 'content-type':'application/json; charset=utf-8'})//201 arquivo criado
            return res.end()  

        } catch (error) {
            console.log(error)
        }
    },

}