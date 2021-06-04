var btnLogin = document.getElementById("btn-login")//quando apertar no botao de login

btnLogin.addEventListener("click", function() {//Escuta os eventos do botão... Quando o botão é clicado

    var ourRequest = new XMLHttpRequest()//estabelece a conexao e recebe DATA
    let inputValor = document.getElementById("email").value// recebe o email do usuario digitado no campo
    ourRequest.open('GET',`http://localhost:5000/api/usuarios/${inputValor}`)
    ourRequest.send()
    ourRequest.onload = function () {
        if (this.readyState == 4 && this.status == 200) {// 4: request finished and response is ready / se recebeu a resposta da requisição entao..
            var para = new URLSearchParams();
            para.append("email", inputValor);
            window.location.href = './home.html?'+para.toString()
            window.alert(this.responseText);
        }
        else {//caso o usuario nao esteja no bd
            window.alert("Usuário não cadastrado!");
            window.location.href = './index.html'
            //var para = new URLSearchParams();
            //para.append("email", inputValor.toString());
            //window.location.href = './404.html?'+para.toString()
            //window.location.href = './404.html' 
          }
    };

    ourRequest.onerror = function () {//Caso aconteça erro ao solicitar do servidor
        window.location.href = './404.html'
    };


})
