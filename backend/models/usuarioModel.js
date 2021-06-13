let usuarios = require('../data/usuarios.json')

const { writeDataToFile } = require('../utils')

function findById(email) {//retorna um usuario se achar o email dele no usuarios.json
    return new Promise((resolve, reject) => {
        const usuario = usuarios.find((p) => p.email === email)
        resolve(usuario)
    })
}

function createUser(usuario) {//Cria um novo usuario no sistema
    return new Promise((resolve, reject) => {
        const usrExiste = usuarios.findIndex((p) => p.email === usuario.email)//pega o indice do remetente no json
        if (usrExiste != -1)//Usuário já foi criado
            reject(new Error("Usuário já foi criado"))
        else {
            usuarios.push({ "nome": usuario.nome, "email": usuario.email, "msgsRecebidas": [], "msgsEnviadas": [] })
            if (process.env.NODE_ENV !== 'test') {
                writeDataToFile('./data/usuarios.json', usuarios);
            }
            resolve(usuario)
        }
    })
}

function createMsg(msg) {//Cria uma mensagem enviada do usr remetente e uma msg recebida para o destinatario
    return new Promise((resolve, reject) => {
        const remetente = usuarios.findIndex((p) => p.email === msg.remetente)//pega o indice do remetente no json
        const destinatario = usuarios.findIndex((p) => p.email === msg.destinatario)//pega o indice do destinatario no json.
        if (destinatario != -1) {//entao é pq o email do destinatario já foi cadastrado no sistema
            nomeRemetente = usuarios[remetente]['nome']
            nomeDestinatario = usuarios[destinatario]['nome']
            usuarios[remetente]['msgsEnviadas'].push({ "nome": nomeDestinatario, "destinatario": msg.destinatario, "assunto": msg.assunto, "corpo": msg.corpo, "respondida": msg.respondida, "encaminhada": msg.encaminhada })
            usuarios[destinatario]['msgsRecebidas'].push({ "nome": nomeRemetente, "remetente": msg.remetente, "assunto": msg.assunto, "corpo": msg.corpo, "respondida": msg.respondida, "encaminhada": msg.encaminhada })
        }
        else {//coloca apenas na caixa de msg enviadas do remetente, como o usuario nao foi cadastrado ainda o nome dele é uma string vazia
            nomeRemetente = usuarios[remetente]['nome']
            usuarios[remetente]['msgsEnviadas'].push({ "nome": "", "destinatario": msg.destinatario, "assunto": msg.assunto, "corpo": msg.corpo, "respondida": msg.respondida, "encaminhada": msg.encaminhada })
        }

        if (process.env.NODE_ENV !== 'test') {//escreve no arquivo texto
            writeDataToFile('./data/usuarios.json', usuarios);
        }
        resolve(usuarios[remetente])
    })
}

function removeMsg(msg) {//remove mensagem
    return new Promise((resolve, reject) => {
        const email = usuarios.findIndex((p) => p.email === msg.email)//indice do usuario no json
        if (msg.recebida == true) {//entao é pq está sendo removido das mensagens recebidas
            //msg.indice é o indice da mensagem no array de msg recebidas

            let vetorAux = []

            for (i = 0; i < usuarios[email]['msgsRecebidas'].length; i++) {
                if (usuarios[email]['msgsRecebidas'][i] != usuarios[email]['msgsRecebidas'][msg.indice]) {
                    vetorAux.push(usuarios[email]['msgsRecebidas'][i])//coloca todas as mensagens no vetor, menos a que foi escolhida a ser deletada
                }
            }

            usuarios[email]['msgsRecebidas'] = vetorAux


        }
        else {//entao é pq está sendo removido das mensagens enviadas
            //msg.indice é o indice da mensagem no array de msg enviadas

            let vetorAux = []

            for (i = 0; i < usuarios[email]['msgsEnviadas'].length; i++) {
                if (usuarios[email]['msgsEnviadas'][i] != usuarios[email]['msgsEnviadas'][msg.indice]) {
                    vetorAux.push(usuarios[email]['msgsEnviadas'][i])//coloca todas as mensagens no vetor, menos a que foi escolhida a ser deletada
                }
            }

            usuarios[email]['msgsEnviadas'] = vetorAux


        }
        if (process.env.NODE_ENV !== 'test') {
            writeDataToFile('./data/usuarios.json', usuarios);
        }
        resolve(usuarios[email])
    })

}


module.exports = {
    findById,
    createUser,
    createMsg,
    removeMsg
}