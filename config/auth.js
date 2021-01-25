import jwt from 'jsonwebtoken'
export default async (req , res , next) => {
     const authHeader = req.get('Authorization');
     if(!authHeader) {
         req.isAuth = false;
         next();
     }
     const token = authHeader.split(' ')[1];
     if(!token || token === '') {
         req.isAuth = false
         next();
     }

     let decodedToken;

     try {
         decodedToken = jwt.verify(token , process.env.JWT_SECRET);
         if(!decodedToken) {
             req.isAuth = false;
             next();
         }
         req.isAuth = true;
         req.userId = decodedToken.userId
         return next();
     } catch (err) {
         req.isAuth = false
         next();
     }
}