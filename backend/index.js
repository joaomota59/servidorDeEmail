//node modules - nodemon (deixa o server)
const http = require('http');
const usuario = require('./data/usuarios.json')
const { getUsuario, criaMensagem,deletarMensagem,criaUsuario} = require('./controllers/usuarioController')


const server = http.createServer((request, response) => {

    /*if (request.url === '/api/usuarios' && request.method === 'GET') {//se for uma requisicao para rota usuario e for do tipo GET então..
        response.writeHead(200, { 'Content-Type': 'application/json', 'access-control-allow-origin': '*' }) //muda o codigo para 200 e diz que irá enviar um json na resposta
        //O Access-Control-Allow-Origin no cabeçalho de resposta indica se os recursos da resposta podem ser compartilhados com a origin dada.

        response.end(JSON.stringify(usuario))//Envia no body o json
    }*/
    if (request.url.match(/\/api\/usuarios\/[^\n]+/) && request.method === 'GET') { //rota para verificar se um usuario está cadastrado no bd
        const id = request.url.split('/')[3] //id é o terceiro elemento no slipt /api/usuarios/id (no caso é o email do usuario)
        getUsuario(request, response, id)
    }
    else if(request.url === '/api/usuarios' && request.method === 'POST'){//cria nova mensagem
        
        criaMensagem(request,response)
    }
    else if(request.url === '/api/usuariosDelecao' && request.method === 'POST'){
        deletarMensagem(request,response)
    }
    else if(request.url === '/api/usuariosCadastro' && request.method === 'POST'){
        criaUsuario(request,response)
    }
    /*else if (request.url.match(/\/api\/usuarios\/[^\n]+/) && request.method === 'PUT') { //rota para verificar se um usuario está cadastrado no bd
        const id = request.url.split('/')[3] //id é o terceiro elemento no slipt /api/usuarios/id
        updateUsuario(request, response, id)
    }*/
    else {
        response.writeHead(404, { 'Content-Type': 'application/json' })
        response.end()
    }
})

const PORT = process.env.PORT || 5000


server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))