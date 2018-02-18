(function() {

    var p_environment = document.getElementById('p_environment');
    var solucao_cliente_text_area = document.getElementById('id_solucao_cliente'); 
    var tipo_chamado = document.getElementById('id_tipo_chamado');
    var id_funcionario = document.getElementById('p_anal_suporte');
    var comentario_interno = document.getElementById('p_coment_suporte');  

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
        if(isEmptyString(text)&& tipo_chamado !== 'Consultoria Online'){
            text=  'Matheus Maciel '+data;
            text+= '\n\n';
            text+= 'Causa-Raiz: \n\n';
            text+= 'Contingência: \n\n';
            text+= 'Solução Definitiva: \n';

            solucao_cliente_text_area.value = text;
        }
        if(isEmptyString(text) && tipo_chamado !== 'Consultoria Online'){
            text=  'Matheus Maciel '+data;
            text+= '\n\n';
            text+= 'Necessidade do Cliente: \n\n';
            text+= 'Análise da Consultoria: \n\n';
            text+= 'Solução Definitiva: \n';
            solucao_cliente_text_area.value = text;
        }
        if (isEmptyString(text) && tipo_chamado !== 'Dúvida'){
            text=  'Matheus Maciel '+data;
            text+= '\n\n';
            text+= 'Necessidade do Cliente: \n\n';
            text+= 'Solução Proposta: \n';
            solucao_cliente_text_area.value = text;
        }
    }
    if(comentario_interno !== null){
        var text1 = comentario_interno.value;
        text1+= '#RCA \n\n';
        text1+= 'Item: \n\n';
        text1+= 'Descrição: \n\n';
        text1+= 'Motivo: \n\n';
        text1+= 'Sugestão: \n\n';
        text1+= 'Tipo Sugestão: \n\n';
        text1+= 'Mês referência: \n\n';
        text1+= 'Sugestão aceita: \n\n';
        text1+= 'Status: \n\n';
        text1+= 'Data Prevista: \n\n';
        text1+= 'Comentários: \n\n';
        comentario_interno.value = text1;

    }
    function isEmptyString(string){
        if(!string || string.length === 0 || !string.trim()){
            console.log('esta vazio ou somente contem espaço');

            return true;
        }
    }XMLDocument

})();