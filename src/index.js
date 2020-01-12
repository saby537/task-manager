require('./db/mongoose')
const express = require('express')
const app = express()
const userRouter=require('./routers/user')
const taskRouter=require('./routers/tasks')

const port = process.env.PORT

const multer=require('multer')
const upload=multer({
    dest:'images',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(doc|docx)$/)){
            cb(new Error("Please upload a Word Document"))
        }
        cb(undefined,true)
    }
})
app.post('/upload',upload.single('upload'),(req,res) => {
    res.send()
},(error,req,res,next)=>{
    res.status('400').send({error:error.message})
})

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
/*
const User=require('./models/user')
const main= async()=>{
    const user=await User.findById('5df91fa5540b42613059b3ca')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}
main()*/