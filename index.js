let express=require('express');
let app=express()
let port=2000;
let mongoose=require('mongoose')
let bcryptjs=require('bcryptjs')
let cors=require('cors')
app.use(cors({
    methods:['POST','GET','PUT','DELETE'],
    origin:'*'
}))
app.use(express.json())
let url="mongodb+srv://root:root@cluster0.fxpqzae.mongodb.net/?appName=Cluster0"
mongoose.connect(url).then(()=>{
    console.log('Db connected..')
}).catch((err)=>{
    console.log(err)
})
let collection=mongoose.model('gopi-sdlc',{
    email:{
        type:String,
        unique:true,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

app.post("/",async(req,res)=>{
    try{
        let {email,username,password}=req.body;
        let hashedCode=await bcryptjs.hash(password,10)
        let data=new collection({email,username,password:hashedCode})
        await data.save()
        res.status(201).json({msg:"user info saved",data})
    }catch(err){
        res.status(500).json({msg:err})
    }
})
app.post("/login",async(req,res)=>{
    try {
        let {email,password}=req.body;
        let existingEmail=await collection.findOne({email})
        console.log(existingEmail)
        if(!existingEmail){
            res.status(404).json({msg:"No user registered"})
        }
        else{
            let match=await bcryptjs.compare(password,existingEmail.password)
            if(!match){
                res.status(409).json({msg:"Password Wrong"})
            }
            else{
                res.status(200).json({msg:"Login successfull"})
            }
        }
    } catch (error) {
        res.status(500).json({msg:error.message})
    }
})
app.get("/",async(req,res)=>{
    try {
        let data=await collection.find()
        res.status(200).json({msg:"data getting",data})
    } catch (error) {
        res.status(500).json({msg:error})
    }
})
app.listen(port,()=>{
    console.log('Server running on',port)
})