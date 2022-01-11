const express = require("express");
const app = express();
const port =  process.env.PORT || 8080;

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/assets', express.static(__dirname + 'public/assets'));

app.set('views', './views');
app.set('view engine', 'ejs');


//Faz com que salve o arquivo em "uploads/" com o nome original do arquivo, data e extensão do arquivo

app.get("/", function(req, res){
    res.render('index');
});


app.listen(port, () => {
    console.log(`=====> Servidor rodando na porta: ${port}`);
});