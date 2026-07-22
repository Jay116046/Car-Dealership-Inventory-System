import bcryptjs from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'
import User from '../Model/User.js';

export const register =async (req,res)=>{

    const {userName,email,password}=req.body;

    try{

        const checkUser = await User.findOne({email})
        if(checkUser){
            return res.json({seccess:false,messege:'User already exist with same email! please enter unique email'})
        }

        const hashPassword = await bcryptjs.hash(password,12);
        const newUser = new User({
            userName,
            email,
            password:hashPassword
        })

        await newUser.save();

        res.status(200).json({
            success:true,
            message:"register successfully"
        })

    }catch(e){
      console.log(e);
      
        res.status(500).json({
            success:false,
            message:"some error"
        })
    }
}

// login

export const login =async (req,res)=>{

    const {email,password}=req.body;

    try{

        const checkUser = await User.findOne({email}) ;

        if(!checkUser){
            res.json({
                success:false,
                message:"please register this email first"
            })
        }

        const checkPassword = await bcryptjs.compare(password,checkUser.password)

        if(!checkPassword){
            res.json({
                success:false,
                message:"please enter valid email or password"
            })
        }

        const token = jsonwebtoken.sign({
            id:checkUser._id,
            roll:checkUser.roll,
            email:checkUser.email,
            userName:checkUser.userName
        },'CLIENT_SECRET_KEY',{expiresIn:'60m'})


        res.cookie('token',token,{httpOnly:true,secure:false}).json({
            success:true,
            message:'successfully logged-in',
            user:{
                email:checkUser.email,
                id:checkUser._id,
                roll:checkUser.roll,
                userName:checkUser.userName
            }
        })


    }catch(e){
        res.status(500).json({
            success:false,
            message:"some error"
        })
    }
}




//logout

export const logout = (req,res)=>{
    res.clearCookie('token').json({
        success:true,
        message:"logout successfully"
    });
};


// authcheck

export const authmiddleware = (req,res,next)=>{
    const token = req.cookies.token;
    
    // console.log(token);
    if(!token){        
        res.status(401).json({
            success:false,
            message:"unauthorized user"
        })
    }

    try{
        const decoded = jsonwebtoken.verify(token,'CLIENT_SECRET_KEY');
        req.user = decoded;
        next();
    }catch(e){
        res.status(401).json({
            success:false,
            message:"unauthorized user"
        })
    }

}



