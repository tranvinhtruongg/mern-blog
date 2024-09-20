import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'

// dang ky
export const signup = async (req,res,next)=>{
    const {username,email,password}=req.body;

    if(!username || !email || !password || username=== '' || email=== '' || password=== ''){
        next(errorHandler(400,'Vui lòng nhập hết tất cả mục'))
    }
    
    const hasedPassword = bcryptjs.hashSync(password,10)
    
    const newUser =new User({
        username,
        email,
        password:hasedPassword,
    })
    

    try{
        await newUser.save();
        res.json('Đăng nhập thành công');
    }
    catch(err){
        next(err)
    }

}

//dang nhap

export const signin = async(req,res,next)=>{
    const {email,password} = req.body
    if(!email || !password || email==='' || password===''){
        next(errorHandler(400,'Vui lòng nhập'))
    }
    try{
        const validUser = await User.findOne({email})
        if(!validUser){
            return next(errorHandler(404,'Không có tên người dùng này'))
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
          return next(errorHandler(400, 'Mật khẩu không chính xác!'));
        }
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc
        res.status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest)
    }
    catch(err){
        next(err)
    }
}

export const google = async(req,res,next)=>{
    const {email,name,googlePhotoUrl} = req.body
    try{
        const user = await User.findOne({email})
        if(user){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            const {password,...rest} = user._doc
            res.status(200).cookie('access_token',token,{
                httpOnly:true
            }).json(rest)
        }else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const hashedPassword = bcryptjs.hashSync(generatedPassword,10)
            const removeVietnameseTones = (str) => {
                return str
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/đ/g, 'd')
                    .replace(/Đ/g, 'D');
            };

            const newUser = new User({
                username: removeVietnameseTones(name.toLowerCase().split(' ').join('')) + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            });
            await newUser.save()
            const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET);
            const {password,...rest} = newUser._doc;
            res
            .status(200)
            .cookie('access_token',token,{
                httpOnly:true
            })
            .json(rest)
        }
    }
    catch(err){
        next
    }
}