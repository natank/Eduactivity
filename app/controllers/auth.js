
exports.getSignup = (req, res,next)=>{
    res.render('./auth/signup')
}
exports.getLogin = (req, res,next)=>{
    res.render('./auth/login')
}
exports.getLogout = (req, res,next)=>{
    res.render('./shop/index')
}
exports.postSignup = (req, res,next)=>{
    res.render('./auth/login')
}
exports.postLogin = (req, res,next)=>{
    res.render('./shop/index')
}
exports.postLogout = (req, res,next)=>{
    res.render('./shop/index')
}