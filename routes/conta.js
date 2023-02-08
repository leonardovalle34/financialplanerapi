const expres = require("express")

var router = expres.Router()
const conta = require("../models/conta")
const receita = require("../models/receita")

const withAuth = require("../middlewares/auth")


router.get("/contas" , withAuth , async(req,res)=>{
   try{
        let datas = await conta.find({author : req.user._id});
        res.json(datas)
        
    }catch(err){
        res.json(err)
    }
    
})

router.get("/receita" , withAuth , async(req,res)=>{
    try{
         let receitaVar = await receita.find({author : req.user._id});
         res.json(receitaVar)
         
     }catch(err){
         res.json(err)
     }
     
 })

 router.post("/receita" , withAuth , async(req,res)=>{
    
    const Receita = req.body.receita
    let receitaVar = await new receita({receita : Receita , author: req.user._id})

    try{
        await receitaVar.save()
        res.json(receitaVar)
         
     }catch(err){
         res.json(err)
     }
     
 })

 router.put("/receita" , withAuth , async(req,res)=>{
    let user = req.user._id
    let receitaNew = req.body.receita
    try{
         let receitaVar = await receita.findOneAndUpdate(
            {author : user},
            {$set:{receita : receitaNew}},
            {upsert:true , "new": true}
         );
         res.json(receitaVar)
         
     }catch(err){
         res.json(err)
     }
     
 })

router.post("/contas", withAuth, async(req,res)=>{
    const {title , price , desFixo} = req.body
    let contas = new conta({title : title, price : price , desFixo : desFixo, author: req.user._id })

    try{
        await contas.save();
        res.status(200).json(contas)
    }catch(err){
        res.status(500).json({err : "Erro ao criar conta"})
    }
})

router.put("/:id", withAuth, async(req,res)=>{
    const {id} = req.params
    const {title , price , desFixo} = req.body
    const contas = await conta.findById(id)
    try{
        let Contas = await conta.findOneAndUpdate(
            {_id: id},
            {$set:{title: title , price: price}},
            {upsert:true , "new": true}              
        )
        res.json(Contas)
    }catch(err){
        res.status(500).json({err : "Erro ao atualizar conta"})
    }
})

router.get("/:id", withAuth, async(req, res)=>{
    const {id} = req.params
    let contas = await conta.findById(id);
    res.status(200).json(contas)
})

router.delete("/:id", withAuth , async(req, res)=>{
    const {id} = req.params
    let contas = await conta.findByIdAndDelete(id);
    res.status(200).json(contas)
})

router.delete("/", withAuth , async(req, res)=>{
    let contas = await conta.deleteMany({});
    res.status(200).json(contas)
})

const isOwner = (user,conta)=>{
    if(JSON.stringify(user._id)==JSON.stringify(conta.author._id)){
        return true
    }else{
        return false
    }
}

module.exports = router