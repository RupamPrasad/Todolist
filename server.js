const express=require("express");

const bodyParser=require("body-parser");

const mongoose= require("mongoose");

const app=express();

app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'ejs'); //ejs embedded javascript templating

app.use(express.static('public'));

const uri="mongodb://127.0.0.1:27017/todolistDB";

mongoose.connect(uri,{ useNewUrlParser: true ,useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);

const itemSchema ={
    
    name:String,
};

const Item =mongoose.model("item",itemSchema);

const item1= new Item({
    name:"Welcome to your Todolist!",
});

const item2= new Item({
    name:"Hit the + button to add a new item",
});

const item3= new Item({
    name:"<-- Check this if done",
});


app.get("/",function(req,res){



    var date = new Date();

    var options={
        weekday:"long",
        day:"2-digit",
        month:"long"
    };

    var Day= date.toLocaleString("en-US",options);
    
    Item.find({},function(err,itemRes){
        
        if(itemRes.length==0)
        {

            Item.insertMany([item1,item2,item3],function(err){
            if(err)
                console.log("error occured");
            else
                console.log("added succesfully");
            });

        res.redirect("/");
        }
        else
        {
            res.render('index',{currentDay:Day,itemAdd:itemRes});
        }
    });
    
    
});

app.post("/delete",function(req,res){

    var DelteItem=req.body.checkbox;    

    Item.findByIdAndRemove(DelteItem,function(err){
       if(!err)
        {
            console.log("successfully deleted");
        }
    });

    res.redirect("/");
    
});

app.post("/",function(req,res){
    
    var NewItem=req.body.newItem;
    
    const Newitem= new Item({
        name:NewItem
    }); 

    Newitem.save();
    res.redirect("/");
});


app.listen(2008,function(){

    console.log("server started listening to port 3001");
});