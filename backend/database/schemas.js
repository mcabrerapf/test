'use strict';

var Schema = require('mongoose').Schema;

var kpi = {
    id:   {type: String, required: true, unique: true },
    name: {type: String, required: true, unique: true },
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
    negative: {type: Boolean, required: true, default: false},
    minvalue: {type: Number, required: false},
    score: {
        type: { type: String, required: true, enum: ['no', 'levels', 'distribution', 'formula'] },
        formula: {type: String, required: false, default: ''},
        distribution:  [ Number ],
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
    images: {type: Schema.Types.Mixed, required: false},
    // reparte premio?
    // a quantos? (que budget)
    // reparte regularidad ?
    // a quantos?
};

var notification = {
    date: {type: Date, required: false},
    message: {type: String, required: false}
};

var goal = {
    description:    { type: String, required: false },
    body:           { type: String, required: false },
    slider:         { type: String, required: false },
    notifications:  [ notification, { _id: true }],
    metric:         { type: String, required: true },                       // id de la métrica a la que va asociada el reto
    winmessage:     { type: String, required: false },
    endmessage:     { type: String, required: false },
    type:           { type: String, required: true, enum: ['Points', 'Money']},
    points:         {
        // aqui va una tabla de distribución de puntos!!!!
        topplayers: { type: Number, required: false },
        points:     { type: Number, required: false }
    },
    money:        {
        // aqui va una tabla de distribución de premios!!!!
        budget:             { type: Number, required: false },
        participants:       { type: Number, required: true },
        formula:            { type: String, required: false },
        distributionTable:  [ Number ]
    },
    team:           { type: String, required: false },                      // id del equipo al que va dirigido el reto
    thumbnail:      { type: String, required: false, default: '' }
};


var message = {
    to: {type: String, required: true},
    subject: {type: String, required: true},
    body: {type: String, required: true}
};

var post = {
    description:    { type: String, required: false },
    slider:         { type: String, required: false },
    body:           { type: String, required: true }
};

var timelineevent = {
    title:                      { type: String, required: true },
    type:                       { type: String, required: true, enum: ['Step', 'Goal', 'Message', 'Post', 'Quiz', 'Game']},
    start:                      { type: Date, required: true },
    end:                        { type: Date, required: false },
    data:                       { type: Schema.Types.Mixed, required: true }
};


var level = {
    name: {type: String, required: true},
    thumbnail: {type: String, required: false},
    position: {type: Number, required: true},           // posición en el ranking semanal necesario para conseguir este nivel
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
    team: {type: String, required: false}                           // id del team
};



var team = {
    name: {type: String, required: true},
    alias: {type: String, required: false},
    admin: {type: String, required: true},                              // id d'usuari
    parent: {type: String, required: false, default: ''}                // id del team superior
}


var kpiData = {

    "58775bb9f57de40261f48021": {   // e1

        "llamadas": {
            "j1": 0,
            "j2": 1,
            "j3": 0,
            "j4": 2,
            "j5": 3
        },
        "cumplimiento": {
            "j1": null,
            "j2": null,
            "j3": null,
            "j4": null,
            "j5": null
        }
    },

    "58775bbef57de40261f48022": {   // e2
        "ventas": {
            "j1": null,
            "j2": null,
            "j3": null,
            "j4": null,
            "j5": null
        },
        "objetivo": {
            "j1": 400,
            "j2": 300,
            "j3": 400,
            "j4": 200,
            "j5": 100
        },
        "llamadas": {
            "j1": null,
            "j2": null,
            "j3": null,
            "j4": null,
            "j5": null
        },
        "cumplimiento": {
            "j1": null,
            "j2": null,
            "j3": null,
            "j4": null,
            "j5": null
        }
    },

    "58775bc4f57de40261f48023": {   // e3
        "ventas": {
            "j1": null,
            "j2": null,
            "j3": null,
            "j4": null,
            "j5": null
        },
        "objetivo": {
            "j1": 400,
            "j2": 300,
            "j3": 400,
            "j4": 200,
            "j5": 100
        },
        "llamadas": {
            "j1": null,
            "j2": null,
            "j3": null,
            "j4": null,
            "j5": null
        },
        "cumplimiento": {           // NOTA! ESTOS VALORES SE CALCULAN A PARTIR DE LA CARGA DE LOS OTROS KPIS
            "j1": 0.2,
            "j2": 0.2,
            "j3": 0.1,
            "j4": 0.25,
            "j5": 0.22
        }
    },

    "reto1": {},

    "total": {

    }
}



var schemas = {

    'game': {
        name:                   { type: String, required: true, unique: true },
        theme:                  { type: String, required: true },           // id del theme
        status:                 { type: String, required: true, enum: ['En definición', 'Iniciado', 'Finalizado'], default: 'En definición'},
        budget:                 { type: Number, required: false },
        budgetDistribution:     { type: Schema.Types.Mixed, required: false },
        // desempate
        start:                  { type: Date, required: true },
        end:                    { type: Date, required: false },
        customer:               { type: String, required: true },
        timeline:               [ timelineevent, { _id: true }],
        thumbnail:              { type: String, required: false, default: '' },
        players:                [ player, { _id: true }],
        teams:                  [ team, { _id: true }],
        kpis:                   [ kpi, { _id: true }],
        kpiData:                { type: Schema.Types.Mixed, required: false },
        points:                 { type: Schema.Types.Mixed, required: false },
        winners:                { type: Schema.Types.Mixed, required: false }

    },

    'distribution': {   // de reparto de puntos y premios
        name:               { type: String, required: false, unique: true },
        description:        { type: String, required: false },
        type:               { type: String, required: true, enum: ['Points', 'Money'], default: 'Points'},
        participants:       { type: Number, required: true },
        formula:            { type: String, required: false },
        distributionTable:  [ Number ]
    },

    'theme': {
        name:           { type: String, required: true, unique: true },
        description:    { type: String, required: false },
        timeline:       [ timelineevent, { _id: true }],
        thumbnail:      { type: String, required: false },
        levels:         [ level, { _id: true }]
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
        role: {type: String, required: false},                // admin | player | manager | mentor
        customer: {type: String, required: false},              // id del customer
        lastAccess: {type: Date, required: false},
        employeeIdField: {type: String},                                  // Que campo del extraData contiene el código de empleado
        extraData: [Schema.Types.Mixed, {_id:true}]
    }
}

module.exports = schemas;
