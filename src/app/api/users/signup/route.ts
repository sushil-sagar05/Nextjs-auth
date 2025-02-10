import {connect} from '@/dbConnection/dbConfig'
import User from '@/models/user.model'
import {NextRequest,NextResponse} from 'next/server'
import bcrypt from 'bcryptjs'
import { sendEmail } from '@/helpers/mailer'
connect()

export async function POST(request:NextRequest){
    try {
       const reqBody = await request.json()
       console.log(reqBody)
       const {username,email,password}=reqBody
       // validation
     const user =  await User.findOne({email})
     if(user){
        return NextResponse.json({error: "User Already Exist"},{status:400})
     }
     const salt = bcrypt.genSaltSync(10);
     const hashedPassword = bcrypt.hashSync(password,salt);
     const newUser = new User({
        username,
        email,
        password:hashedPassword
     })
     const savedUser = await newUser.save()
     console.log(savedUser)
     // send verification email
     await sendEmail({email,emailType:"VERIFY",userId:savedUser._id})


        return NextResponse.json({
            message:"User Registered Successfully",
            success:true,
            savedUser
        })


    } catch (error:any) {
        return NextResponse.json({error:error.message},
            {status:500}
        )
    }
}