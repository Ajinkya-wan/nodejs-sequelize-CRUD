const express = require('express');
const db = require('../config/database');
const Products = require('../models/products');
const Sequelize = require('sequelize');
const Op = Sequelize.Op

const router = express.Router();

router.get('/' , (req,res)=>{
    Products.findAll()
        .then(Products => {
            console.log(Products , "hellll");
            res.render('products',{Products});
        })
        .catch(err => console.log(err.message))
});

//Display add product form
router.get('/add', (req, res) => res.render('add'));


//Add a product
router.post('/add' , (req,res)=>{

 let {title , technologies, budget , description , contact_email} = req.body ;
let errors =[];

if(!title){
    errors.push({text :'please add a title'});
}
    if(!technologies){
        errors.push({text :'please add a technologies'});
    }

    if(!description){
        errors.push({text :'please add a description'});
    }

    if(!contact_email){
        errors.push({text :'please add a email'});
    }

    //check for errors
    if(errors.length>0){
res.render('add',{errors,title , technologies, budget , description , contact_email})
    }else{
     if(!budget){
         budget='Unknown'
     }else {
         budget = `$${budget}`
     }

     //Make lowercase and remove space after comma
     technologies = technologies.toLowerCase().replace(/,/g,',');

        //Insert into table
        Products.create({
            title,
            technologies,
            description,
            budget,
            contact_email
        })
            .then(products => res.redirect('/products'))
            .catch(err=>console.log(err))

    }



})

//Search Request
router.get('/search',(req,res)=>{
   let { term } = req.query;

   //Make Lowercase
   term =term.toLowerCase();

   Products.findAll({where :{
       technologies : {[Op.like]:'%'+term+'%' }
   }}).then(Products=>res.render('products', {Products}))
     .catch(err=>console.log(err.message))
})


module.exports=router;
