const express = require('express')
const router = express.Router()
const knex = require('../Database/connection')
const auth = require('../middleware/auth')

router.get('/admin', auth, async (req, res) => {
    if(req.session.user != 'Amanda Adm'){
        res.redirect('/')
    }else{
        var product = await knex('produtos').select()
        var error = req.flash("erroLogin")
        error = (error == undefined || error.length == 0) ? undefined : error
        res.render('adm/admHome', {products: product, erro: error})
    }
})

router.get('/login', async (req, res) => {
    var error = req.flash("erroLogin")
    error = (error == undefined || error.length == 0) ? undefined : error
    res.render('adm/login', {erro: error})
})

router.post('/loginAdm', async (req, res) => {
    var { email, senha } = req.body
    console.log(email + ' ' + senha)
    var adm = await knex.raw(`SELECT email, username, id FROM adm WHERE email = '${email}' and senha = '${senha}'`)
    console.log(adm.rows)
    if(adm.rows[0] != undefined){
        req.session.user = adm.rows[0].username
        res.redirect('/admin')
    }else{
        var error = `Credenciais Incorretas`
        req.flash('erroLogin', error)
        res.redirect('/login')
    }
})

router.get('/adc-product', auth, (req, res) => {
    if(req.session.user != 'Amanda Adm'){
        res.redirect('/')
    }else{
        res.render('adm/adcProdutos')
    }
})

router.post('/adcProduct', auth, async (req, res) => {
    if(req.session.user != 'Amanda Adm'){
        res.redirect('/')
    }else{
        var { nomeProduto, precoProduto, descProduto } = req.body

        var preco = precoProduto.replaceAll(',', '.')

        console.log(`\n\n${nomeProduto}\n${preco}\n${descProduto}\n`)

        await knex.raw(`INSERT INTO produtos (nome, preco, composition) VALUES ('${nomeProduto}', ${preco}, '${descProduto}')`)
        .then(() =>{
            console.log('Produto Inserido com sucesso')
            var error = `Produto Adicionado`
            req.flash('erroLogin', error)
            res.redirect('/admin')
        })
        .catch(error => console.log(error))
    }
       
})

router.post('/deleteProduct', auth, async (req, res) => {
    console.log(req.session.user)
    if(req.session.user != 'Amanda Adm'){
        res.redirect('/')
    }else{
        var { id } = req.body;
        console.log('Deletando o produto com id: ' + id)
        await knex.raw(`DELETE FROM produtos WHERE product_id = ${id}`)
        .then(() => console.log('Produto Deletado!'))
        .catch(error => { console.log(error) })
    }
})

router.get('/editProduct/:id', auth, async (req, res) => {
    if(req.session.user != 'Amanda Adm'){
        res.redirect('/')
    }else{
        var { id } = req.params
        var teste = await knex('produtos').select().where({product_id: id})
        console.log(teste)
        res.render('adm/editProdutos', {id: id, nome: teste[0].nome, desc: teste[0].composition, preco: teste[0].preco})
    }
})

router.post('/editProduct', auth, async (req, res) => {
    if(req.session.user != 'Amanda Adm'){
        res.redirect('/')
    }
    var { id, nomeProduto, precoProduto, descProduto } = req.body
    var preco = precoProduto.replaceAll(',', '.')
    await knex.raw(`UPDATE produtos SET nome = '${nomeProduto}', preco = ${preco}, composition = '${descProduto}' WHERE product_id = '${id}'`)
    .then(() => {
        console.log('Dados Atualizados')
        res.redirect('/admin')
    })
    .catch(error => console.log(error))
})

router.get('/logoutAdm', (req, res) => {
    req.session.user = undefined;
    var error = `Sessão Encerrada`
    req.flash('erroLogin', error)
    res.redirect('/login')
})

module.exports = router