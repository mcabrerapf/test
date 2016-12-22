// --------------------------------------------------------------------------------------
//  Middleware específico de la collection 'customers'
// --------------------------------------------------------------------------------------

'use strict';

var Users = require('../database/database').models['user'];
var Teams = require('../database/database').models['team'];


module.exports = {

    collectionRoutes: [
        {path: 'tree.parent.get', middleware: getTree, detail: false}
    ],

};

function getTree(req, res, next) {
    console.log(req.body.parent);
    Teams.find({parent: ''}).lean().exec(function (err, teams) {
        if (err) {
            return res.status(400).send(err);
        }
        getChilds(teams).then(function (tree) {
            return res.status(200).send(tree);
        }, function (err) {
            console.log('err', err);
            return res.status(400).send(err);
        })
    })
}


// --------------------------------------------------------------------------------------

function getChilds(parentTeams) {

    return new Promise(function (resolve, reject) {
        var promises = [];
        parentTeams.forEach(function (team) {
            promises.push(new Promise(function (resolve, reject) {
                    Teams.find({parent: team._id}).lean().exec(function(err, childTeams){
                        if(childTeams.length){
                            getChilds(childTeams).then(function(teams){
                                team.items = teams;
                                resolve(team)
                            });
                        } else {
                            team.items = [];
                            console.log(team);
                            resolve(team)
                        }
                    })
                }
            ))
        })

        Promise.all(promises).then(function (teams) {
            resolve(teams)
        }, function (err) {
            reject(err)
        })
    })
}
