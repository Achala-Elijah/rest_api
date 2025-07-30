import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import fs from 'fs/promises'
import { DB } from "../libs/Constants.js"

export const register = async (req, res) => {
    //check if user exist
    const user = req.body
    try{
        const data = await fs.readFile(DB, 'utf8')
        const users = JSON.parse(data)
        const userExist = !!(users.filter(element => user.username === element.username)).length
        if(userExist){
            return res.status(409).send("User already exist!")
        }
        
        const hashedPassword = bcrypt.hashSync(user.password, 10)

        //add user to the file database
        users.push({...user, password: hashedPassword, id: users.length})
        const newData = JSON.stringify(users)
        await fs.writeFile(DB, newData)

        return res.status(200).send("User successfully registered!")

    }catch(err){
        console.log(err)
        res.status(500).send("Server side error!")
    }
}






export const login = async (req, res) => {
    const user = req.body
    //check user if user exist
    const data = await fs.readFile(DB, 'utf8')
    const users = JSON.parse(data)
    let userdb = (users.filter(element => user.username === element.username))

    if(!userdb.length){
        return res.status(404).send("User not found!")
    }
    userdb = userdb[0]
    

    //check password
    const isPasswordValid = bcrypt.compareSync(user.password, userdb.password)

    if(!isPasswordValid){
        return res.status(404).send("Invalid username or password!")
    }

    //generate token
    const token = jwt.sign({id: userdb.id}, process.env.JWT_TOKEN, { expiresIn: "15m" })

    res.cookie("access_token", token, {httpOnly: true}).status(200).send("Login successful")

    }





    export const profile = async (req, res) => {
        const id = req.userId
        //check user
        const data = await fs.readFile(DB, 'utf8')
        const users = JSON.parse(data)
        let userdb = (users.filter(element => id === element.id))
        

        if(!userdb.length){
            return res.status(404).send("User not found!")
        }
        userdb = userdb[0]        
    
        //get user data excluding password
        const {password, ...other} = userdb
    
        res.status(200).json(other)
    
        }
    

        


export const logout = (req, res) => {
    res.clearCookie("access_token").status(200).json("User logged out")
}