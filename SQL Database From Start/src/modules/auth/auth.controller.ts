import type { Request, Response } from 'express';
import { authService } from './auth.service';

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.userLoginIntoDB(req.body);

    if (result) {
      res.status(201).json({
        success: true,
        message: 'Profile created successfully',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Users not found',
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

export const authController = {
  loginUser,
};
