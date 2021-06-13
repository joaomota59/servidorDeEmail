var btnCadastroConta = document.getElementById("btn-2")//quando apertar no botao de login
var btnEntrar = document.getElementById("btn")//quando apertar no botao de login
flagNovaDivCadastroUsuario = false


btnCadastroConta.addEventListener("click", function () {
    let inputValorEmail = document.getElementById("email").value// recebe o email do usuario digitado no campo
    btnEntrar.style.display = 'none';
    btnCadastroConta.innerText = "Cadastrar"

    if (!flagNovaDivCadastroUsuario){
        document.getElementsByClassName('input-group')[0].insertAdjacentHTML('beforeBegin', ` <div class="input-group"><span class="input-group-addon"><i class="icon_profile"></i></span><input id='nome' type="text" class="form-control" placeholder="Nome" autofocus></div>`)
        document.getElementsByClassName('login-form')[0].insertAdjacentHTML('afterbegin',`<a href="./index.html" class="input-wrap" title="Voltar para tela de Login"><i class=" arrow_carrot-left_alt2"></i></a>`)
    }
        flagNovaDivCadastroUsuario = true


    let inputNome = document.getElementById("nome").value// recebe o nome do usuario digitado no campo
    if (inputValorEmail == '' || inputNome == '') {
        window.alert("Digite email e nome do usuário que deseja cadastrar!");
        return
    }
    else if (inputValorEmail.search("@") == -1) {
        window.alert("Endereço de email inválido.\nTente novamente!");
        return
    }

    let ourRequest = new XMLHttpRequest()//estabelece a conexao e recebe DATA
    ourRequest.open('POST', `http://localhost:5000/api/usuariosCadastro`)
    ourRequest.send(JSON.stringify(//cadastra o usuario com os parametros passados
        {
            "nome": inputNome,
            "email": inputValorEmail,
        }))
    ourRequest.onreadystatechange = function () { // Chama a função quando o estado mudar.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 201) {//se der bom é pq conseguiu criar o usuário
            window.alert("Usuário foi criado com sucesso!")
            window.location.reload()
        }
        else if(this.readyState === XMLHttpRequest.DONE && this.status === 404){
            window.alert("Usuário já foi criado.\nTente outro login")
        }
    }
    ourRequest.onerror = function () {//Caso aconteça erro ao solicitar do servidor
        window.location.href = './404.html'
    };


})

flag = false;
btnEntrar.addEventListener("click", function () {
    flag = true
    return
})


function onClickLogin() {

    if (flag == false)//se entrou aqui é pq clicou no botao de cadastrar
        return
    var ourRequest = new XMLHttpRequest()//estabelece a conexao e recebe DATA
    let inputValor = document.getElementById("email").value// recebe o email do usuario digitado no campo
    if (inputValor == '') {
        window.alert("Entre com algum usuário válido!");
        flag = false
        return
    }
    else if (inputValor.search("@") == -1) {
        window.alert("Endereço de email inválido.\nTente novamente!");
        flag = false
        return
    }

    ourRequest.open('GET', `http://localhost:5000/api/usuarios/${inputValor}`)
    ourRequest.onload = function () {
        if (this.readyState == 4 && this.status == 200) {// 4: request finished and response is ready / se recebeu a resposta da requisição entao..
            window.alert('Bem-Vindo!')
            var para = new URLSearchParams();
            para.append("email", inputValor);
            window.location.href = './home.html?' + para.toString()
        }
        else {//caso o usuario nao esteja no bd
            window.alert("Usuário não cadastrado!");
            flag = false
            //window.location.href = './index.html'
            //var para = new URLSearchParams();
            //para.append("email", inputValor.toString());
            //window.location.href = './404.html?'+para.toString()
            //window.location.href = './404.html' 
        }
    };

    ourRequest.onerror = function () {//Caso aconteça erro ao solicitar do servidor
        window.location.href = './404.html'
    };

    ourRequest.send()

}