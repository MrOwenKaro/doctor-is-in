import pkg from 'jsonwebtoken'


export const verifyToken =  (req,res,next) => {
    const token = req.cookies.token;
    if(!token) return res.status(401).json({msg:"You are not an authorised user"})

    pkg.verify(token, process.env.SECRET, (error,data)=>{
        if(error) return res.status(401).json({msg:"This is an invalid token"})
        req.userId = data.id;
        next()
    })

    
}