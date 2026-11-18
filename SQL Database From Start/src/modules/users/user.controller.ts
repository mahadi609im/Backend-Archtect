import type { Request, Response } from 'express';
import { userService } from './user.service';

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDb(req.body);

    res.status(201).json({
      success: true,
      message: 'Users Data created',
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsersFromDB();

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await userService.getSingleUserFromDb(id as string);

    if (result.rowCount) {
      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: result.rows[0],
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

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.updateUserFromDB(req.body, id as string);

    if (result.rowCount) {
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: result.rows[0],
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

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUserFromDB(id as string);

    if (result.rowCount) {
      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
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

export const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
