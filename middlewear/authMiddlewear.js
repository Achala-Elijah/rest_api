import jwt from "jsonwebtoken"


export const authMiddlewear = (req, res, next) => {
    const token = req.cookies.access_token
    try{
        if (!token) {
            return res.status(401).send("Access token missing.");
        }

        jwt.verify(token, process.env.JWT_TOKEN, (err, payload) => {
            if(err){
                console.log(err)
                return res.status(403).send("Not authorized!")
            }
            if(payload.id !== 0 && !payload.id){
                return res.status(403).send("Not authorized!")
            }
            req.userId = payload.id
            next()
        })

    }catch(err){
        console.log(err)
        res.status(500).send("Server side error!")
    }


}