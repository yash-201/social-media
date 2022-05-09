const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const isauthorized = req.get("Authorization");
        if (!isauthorized) {
            return res.status(401).json({ message: "not authorized please Login" });
        }
        const token = isauthorized.split(' ')[1];
        // console.log(token);
        let decodedToken;
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log(">>>>>> Token Value >>>>>>");
        console.log(decodedToken);
        if (!decodedToken) {
            return res.status(401).json({ message: "not authenticated" })
        }
        req.userId = decodedToken.userId;
        next();
    } catch (err) {
        return res.status(500).json({ message: "something went to wrong" })
    }

}