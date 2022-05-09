// module.exports = (req, res, next) => {
//     const min = 60
//     if (req.session.isOnline == true) {
//         req.session.cookie.expires = new Date(Date.now() + min);
//         req.session.cookie.maxAge = min;
//         req.session.save();
//         console.log("if");
//     }
//     // else {
//     //     req.session.cookie.expires = new Date(Date.now() + min);
//     //     req.session.cookie.maxAge = min;
//     //     req.session.isOnline = false;
//     //     console.log("else");
//     // }
//     next();
// }