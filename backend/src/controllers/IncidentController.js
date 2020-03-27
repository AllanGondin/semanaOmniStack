const connection = require('../database/connection');

module.exports = {

    async index (request, response){
    const { page = 1 } = request.query;

    const [count] = await connection('incidents').count();

    console.log(count);

        const incidents = await connection('incidents')
        .join('ongs', 'ong_id', '=', 'incidents.ong_id') //join(table, column, iquals, column another table )
        .limit(5)
        .offset((page - 1) * 5)
        .select([
        'incidents.*', 
        'ongs.name', 
        'ongs.email', 
        'ongs.whatsapp', 
        'ongs.city', 
        'ongs.uf'])//select all incidents data, and some informations on ongs data

        response.header('X-Total_Count', count['count(*)']); //count how much cases i have on the total.
    
        return response.json(incidents);
 
    },
    async create(request, response){
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization; // guarda informações do contexto(autenticação, localização)

        const [id] = await connection('incidents').insert({
            title, 
            description, 
            value,
            ong_id,
        });

        return response.json({ id });
    },

    async delete(request, response){
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();

        if(incident.ong_id !== ong_id){
            return response.status(401).json({error: 'Operation not permitted.'});
        }
        
        await connection('incidents').where('id', id).delete();

        return response.status(204).send();
    }
};