import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, UseGuards } from '@nestjs/common';
import { Response, Request } from "express";
import { formatError } from "@core/domain/dist/src/modules/@shared/utils"
import { 
  SignupUsecaseFactory, 
  LoginUsecaseFactory, 
  RefreshTokenUsecaseFactory 
} from "@core/domain/dist/src/modules/auth/main/factories"
import { AuthGuard } from 'src/guards';


@Controller('auth')
export class AuthController {
  constructor() { }

  @Post("/signup")
  async create(@Body() signupDto: any, @Res() res: Response) {

    const signupUsecase = SignupUsecaseFactory.create()
    const usecaseResult = await signupUsecase.execute(signupDto)
    if (usecaseResult.isLeft()) {
      return res.status(400).json(formatError(usecaseResult.value))
    }
    return res.json(usecaseResult.value)
  }

  @Post("/login")
  async login(@Body() loginDto: any, @Res() res: Response) {
    const loginUsecase = LoginUsecaseFactory.create()
    const usecaseResult = await loginUsecase.execute(loginDto)
    if (usecaseResult.isLeft()) {
      return res.status(400).json(formatError(usecaseResult.value))
    }
    if(usecaseResult.value.loginType  === "1FA") {
      res.cookie("accessToken", usecaseResult.value.accessToken, { httpOnly: true })
      res.cookie("refreshToken", usecaseResult.value.refreshToken, { httpOnly: true })
      return res.status(200).json()
    }
    return res.status(200).json(usecaseResult.value)
  }

  @Post("/refresh-token")
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const { refreshToken } = req.cookies
    const refreshTokenUsecase = RefreshTokenUsecaseFactory.create()
    const usecaseResult = await refreshTokenUsecase.execute({
      refreshToken
    })
    if (usecaseResult.isLeft()) {
      return res.status(400).json(formatError(usecaseResult.value))
    }
    res.cookie("accessToken", usecaseResult.value.accessToken, { httpOnly: true })
    res.cookie("refreshToken", usecaseResult.value.refreshToken, { httpOnly: true })

    return res.status(200).json()
  }

  @UseGuards(new AuthGuard())
  @Post("/current-user")
  async currentUser(@Req() req: Request, @Res() res: Response) {
    return res.status(200).json(req.currentUser)
  }
}
