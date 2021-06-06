let usuarios = require('../data/usuarios.json')

const { writeDataToFile } = require('../utils')

function findById(email) {//retorna um usuario se achar o email dele no usuarios.json
    return new Promise((resolve, reject) => {
        const usuario = usuarios.find((p) => p.email === email)
        resolve(usuario)
    })
}

function create(msg){
    return new Promise((resolve, reject) => {
        const remetente = usuarios.findIndex((p) => p.email === msg.remetente)//pega o indice do remetente no json
        const destinatario = usuarios.findIndex((p) => p.email === msg.destinatario)//pega o indice do destinatario no json
        nomeRemetente = usuarios[remetente]['nome']
        usuarios[remetente]['msgsEnviadas'].push({"destinatario":msg.destinatario, "assunto": msg.assunto, "corpo": msg.corpo })
        usuarios[destinatario]['msgsRecebidas'].push({"nome":nomeRemetente,"remetente":msg.remetente, "assunto": msg.assunto, "corpo": msg.corpo, "respondida": msg.respondida, "encaminhada": msg.encaminhada})

        if (process.env.NODE_ENV !== 'test') {
            writeDataToFile('./data/usuarios.json', usuarios);
        }
        resolve(usuarios[destinatario])
    })
}


module.exports = {
    findById,
    create
}