var btnResposta = "" //define como global

var params = new URLSearchParams(window.location.search);
emailParms = params.get('emailRem');


var ourRequest = new XMLHttpRequest()//estabelece a conexao e recebe DATA
ourRequest.open('GET', `http://localhost:5000/api/usuarios/${emailParms}`)
ourRequest.send()

ourRequest.onload = function () {
    if (this.readyState == 4 && this.status == 200) {// 4: request finished and response is ready / se recebeu a resposta da requisição entao..
        var ourData = JSON.parse(this.responseText); //le o txt mas filta no formato JSON separando cada objeto do array
        renderHTML(ourData);
    }
    else {//caso nao esteja no bd
        window.alert("Não foi achado mensagens");
    }

    ourRequest.onerror = function () {//Caso aconteça erro ao solicitar do servidor
        window.location.href = './404.html'
    };


}


function renderHTML(data) {
    let nome, destinatario, assunto, corpo
    for (i = 0; i < data['msgsEnviadas'].length; i++) { //array de objetos
        if (data['msgsEnviadas'][i].encaminhada === true) {// Se a msg foi encaminhada add ENC no titulo
            nome = data['msgsEnviadas'][i].nome
            destinatario = data['msgsEnviadas'][i].destinatario
            assunto = "ENC: " + data['msgsEnviadas'][i].assunto
            corpo = data['msgsEnviadas'][i].corpo
        }
        else if (data['msgsEnviadas'][i].respondida === true) {//Se a msg foi respondida add RES no titulo
            nome = data['msgsEnviadas'][i].nome
            destinatario = data['msgsEnviadas'][i].destinatario
            assunto = "RES: " + data['msgsEnviadas'][i].assunto
            corpo = data['msgsEnviadas'][i].corpo
        }
        else {
            nome = data['msgsEnviadas'][i].nome
            destinatario = data['msgsEnviadas'][i].destinatario
            assunto = data['msgsEnviadas'][i].assunto
            corpo = data['msgsEnviadas'][i].corpo
        }

        myFunction(nome, destinatario, assunto, corpo, i)

    }


}




function myFunction(nomeEntrada, emailDestinatario, tituloEntrada, mensagemEntrada, indice) {
    var table = document.getElementById("table_id");
    var row = table.insertRow(1);
    var nome = row.insertCell(0);
    var email = row.insertCell(1);
    var titulo = row.insertCell(2);
    var actions = row.insertCell(3);
    nome.innerHTML = nomeEntrada;
    email.innerHTML = emailDestinatario;
    titulo.innerHTML = tituloEntrada
    actions.innerHTML = `<a href="#" onclick="return verMensagem(\`` + nomeEntrada + `\`,\`` + emailDestinatario + `\`,\`` + tituloEntrada + `\`,\`` + mensagemEntrada + `\`);" class="view" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Visualizar">visibility</i></a> <a href="#" onclick = "return modalDelecao(\`` + indice + `\`)"; class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Deletar">&#xE872</i></a>  <a href="#" onclick="return encaminharMensagem(\`` + tituloEntrada + `\`,\`` + mensagemEntrada + `\`);" class="forward" data-toggle="modal"><span title="Encaminhar" class="material-icons">east</span></a> <a href="#" onclick="return responderMensagemModal(\`` + tituloEntrada + `\`,\`` + emailDestinatario + `\`)"; class="answer"><span class="material-icons" title="Responder">reply</span></a>`
}

function verMensagem(nomeEntrada, emailDestinatario, titulo, mensagemEntrada) {
    mensagemCompleta = "Destinatário(a): " + nomeEntrada + '</br>' + "E-mail: " + emailDestinatario + "</br></br></br>Assunto:<strong> " + titulo + '</strong></br></br></br>Corpo: ' + mensagemEntrada

    document.getElementsByClassName("modal-body")[0].innerHTML = mensagemCompleta
    $('#ModalLongoExemplo').modal('show')//abre o modal com a mensagem
}


function encaminharMensagem(titulo, mensagemEntrada) {
    var params = new URLSearchParams(window.location.search),
        remetente = params.get("emailRem");

    emailDest = window.prompt("Encaminhamento de mensagem\nSua mensagem selecionada será encaminhada!\nDigite o email do Destinatário:")
    if (emailDest != null && emailDest != '') {//se tiver algo na caixa de entrada entao encaminha o email para o destinatario correspondente
        let ourRequest = new XMLHttpRequest()//estabelece a conexao e recebe DATA
        ourRequest.open('POST', `http://localhost:5000/api/usuarios`)
        ourRequest.send(JSON.stringify(
            {
                "remetente": remetente,
                "destinatario": emailDest,
                "assunto": titulo,//ok
                "corpo": mensagemEntrada,//ok
                "respondida": false,//ok
                "encaminhada": true//ok
            }));

        window.alert("Mensagem Encaminhada!")
        window.location.reload()
    }
    else if (emailDest == '') {
        window.alert("Entre com um e-mail antes de enviar!")
    }
    else {//Então é pq apertou no botao de cancelar, nao faz nada

    }
}


function responderMensagemModal(titulo, emailDestinatario) {
    $('#ModalMsgRespondida').modal('show')//abre o modal com a mensagem

    if (!document.getElementById("envioDeResposta")) {//cria o elemento se nao existir
        document.getElementById("modal-footer")
            .insertAdjacentHTML('beforeend',
                `<button id="envioDeResposta" onclick="msgResposta(\`` + titulo + `\`,\`` + emailDestinatario + `\`)" type="button" class="btn btn-success">Enviar</button>`)
    }
    else {
        document.getElementById("envioDeResposta").remove()//remove o elemento se já existir
        document.getElementById("modal-footer")
            .insertAdjacentHTML('beforeend',
                `<button id="envioDeResposta" onclick="msgResposta(\`` + titulo + `\`,\`` + emailDestinatario + `\`)" type="button" class="btn btn-success">Enviar</button>`)

    }

}

function msgResposta(titulo, emailDestinatario) {
    //ENVIA A RESPOSTA DA MENSAGEM

    var mensagem = document.getElementById("form-control").value;

    if (mensagem != null && mensagem != '') {// null siginica botao de cancelar e '' é mensagem vazia
        var params = new URLSearchParams(window.location.search),
            remetente = params.get("emailRem");//remetente é pego pelo query
            emailDestinatario = remetente

        let ourRequest = new XMLHttpRequest()//estabelece a conexao e recebe DATA
        ourRequest.open('POST', `http://localhost:5000/api/usuarios`)
        ourRequest.send(JSON.stringify(
            {
                "remetente": remetente,
                "destinatario": emailDestinatario,
                "assunto": titulo,//ok
                "corpo": mensagem,//ok
                "respondida": true,//ok seta para true, respondida
                "encaminhada": false//ok
            }))

        window.alert("Mensagem Enviada!")
        window.location.reload()
    }
    else if (mensagem == '') {
        window.alert("Entre com alguma mensagem de reposta antes de enviar!")
    }
}

function modalDelecao(indice) {
    $('#ModalMsgDeletada').modal('show')//abre o modal com a mensagem

    if (!document.getElementById("delecao")) {//cria o elemento se nao existir
        document.getElementById("modal-footer2")
            .insertAdjacentHTML('beforeend',
                `<button id="delecao" onclick="msgDelecao(\`` + indice + `\`)" type="button" class="btn btn-danger">Sim</button>`)
    }
    else {
        document.getElementById("delecao").remove()//remove o elemento se já existir
        document.getElementById("modal-footer2")
            .insertAdjacentHTML('beforeend',
                `<button id="delecao" onclick="msgDelecao(\`` + indice + `\`)" type="button" class="btn btn-danger">Sim</button>`)

    }
}

function msgDelecao(indice) {//email do login atual + recebida true se for das msg recebidas, false é mensagens enviadas, indice da pos da msg escolhida
    var params = new URLSearchParams(window.location.search),
        email = params.get("emailRem");//remetente é pego pelo query


    let ourRequest = new XMLHttpRequest()//estabelece a conexao e recebe DATA
    ourRequest.open("POST", "http://localhost:5000/api/usuariosDelecao")
    ourRequest.send(JSON.stringify(
        {
            "email": email.toString(),
            "recebida": false,
            "indice": parseInt(indice)
        }))
    window.alert("Mensagem excluída com sucesso!")
    window.location.reload()


}

function backToHome(){
    var params = new URLSearchParams(window.location.search),
    remetente = params.get("emailRem");
    
    var para = new URLSearchParams();
    para.append("email", remetente);
    window.location.href = `./home.html?`+para.toString()
}



