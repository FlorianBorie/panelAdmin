let db, config

// Le require() envoie une fonction envoyant la class Members
// Permettant de définir des constantes dans le module venant du fichier principal
module.exports = (_db, _config) => {
    db = _db
    config = _config
    return Members
}

let Members = class {

    // Envoie un client via son ID
    static getByID(id) {

        return new Promise((next) => {

            db.query('SELECT * FROM personnes WHERE id = ?', [id])
                .then((result) => {
                    if (result[0] != undefined)
                        next(result[0])
                    else
                        next(new Error(config.errors.wrongID))
                })
                .catch((err) => next(err))

        })

    }

    // Envoie tous les membres (avec un maximum optionnel)
    static getAll(max) {

        return new Promise((next) => {

            if (max != undefined && max > 0) {
                db.query('SELECT * FROM members LIMIT 0, ?', [parseInt(max)])
                    .then((result) => next(result))
                    .catch((err) => next(err))
            } else if (max != undefined) {
                next(new Error('Wrong max value'))
            } else {
                db.query('SELECT * FROM personnes')
                    .then((result) => next(result))
                    .catch((err) => next(err))

            }
        })

    }

    // Ajoute un client
    static add(nom, prenom, mail, tel) {

        return new Promise((next) => {

            if (nom != undefined && nom.trim() != '' && prenom != undefined && prenom.trim() != '' && mail != undefined && mail.trim() != '' && tel != undefined && tel.trim() != '') {

                nom = nom.trim()
                prenom = prenom.trim()
                mail = mail.trim()
                tel = tel.trim()

                db.query('SELECT * FROM personnes WHERE mail = ?', [mail])
                    .then((result) => {
                        if (result[0] != undefined) {
                            next(new Error(config.errors.mailAlreadyTaken))
                        } else {
                            return db.query('INSERT INTO members(nom, prenom, mail, tel) VALUES(?,?,?,?)', [nom, prenom, mail, tel])
                        }
                    })
                    .then(() => {
                        return db.query('SELECT * FROM members WHERE nom = ?, prenom = ?, mail = ?, tel = ?', [nom, prenom, mail, tel])
                    })
                    .then((result) => {
                        next({
                            id: result[0].id,
                            nom: result[0].nom,
                            prenom: result[0].prenom,
                            mail: result[0].mail,
                            tel: result[0].tel
                        })
                    })
                    .catch((err) => next(err))

            } else {
                next(new Error(config.errors.noNameValue))
            }

        })

    }

    // Modifie le nom d'un membre via son ID
    static update(id, nom, prenom, mail, tel) {

        return new Promise((next) => {

            if (nom != undefined && nom.trim() != '' && prenom != undefined && prenom.trim() != '' && mail != undefined && mail.trim() != '' && tel != undefined && tel.trim() != '') {

                nom = nom.trim()
                prenom = prenom.trim()
                mail = mail.trim()
                tel = tel.trim()

                db.query('SELECT * FROM personnes WHERE id = ?', [id])
                    .then((result) => {
                        if (result[0] != undefined) {
                            return db.query('SELECT * FROM personnes WHERE mail = ? AND id != ?', [mail, id])
                        } else {
                            next(new Error(config.errors.wrongID))
                        }
                    })
                    .then((result) => {
                        if (result[0] != undefined) {
                            next(new Error(config.errors.sameName))
                        } else {
                            return db.query('UPDATE members SET nom = ?, prenom = ?, mail = ?, tel = ? WHERE id = ?', [nom, prenom, mail, tel, id])
                        }
                    })
                    .then(() => next(true))
                    .catch((err) => next(err))

            } else {
                next(new Error(config.errors.noNameValue))
            }

        })

    }

    // Supprime un membre via son ID
    static delete(id) {

        return new Promise((next) => {

            db.query('SELECT * FROM personnes WHERE id = ?', [id])
                .then((result) => {
                    if (result[0] != undefined) {
                        return db.query('DELETE FROM personnes WHERE id = ?', [id])
                    } else {
                        next(new Error(config.errors.wrongID))
                    }
                })
                .then(() => next(true))
                .catch((err) => next(err))

        })

    }

}