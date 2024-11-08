const {Task,signupCredentials} = require('./public/DB');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {jwtMiddleware,generatetoken}=require('./public/jwt');

app.use(bodyParser.json());

app.use(express.static("./public"));

app.get('/getAll',jwtMiddleware ,async (req, res) => {
    const userId=req.user;
    // console.log(userId);
    try{
        const tasks= await signupCredentials.findOne({ userId: userId }).populate('notes');
        // console.log(tasks);
        res.json(tasks);
    }catch(err){
        console.log(err)
    }
})

app.post('/takenote',jwtMiddleware,async(req, res) => {
    
    try{

        const { notes }  = req.body;
        const userId=req.user;
        // console.log(userId);
        // const tasks=await Task.create({notes, status: false });
        const just_added_TASK = await Task.create({ notes, status: false });
        // The value of promise returned is stored in just_added_TASK
        // When the Promise returned by Task.create is resolved, it returns the newly created and saved document. 

        await signupCredentials.findOneAndUpdate(
            {userId:userId},
            { $push:{notes:just_added_TASK._id}}
        );
        res.end('DONE');
    }catch(err){
        console.log(err);
    }
})

app.post('/signup',async(req,res)=>{
    try{
        const {userId, password}=req.body;
        const existingUser = await signupCredentials.findOne({ userId });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }
        const newuser=new signupCredentials({userId, password});
        await newuser.save();
        const token=generatetoken({userId});
        // console.log(token);
        res.end(token);
    }catch(err){
        console.log(err);
    }
})

app.post('/login' ,async (req, res) => {
    try {
      const { userId, password } = req.body;
      const user = await signupCredentials.findOne({ userId });
  
      if (!user) {
        return res.status(401).send('Invalid username ');
      }
  
      if (user.password !== password) {
        return res.status(401).send('Invalid password');
      }
  
      const token=generatetoken(userId);
      res.json({token});
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
  });

app.delete('/deletenote/:id',jwtMiddleware, async(req, res) => {
    // console.log('hi');
    const noteid = req.params.id;
    const userId=req.user;

try{
const task=await Task.findOneAndDelete({ _id: noteid });
await signupCredentials.findOneAndUpdate(
    { userId: userId },
    { $pull: { notes:noteid } }
);
res.json({task})
}catch(err){
    console.log(err)
}
})

app.patch('/updatenote/:id', jwtMiddleware,async (req, res) => {
    const id = req.params.id;
    const userId=req.user;
    const updatedNote = req.body.notes;
    try{
        const task=await Task.findByIdAndUpdate(id,{notes:updatedNote});
        res.json({task});

    }catch(err){
        console.log(err)
    }

})

app.patch('/updatestatus/:id',jwtMiddleware, async(req, res) => {
    const id = (req.params.id);

    try{
        const cs = await Task.findById({_id:id});
        const st=!(cs.status);
        const task=await Task.findByIdAndUpdate(id,{status: st });
        res.json(task);

    }catch(err){
        console.log(err)
    }


})



app.listen(8000, () => {
    console.log('Magic Note Server Started ');
})