import jwt from "jsonwebtoken";

export const verifyJwt = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  //   Check if token start with "Bearer "
  if (!authHeader?.startWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  //   Get the token
  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    process.env.SECRET,
    (err, decoded) => {
        if(err) {
            return res.status(403).json({ success: false, error: "Forbidden" })
        }

        req.user = decoded.userId,
        req.role = decoded.role
        next()
    }
  )
};
