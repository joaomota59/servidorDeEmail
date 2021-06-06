
(function ($) {
    "use strict";

    
    /*==================================================================
    [ Validate ]*/
    var email = $('.validate-input input[name="email"]');
    var subject = $('.validate-input input[name="subject"]');
    var message = $('.validate-input textarea[name="message"]');


    $('.validate-form').on('submit',function(){
        var check = true;


        if($(subject).val().trim() == ''){
            showValidate(subject);
            check=false;
        }


        if($(email).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
            showValidate(email);
            check=false;
        }

        if($(message).val().trim() == ''){
            showValidate(message);
            check=false;
        }

        if(check == true){//Então é pq passou no formulário
            var params = new URLSearchParams(window.location.search),
            remetente = params.get("emailRem");

            window.alert(remetente)


            let ourRequest = new XMLHttpRequest()//estabelece a conexao e recebe DATA
            ourRequest.open('POST',`http://localhost:5000/api/usuarios`)
            ourRequest.send(JSON.stringify(
                { 
                "remetente": remetente,
                "destinatario": $(email).val().trim(),
                "assunto": $(subject).val().trim(),
                "corpo":$(message).val().trim(),
                "respondida":false,
                "encaminhada":false
            }));

            window.alert("Mensagem Enviada!")
            
            
            window.history.back()//volta para a página antiga


        }

        return check;
    });


    $('.validate-form .input1').each(function(){
        $(this).focus(function(){
           hideValidate(this);
       });
    });

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    

})(jQuery);


function remetenteParm(){
var params = new URLSearchParams(window.location.search),
remetente = params.get("emailRem");

var para = new URLSearchParams();
para.append("emailRem", remetente);
window.location.href = `./enviarMensagem.html?`+para.toString()
}

function backToHome(){
    var params = new URLSearchParams(window.location.search),
    remetente = params.get("emailRem");
    
    var para = new URLSearchParams();
    para.append("email", remetente);
    window.location.href = `./home.html?`+para.toString()
}