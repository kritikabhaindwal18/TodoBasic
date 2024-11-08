const secret='12345';
const jwt = require('jsonwebtoken');

const jwtMiddleware=(req,res,next)=>{

    const authorization=req.headers.authorization;
    if(!authorization)return res.status(401).json({error:'Unauthorized'});

    const token=req.headers.authorization.split(' ')[1];

    if(!token) return res.status(401).json({error:'Unauthorized'});

    try{
        const userId= jwt.verify(token,secret);
        // after verify the token verify fn returns the payload

        req.user=userId;
        console.log(req.user);  
        next();
    }catch(err){
        // console.log(err);
        res.status(401).json({error:"Invalid Token"});
    }
}

const generatetoken =(userId)=>{
    return jwt.sign(userId,secret);
}

module.exports={jwtMiddleware,generatetoken};