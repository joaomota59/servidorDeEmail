const http = require('http');
const usuario = require('./data/usuarios.json')

const server = http.createServer((request,response)=>{
    response.writeHead(200,{'Content-Type':'application/json'}) //codigo 200 e enviado um json na resposta
    response.end(JSON.stringify(usuario))
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))