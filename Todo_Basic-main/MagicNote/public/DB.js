const connectionstring= `mongodb+srv://Prince:1234@notesjs.6dbfpki.mongodb.net/?retryWrites=true&w=majority&appName=NotesJS`;
const mongoose=require(`mongoose`);


mongoose.connect(connectionstring).then(()=> console.log(`DB CONNECTED`)).catch((err)=>console.log(err))

const TaskSchema=new mongoose.Schema({
    notes: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    
    // TaskSchema is a schema and we will create a model of this before exporting;

});
const Task=mongoose.model("Task",TaskSchema);

const signup = new mongoose.Schema({
    userId: { 
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String,
        required: true
    },
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
});

const signupCredentials = mongoose.model("signupCredentials", signup);

module.exports= {
    Task:Task,
    signupCredentials: signupCredentials
}