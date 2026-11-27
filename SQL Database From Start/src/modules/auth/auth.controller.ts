import type { Request, Response } from 'express';
import { authService } from './auth.service';
import sendResponse from '../../utils/sendResponse';

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.userLoginIntoDB(req.body);
    const { refreshToken } = result;

    res.cookie('refreshToken', refreshToken, {
      secure: false, //* http -> false, https -> true / in production -> true
      httpOnly: true, //* prevent XSS Attact
      sameSite: 'lax', //* none, strict, lax -> CSRF
      path: '/',
      domain: 'localhost', //* .example.com
    });

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
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error?.message,
      data: error,
    });
  }
};

const genarateToken = async (req: Request, res: Response) => {
  try {
    const result = await authService.generateAccessToken(
      req.cookies.refreshToken,
    );

    console.log(req.cookies.refreshToken);

    if (result) {
      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Access Token Generated successfully',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Users not found',
      });
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: 'Users not found',
      });
    }
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error?.message,
      data: error,
    });
  }
};

export const authController = {
  loginUser,
  genarateToken,
};
