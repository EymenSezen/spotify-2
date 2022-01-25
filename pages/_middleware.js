import { getToken } from "next-auth/jwt"; 
import { NextResponse  } from "next/server";
export async function middleware(req){
    //TOKEN IS EXIST IF USER IS LOGGED IN 
    const token=await getToken({req,secret:process.env.JWT_SECRET});
    const {pathname}=req.nextUrl
    
    //ALLOW THE REQUEST IF THE FOLLOWING IS TRUE
    //1)ITS A REQUEST FOR NEXT-AUTH SESSION &PROVIDER FETCHING
    //2)THE TOKEN EXISTS
    if(pathname.includes('/api/auth')||token){
        return NextResponse.next();
    }
    //redirect them to login if they dont have token and are requesting a protected route
    if(!token&&pathname!=="/login")
    {
        return NextResponse.redirect("/login")
    }
}