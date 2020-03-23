const express = require ('express');

const app = express();

app.get('/', (request, response)=>{
    return response.json({
        evento: 'Semana OmniStack 11.0',
        aluno: 'Allan Gondin',
        Poder: 'Terra',
        Habilidade: 'Controla toda terra ao redor'
    });
});

app.listen(3333);
