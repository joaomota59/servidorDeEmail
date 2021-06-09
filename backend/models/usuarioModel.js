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
        nomeDestinatario = usuarios[destinatario]['nome']
        usuarios[remetente]['msgsEnviadas'].push({"nome":nomeDestinatario,"destinatario":msg.destinatario, "assunto": msg.assunto, "corpo": msg.corpo,  "respondida": msg.respondida, "encaminhada": msg.encaminhada})
        usuarios[destinatario]['msgsRecebidas'].push({"nome":nomeRemetente,"remetente":msg.remetente, "assunto": msg.assunto, "corpo": msg.corpo, "respondida": msg.respondida, "encaminhada": msg.encaminhada})

        if (process.env.NODE_ENV !== 'test') {
            writeDataToFile('./data/usuarios.json', usuarios);
        }
        resolve(usuarios[destinatario])
    })
}

function remove(msg){
    return new Promise((resolve, reject) => {
        const email = usuarios.findIndex((p) => p.email === msg.email)//indice do usuario no json
        if(msg.recebida == true){//entao é pq está sendo removido das mensagens recebidas
            //msg.indice é o indice da mensagem no array de msg recebidas

            let vetorAux = []

            for(i=0;i<usuarios[email]['msgsRecebidas'].length;i++){
                if(usuarios[email]['msgsRecebidas'][i] != usuarios[email]['msgsRecebidas'][msg.indice]){
                    vetorAux.push(usuarios[email]['msgsRecebidas'][i])//coloca todas as mensagens no vetor, menos a que foi escolhida a ser deletada
                }
            }

            usuarios[email]['msgsRecebidas'] = vetorAux

            
        }
        else{//entao é pq está sendo removido das mensagens enviadas
            //msg.indice é o indice da mensagem no array de msg enviadas

            let vetorAux = []

            for(i=0;i<usuarios[email]['msgsEnviadas'].length;i++){
                if(usuarios[email]['msgsEnviadas'][i] != usuarios[email]['msgsEnviadas'][msg.indice]){
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
    create,
    remove
}