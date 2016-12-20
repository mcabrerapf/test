'use strict';

var Schema = require('mongoose').Schema;

var kpi = {
    id: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    type: {type: String, required: true, enum: ['calculated', 'loaded']},
    calculated: {
        numerator: {type: String, required: true},        // id del KPI que se utilizará para el cálculo
        denominator: {type: String, required: true}         // id del KPI que se utilizará para el cálculo
    },
    loaded: {
        aggregateformula: {type: String, required: true, enum: ['sum', 'avg']}
    },
    comments: {type: String, required: false},
    definition: {type: String, required: false},
    displayformat: {type: String, required: false, default: '#.##0,0'},
    thumbnail: {type: String, required: false, default: ''},
    negative: {type: Boolean, required: true, default: false},
    minvalue: {type: Number, required: false},
    ranking: {
        type: {
            type: String,
            required: true,
            enum: ['No ranking', 'Niveles de ranking', 'Esquema de puntos', 'Formula']
        },
        formula: {type: String, required: false, default: ''},
        esquema: {type: String, required: false},       // id del esquema de puntos que aplica
        levels: {
            upLevelPoints: {type: Number, required: false},
            downLevelPoints: {type: Number, required: false},
            equalLevelPoints: {type: Number, required: false}
        }
    }
};

var step = {
    description: {type: String, required: false},
    location: {
        address: {type: String, required: false},
        longitud: {type: Number, required: false},
        latitud: {type: Number, required: false}
    },
    images: {type: Schema.Types.Mixed, required: false}
};

var notification = {
    date: {type: Date, required: false},
    message: {type: String, required: false}
};

var goal = {
    description: {type: String, required: false},
    notifications: [notification, {_id: true}],
    metric: {type: String, required: true},       // id de la métrica a la que va asociada el reto
    winmessage: {type: String, required: false},
    endmessage: {type: String, required: false},
    type: {type: String, required: true, enum: ['points', 'direct', 'collective']},
    points: {
        topplayers: {type: Number, required: false},
        points: {type: Number, required: false}
    },
    direct: {
        topplayers: {type: Number, required: false},
        promocode: {type: String, required: false}
    },
    collective: {
        value: {type: Number, required: false},
        positive: {type: Boolean, required: false, default: true},
        promocode: {type: String, required: false}
    },
    team: {type: String, required: false},      // id del equipo al que va dirigido el reto
    thumbnail: {type: String, required: false, default: ''}
};


var message = {
    to: {type: String, required: true},
    subject: {type: String, required: true},
    body: {type: String, required: true}
};

var post = {
    body: {type: String, required: true}
};

var timelineevent = {
    name: {type: String, required: true},
    type: {type: String, required: true, enum: ['Step', 'Goal', 'Message', 'Post', 'Quiz', 'Game']},
    start: {type: Date, required: true},
    data: {type: Schema.Types.Mixed, required: true}
};


var level = {
    name: {type: String, required: true},
    thumbnail: {type: String, required: false},
    position: {type: Number, required: true},
    description: {type: String, required: false}
    // data??
};

var player = {
    user: {
        user: {type: String, required: true},                         // id del usuario (users collection)
        employeeId: {type: String, required: true}
    },
    alias: {type: String, required: false},
    level: {type: String, required: true, default: 0},
    points: {type: Number, required: true, default: 0},
    results: {type: Schema.Types.Mixed, required: false},
    agreement: {
        accepted: {type: Boolean, required: true, default: false},
        date: {type: Date, required: false}
    },
    team: {type: String, required: false}       // id del team
};



var team = {
    name: {type: String, required: true},
    alias: {type: String, required: false},
    admin: {type: String, required: true},      // id d'usuari
    parent: {type: String, required: false, default: ''}         // id del team superior
}

var code = {
    sellerCode: {type: String, required: true},
    teamLeader: {type: String, required: false}
}


var schemas = {

    'game': {
        name: {type: String, required: true, unique: true},
        theme: {type: String, required: true},           // id del theme
        status: {
            type: String,
            required: true,
            enum: ['En definición', 'Iniciado', 'Finalizado'],
            default: 'En definición'
        },
        budget: {type: Number, required: false},
        // desempate
        start: {type: Date, required: true},
        end: {type: Date, required: false},
        customer: {type: String, required: true},
        timeline: [timelineevent, {_id: true}],
        thumbnail: {type: String, required: false, default: ''},
        players: [player, {_id: true}],
        teams: [team, {_id: true}],                             // teams & rankings
        results: {type: Schema.Types.Mixed, required: false},
        premios: {type: Schema.Types.Mixed, required: false}
    },

    'turn': {
        name: {type: String, required: false}
    },

    'kpi': kpi,

    'distribution': {   // de reparto de puntos y premios
        name: {type: String, required: false, unique: true},
        description: {type: String, required: false},
        type: {type: String, required: true, enum: ['Points', 'Prize'], default: 'Points'},
        participants: {type: Number, required: true},
        formula: {type: String, required: false},
        distributionTable: [Number]
    },

    'retos': {
        name: {type: String, required: false}
    },

    'premios': {
        name: {type: String, required: false}
    },

    'theme': {
        // define completamente un juego
        // Es la plantilla que contiene información sobre las etapas,
        // mensajes, retos, niveles, reparto de puntos, metricas, etc.
        // se puede guardar completamente la información consolidada
        // sobre un único registro o crear más tablas adicionales
        name: {type: String, required: true, unique: true},
        description: {type: String, required: false},
        timeline: [timelineevent, {_id: true}],
        thumbnail: {type: String, required: false},
        levels: [level, {_id: true}]
    },

    'customer': {
        name: {type: String, required: true, unique: true},
        logo: {type: String, required: false},
        admin: {type: String, required: false},           // ??? Id del usuario
    },

    'user': {
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        userName: {type: String, required: true},
        active: {type: Boolean, required: true, default: true},
        photo: {type: String, required: false},
        role: {type: [String], required: false},                // admin | player | manager | mentor
        customer: {type: String, required: false},              // id del customer
        lastAccess: {type: Date, required: false},
        employeeIdField: {String},                                  // Que campo del extraData contiene el código de empleado
        extraData: [Schema.Types.Mixed, {_id:true}]
    }
}

module.exports = schemas;
