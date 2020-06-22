const express = require('express');
const { response } = require('express');
const servidor = express()

servidor.use(express.json())

servidor.use((request, response, next) => {
  console.log('Controle de Estoque da Empresa ABC.')
  return next()
});

const produtos = [
 
]


function checarSeIdExiste(request, response, next) {
  const id = request.params.id
  const existe = produtos.filter( produto => produto.id == id)
  if(existe.length === 0) {
    return response.status(400).json({ erro: 'Não existe Produto com este id.' })
  }
  return next()
}

function checarCampos(request, response, next) {
  const { id, produto_name, quant_prod, val_unit } = request.body;
  if((id === undefined ) || (produto_name === undefined) || (quant_prod === undefined ) || (val_unit === undefined )) {
    return response.status(400).json({ erro: 'O campo id do produto ou nome do produto ou quantidade ou valor unitario ou complemento não existe no corpo da requisição' })
  }
  return next()
}

function calcProd(produto) {
  for (let i = 0; i < produto.length; i++) {
    produto[i].Total = produto[i].quant_prod * produto[i].val_unit
    produto[i].Venda = produto[i].val_unit * 1.2
    produto[i].lucro = produto[i].Venda - produto[i].val_unit
    if (produto[i].quant_prod < 50) {
      produto[i].situacao = 'A situação do produto é estável'
    } else if (produto[i].quant_prod >= 50 && produto[i].quant_prod < 100
    ) {
      produto[i].situacao = 'A situação do produto é boa'
    } else if (produto[i].quant_prod >= 100) {
      produto[i].situacao = 'A situação do produto é excelente'
    }
  }
}

servidor.get('/produtos', (request, response) => {
  calcProd(produtos)
  return response.json(produtos)
})

servidor.get('/produtos/:id', checarSeIdExiste, (request, response) => {
  const id = request.params.id
  const Produto_especifico = produtos.find( produto => produto.id == id )
  return response.json(Produto_especifico)
});

servidor.post('/produtos', checarCampos, (request, response) => {
  produtos.push(request.body)
  const Produto_final = produtos[produtos.length - 1]
  calcProd(produtos)
  return response.json(Produto_final)
})

servidor.put('/produtos', checarCampos, (request, response) => {
  const id = request.body.id
  let indice = 0
  let Produto_especifico = produtos.filter( (produto, index) => {
    if(produto.id === id) {
      indice = index
      return produto.id === id
    }
  })

  if(Produto_especifico.length === 0) {
    return response.status(400).json({ erro: 'Não existe produto com este id'})
  }
  produtos[indice] = request.body
  return response.json(produtos)
})


servidor.delete('/produtos',(request, response) => {
  const id = request.body.id
  const Produto_especifico = produtos.find( (produto, index) => {
    if(produto.id === id) {
      console.log(produto)
      produtos.splice(index, 1)
      return produto.id === id
    }
  })
  if(!Produto_especifico) {
    return response.status(400).json({ erro: 'Não existe produto com este id'})
  }

  return response.json(produtos)
})

servidor.post('/produtos/:id/complemento', checarSeIdExiste, (request, response) => {
  const complementos = request.body.complemento
  const id = request.params.id;
  for(let i = 0; i < produtos.length; i++) {
    if(produtos[i].id === Number(id)) {
      console.log(typeof produtos[i].complemento)
      produtos[i].complemento.push(complementos)
    }
  }
  return response.json(produtos)
})

servidor.listen(3333);
