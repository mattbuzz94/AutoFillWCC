(function() {

    var p_environment = document.getElementById('p_environment');
    var solucao_cliente_text_area = document.getElementById('id_solucao_cliente'); 
    var id_funcionario = document.getElementById('p_anal_suporte');  

    if(p_environment !== null){
        if(p_environment.value == ""){
            p_environment.value = '17111';/**10 - Production LATAM */
        }     
    if(id_funcionario !== null){
        if(id_funcionario.value != '7015'){
            id_funcionario.value = '7015'/**Matheus Philipe Maciel Rodrigues */
        }
    }
        console.log('encontrado!');
    }else{
        console.log('ambiente não encontrado!');
    }

    if(solucao_cliente_text_area !== null){
        var text = solucao_cliente_text_area.value;
        var data = new Date().toLocaleDateString();
        if(isEmptyString(text)){
            text=  'Matheus Maciel '+data;
            text+= '\n\n';
            text+= 'Causa-Raiz: \n\n';
            text+= 'Contingência: \n\n';
            text+= 'Solução: \n';

            solucao_cliente_text_area.value = text;
        }
    }

    function isEmptyString(string){
        if(!string || string.length === 0 || !string.trim()){
            console.log('esta vazio ou somente contem espaço');

            return true;
        }
    }XMLDocument

})();