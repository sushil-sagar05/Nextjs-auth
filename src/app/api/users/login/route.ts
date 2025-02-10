import {connect} from '@/dbConnection/dbConfig'
import User from '@/models/user.model'
import {NextRequest,NextResponse} from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

connect()
export async function POST(request:NextRequest){
   try {
    const reqBody = await request.json()
    const {email,password} = reqBody
    const user = await User.findOne({email})
    if(!user){
        return NextResponse.json({error: "User Doesnot Exist"},{status:400})
    }
    console.log("user exists ")
   const Validpassword = await bcrypt.compare(password,user.password)
   if(!Validpassword){
    return NextResponse.json({error: "Check your credentials"},{status:400})
   }
   const tokenData = {
    id:user._id,
    username:user.username
   }
   const token = await jwt.sign(tokenData,process.env.TOKEN_SECRET!,{expiresIn:'1d'})
   const response = NextResponse.json({
    message:"Logged In Success",
    success:true
   })
   response.cookies.set("token",token,{
    httpOnly:true
   })
   return response
   } catch (error:any) {
    return NextResponse.json({error:error.message},
        {status:500}
    )
   }
}