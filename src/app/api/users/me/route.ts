import {connect} from '@/dbConnection/dbConfig'
import User from '@/models/user.model'
import {NextRequest,NextResponse} from 'next/server'
import bcrypt from 'bcryptjs'
import { getDataFromToken } from '@/helpers/getdataFromToken'
connect()

export async function POST(request:NextRequest){
// extract data from token
   const userId = await getDataFromToken(request)
  const user = await User.findOne({_id:userId}).select("-password")
  if(!user){
   return NextResponse.json({message:"No token Found"})
  }
  return NextResponse.json({
    message:"User Found",
    data:user
  })
}