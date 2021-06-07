var btnResposta = "" //define como global

var params = new URLSearchParams(window.location.search);
emailParms = params.get('emailRem');


var ourRequest = new XMLHttpRequest()//estabelece a conexao e recebe DATA
ourRequest.open('GET',`http://localhost:5000/api/usuarios/${emailParms}`)
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
    let nome, remetente, assunto, corpo
    for (i = 0; i < data['msgsRecebidas'].length; i++) { //array de objetos

        if(data['msgsRecebidas'][i].encaminhada === true){// Se a msg foi encaminhada add ENC no titulo
            nome = data['msgsRecebidas'][i].nome
            remetente = data['msgsRecebidas'][i].remetente
            assunto = "ENC: "+ data['msgsRecebidas'][i].assunto
            corpo = data['msgsRecebidas'][i].corpo
        }
        else if(data['msgsRecebidas'][i].respondida === true){//Se a msg foi respondida add RES no titulo
            nome = data['msgsRecebidas'][i].nome
            remetente = data['msgsRecebidas'][i].remetente
            assunto = "RES: "+ data['msgsRecebidas'][i].assunto
            corpo = data['msgsRecebidas'][i].corpo
        }
        else{
            nome = data['msgsRecebidas'][i].nome
            remetente = data['msgsRecebidas'][i].remetente
            assunto = data['msgsRecebidas'][i].assunto
            corpo = data['msgsRecebidas'][i].corpo
        }
        
        myFunction(nome,remetente,assunto,corpo)
    
    }   


}




function myFunction(nomeEntrada, emailRementente , tituloEntrada, mensagemEntrada) {
var table = document.getElementById("table_id");
var row = table.insertRow(1);
var nome = row.insertCell(0);
var email = row.insertCell(1);
var titulo = row.insertCell(2);
var actions = row.insertCell(3);
nome.innerHTML = nomeEntrada;
email.innerHTML = emailRementente;
titulo.innerHTML = tituloEntrada
actions.innerHTML = `<a href="#" onclick="return verMensagem(\``+nomeEntrada+`\`,\``+emailRementente+`\`,\``+tituloEntrada+`\`,\``+mensagemEntrada+`\`);" class="view" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Visualizar">visibility</i></a> <a href="#deleteEmployeeModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Deletar">&#xE872</i></a>  <a href="#" onclick="return encaminharMensagem(\``+tituloEntrada+`\`,\``+mensagemEntrada+`\`);" class="forward" data-toggle="modal"><span title="Encaminhar" class="material-icons">east</span></a> <a href="#" onclick="return responderMensagemModal(\``+tituloEntrada+`\`,\``+emailRementente+`\`)"; class="answer"><span class="material-icons" title="Responder">reply</span></a>`
}

function verMensagem(nomeEntrada,emailRementente,titulo,mensagemEntrada){
    mensagemCompleta = "Remetente: "+nomeEntrada+'</br>'+"E-mail: "+emailRementente+"</br></br></br>Assunto:<strong> "+titulo+'</strong></br></br></br>Corpo: '+mensagemEntrada

    document.getElementsByClassName("modal-body")[0].innerHTML = mensagemCompleta
    $('#ModalLongoExemplo').modal('show')//abre o modal com a mensagem
}


function encaminharMensagem(titulo,mensagemEntrada){
    var params = new URLSearchParams(window.location.search),
    remetente = params.get("emailRem");

    emailDest = window.prompt("Encaminhamento de mensagem\nSua mensagem selecionada será encaminhada!\nDigite o email do Destinatário:")
    if (emailDest != null && emailDest != '') {//se tiver algo na caixa de entrada entao encaminha o email para o destinatario correspondente
        let ourRequest = new XMLHttpRequest()//estabelece a conexao e recebe DATA
        ourRequest.open('POST',`http://localhost:5000/api/usuarios`)
        ourRequest.send(JSON.stringify(
            { 
            "remetente": remetente,
            "destinatario": emailDest,
            "assunto": titulo,//ok
            "corpo":mensagemEntrada,//ok
            "respondida":false,//ok
            "encaminhada":true//ok
        }));

        window.alert("Mensagem Enviada!")
    }
    else if(emailDest == ''){
        window.alert("Entre com um e-mail antes de enviar!")
    }
    else{//Então é pq apertou no botao de cancelar, nao faz nada
        
    }
}

flagResponde = false//renderiza somente uma vez a construção do elemento DOM (botao de enviar mensagem) em cada div
function responderMensagemModal(titulo,emailDestinatario){
    if (flagResponde === false){
    flagResponde = true
    document.getElementById("modal-footer")
    .insertAdjacentHTML('beforeend',
    `<button id="envioDeResposta" onclick="msgResposta(\``+titulo+`\`,\``+emailDestinatario+`\`)" type="button" class="btn btn-success">Enviar</button>`)
    $('#ModalMsgRespondida').modal('show')//abre o modal com a mensagem
    }
    else{
        $('#ModalMsgRespondida').modal('show')//abre o modal com a mensagem
    }
}

function msgResposta(titulo, emailDestinatario){
            //ENVIA A RESPOSTA DA MENSAGEM
            var mensagem = document.getElementById("form-control").value;

            if(mensagem!=null && mensagem!=''){// null siginica botao de cancelar e '' é mensagem vazia
            var params = new URLSearchParams(window.location.search),
            remetente = params.get("emailRem");//remetente é pego pelo query
    
            let ourRequest = new XMLHttpRequest()//estabelece a conexao e recebe DATA
            ourRequest.open('POST',`http://localhost:5000/api/usuarios`)
            ourRequest.send(JSON.stringify(
                { 
                "remetente": remetente,
                "destinatario": emailDestinatario,
                "assunto": titulo,//ok
                "corpo":mensagem,//ok
                "respondida":true,//ok seta para true, respondida
                "encaminhada":false//ok
            }))
    
            window.alert("Mensagem Enviada!")
        }
        else if(mensagem == ''){
            window.alert("Entre com alguma mensagem de reposta antes de enviar!")
        }
        else{//é pq o usuario clicou em cancelar
            
        }
}



