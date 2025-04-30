import { NextFunction, Request, Response } from "express";
import jwt, { decode } from "jsonwebtoken";
import { env } from "../env";

import { Admin } from "../https/admin/auth/model/admin.model";

import { Device } from "../https/admin/auth/model/device.model";
import { statusEnum } from "../https/common/enums";


// export const verifyToken = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): void => {
//   (async () => {
//     try {
//       // Your existing logic
//       next();
//     } catch (error) {
//       res.status(401).json({ message: "Unauthorized" });
//     }
//   })();
// };

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const bearerToken = req.headers["authorization"];
  let token = null;
  if (bearerToken) {
    token = bearerToken.split(" ")[1];
  }

  if (!token) {
    res.status(401).send({
      status: false,
      message: "Unauthorized",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.auth.secret);

    if (typeof decoded !== "string") {
      if (req.baseUrl.indexOf("/api/admin") != -1) {
        const admin: any = await Admin.findOne({
          _id: decoded.id,
        })
        if (!admin) {
           res.status(401).json({
            status: false,
            message: req.t("user.user_not_found"),
          });
        }
        if (admin.roleId == null) {
           res.status(401).json({
            status: false,
            message: req.t("user.user_not_found"),
          });
        }
        if (admin.status == statusEnum.INACTIVE) {
           res.status(401).json({
            status: false,
            message: req.t("user.user_inactive"),
          });
        }

        if (admin.deletedAt != null) {
           res.status(401).json({
            status: false,
            message: req.t("user.user_deleted"),
          });
        }
      }

      const device = await Device.findOne({
        authToken: token,
      });

      if (!device) {
        throw "Invalid Token";
      }
      req.body.auth = {
        token: token,
        device: device,
        user: device.userId,
        roleId: decoded.roleId,
      };
    } else {
      throw "user not found";
    }
  } catch (err) {
     res.status(401).send({
      status: false,
      message: "Unauthorized",
    });
  }
  return next();
};

export const verifyResetToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.query.token;

    if (!token || typeof token !== "string") {
       res.status(401).send({
        status: false,
        message: req.t("user.invalid_reset_link"),
      });
      return;
    }

    const decoded = jwt.verify(token as string, env.auth.secret);
    if (typeof decoded === "string") {
       res.send({
        status: false,
        message: req.t("user.link_expired"),
      });
    }

    const admin = await Admin.findOne({
      forgotPasswordToken: token,
    });

    if (!admin) {
       res.send({
        status: false,
        message: req.t("user.link_expired"),
      });
    }

    req.body.auth = {
      token: token,
      admin: admin,
    };

    next();
  } catch (err) {
     res.send({
      status: false,
      message: req.t("user.invalid_reset_link"),
    });
  }
};

// export const verifySellerResetToken = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const token = req.query.token;

//     if (!token || typeof token !== "string") {
//        res.status(401).send({
//         status: false,
//         message: req.t("user.invalid_reset_link"),
//       });
//     }

//     const decoded = jwt.verify(token, env.auth.secret);
//     if (typeof decoded === "string") {
//        res.send({
//         status: false,
//         message: req.t("user.link_expired"),
//       });
//     }

//     const seller = await Seller.findOne({
//       forgotPasswordToken: token,
//     });

//     if (!seller) {
//        res.send({
//         status: false,
//         message: req.t("user.link_expired"),
//       });
//     }

//     req.body.auth = {
//       token: token,
//       seller: seller,
//     };

//     next();
//   } catch (err) {
//      res.send({
//       status: false,
//       message: req.t("user.invalid_reset_link"),
//     });
//   }
// };

// export const verifySocketToken = async (token: string) => {
//   try {
//     const decoded = jwt.verify(token, env.auth.secret);

//     const device = await Device.findOne({
//       authToken: token,
//     })

//     if (!device) {
//       throw "Invalid Token";
//     }

//     return { decoded };
//   } catch (error: any) {
//     return error;
//   }
// }
