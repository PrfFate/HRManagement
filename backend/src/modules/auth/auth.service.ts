import bcrypt from "bcryptjs";

import { RoleIds } from "../../common/constants/roles.js";
import { AppError } from "../../common/errors/AppError.js";
import { mapUser } from "../users/user.mapper.js";
import { userRepository } from "../users/user.repository.js";
import type { LoginInput, RegisterInput } from "./auth.validation.js";
import { jwtService } from "./jwt.service.js";

export const authService = {
  async register(input: RegisterInput) {
    const existingUser = await userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new AppError("Bu e-posta adresi zaten kullanılıyor.", 409);
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await userRepository.create({
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      passwordHash,
      roleId: RoleIds.PendingUser,
      isActive: false,
      approvalStatus: "PENDING",
    });

    return mapUser(user);
  },

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);

    if (!user) {
      throw new AppError("E-posta veya şifre hatalı.", 401);
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError("E-posta veya şifre hatalı.", 401);
    }

    const safeUser = mapUser(user);
    const token = jwtService.sign({
      userId: user.id,
      email: user.email,
      roleId: user.roleId as typeof RoleIds[keyof typeof RoleIds],
    });

    return {
      token,
      user: safeUser,
    };
  },

  async me(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("Kullanıcı bulunamadı.", 404);
    }

    return mapUser(user);
  },
};
