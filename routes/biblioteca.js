const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');


const livrosPath = path.resolve(__dirname, '../database/livros.json') 

function getLivros (){
    return JSON.parse(fs.readFileSync(livrosPath));                                                                                                                                             
}
function saveLivros (Livros) {
    fs.writeFileSync(livrosPath, JSON.stringify(Livros, null,4));
}

router.get('/', (req , res) => {
    res.render('biblioteca', { livros : getLivros() });

});

router.get('/adicionar', (req, res)=> {
    res.render('adicionar-livro');
});


router.post('/', (req, res) =>{
    const livros = getLivros();
    // const novoLivro = { }
    // novoLivro.titulo = req.body.titulo   - Jeito mais 

    livros.push({id: livros.at(-1).id + 1 ,...req.body});
    saveLivros(livros);
    res.redirect('/biblioteca');
});

router.delete('/deletar/:id',(req,res) => {
    const id = req.params.id;
    let livros = getLivros();

    livros = livros.filter(Livro => Livro.id != id);
    saveLivros(livros);
    res.redirect('/biblioteca');
    

})

router.get('/:id/editar',(req,res) =>{
    const id = req.params.id;
    let livros = getLivros();
    let livro = null;
    livros.forEach(element => {
        if (id == element.id) {
            livro = element
        }
    })
    res.render('editarLivro', {livro : livro})

})
router.post('/editar/salvar',(req,res) =>{
    let livros = getLivros();
    livros.forEach(element => {
        if (req.body.id == element.id) {
            element.titulo = req.body.titulo
            element.editora = req.body.editora
        }
    });

    saveLivros(livros);
    res.redirect('/biblioteca')
})



module.exports = router;
