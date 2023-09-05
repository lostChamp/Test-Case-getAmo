import {Body, Controller, Get, Param, Post, Req, Res} from '@nestjs/common';
import { AppService } from './app.service';
import * as process from "process";
import {Request} from "express";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("")
  async getAccessToken(@Req() req: Request) {
    const code = String(req["query"]["code"]);
    const accessToken = await this.appService.getAccessToken(code);
    console.log(accessToken)
  }

  @Get("/newAccess")
  async getNewAccessTokenByRefresh() {
    const accessToken = await this.appService.getNewAccessTokenByRefresh();
    return accessToken;
  }

  @Get("/getInfo/:name/:email/:phone")
  getInfoForAmoCRM(
      @Param("name") clientName: string,
      @Param("email") clientEmail: string,
      @Param("phone") clientPhone: string
  ) {

  }



}
