const express = require('express')
const router = express.Router()
const knex = require('../Database/connection')
const auth = require('../middleware/auth')
const bcrypt = require('bcrypt')
const validator = require('validator')
const { v4: uuidv4 } = require('uuid')

router.get('/sing-in', (req, res) => {
    var error = req.flash('erroLogin')
    error = (error == undefined || error.length == 0) ? undefined : error
    res.render('user/userLogin', {erro: error})
})

router.post('/sing-in', async (req, res) => {
    var { email, senha } = req.body
    
    var user = await knex('usuarios').select().where({email: email})

    if(user[0] != undefined){
        var correct = bcrypt.compareSync(senha, user[0].senha)
        if(correct){
            req.session.user = user[0].username
            res.redirect('/')
        }else{
            var error = `Credenciais Inválidas`
            req.flash('erroLogin', error)
            res.redirect('/sing-in')
        }
    }else{
        var error = `Credenciais Inválidas.`
        req.flash('erroLogin', error)
        res.redirect('/sing-in')
    }
})

router.get('/sing-up', (req, res) => {
    var erro = req.flash("erro")
    var nome = req.flash("nome")
    var email = req.flash("email")
    var numero = req.flash("numero")

    erro = (erro == undefined || erro.length == 0) ? undefined : erro
    nome = (nome == undefined || nome.length == 0) ? undefined : nome
    email = (email == undefined || email.length == 0) ? undefined : email
    numero = (numero == undefined || numero.length == 0) ? undefined : numero

    res.render('user/singup', {erro: erro, nome: nome, email: email, numero: numero})
})

router.post('/sing-up', async (req, res) => {
    var { nome, email, senha, numero } = req.body
    var number = numero.replaceAll('(', '').replaceAll(' ', '').replaceAll(')', '').replaceAll('-', '')
    console.log(`\n\nNome: ${nome}\nEmail: ${email}\nSenha: ${senha}\nNúmero: ${number}`)

    req.flash('nome', nome)
    req.flash('email', email)
    req.flash('numero', numero)

    var exist = await knex.raw(`SELECT * FROM usuarios WHERE username = '${nome}' or email = '${email}' or phone = '${number}'`)
    console.log(exist.rows)

    if(exist[0] == undefined){

        if(validator.isEmail(email)){
            if(validator.isMobilePhone(number, 'pt-BR', true)){
                
                var salt = bcrypt.genSaltSync(10)
                var hash = bcrypt.hashSync(senha, salt)
                var id = uuidv4()

                knex.raw(`INSERT INTO usuarios (username, email, senha, user_id, phone) VALUES ('${nome}', '${email}', '${hash}', '${id}', '${number}')`)
                .then(() => {
                    res.redirect('/sing-in')
                })
                .catch(err => {
                    var error = `Erro ao cadastrar usuario. \n${err}`
                    req.flash('erro', error)
                    res.redirect('/sing-up')
                })


            }else{
                var error = `Erro ao cadastrar usuário. \nNúmero de celular inválido`
                req.flash('erro', error)
                res.redirect('/sing-up')
            }

        }else{
            var error = `Erro ao cadastrar usuário. \nEmail inválido`
            req.flash("erro", error)
            req.flash("email", undefined)
            res.redirect('/sing-up')
        }

    }else{
        var error = `Erro ao Cadastrar Usuário. \nUsuário já cadastrado`
        req.flash("erro", error)
        req.redirect('/sing-up')
    }

    //await knex.raw(`INSERT INTO usuarios ( username, email, senha, user_id, phone ) VALUES ()`)
})

router.get('/logout', (req, res) => {
    req.session.user = undefined
    res.redirect('/')
})

module.exports = router