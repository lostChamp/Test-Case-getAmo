import {Body, Controller, Get, Param, Post, Req, Res} from '@nestjs/common';
import { AppService } from './app.service';
import * as process from "process";
import {Request} from "express";
import {ApiOperation} from "@nestjs/swagger";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("")
  @ApiOperation({ summary: 'Creation integration and receipt of access token' })
  async getAccessToken(@Req() req: Request) {
    const code = String(req["query"]["code"]);
    const accessToken = await this.appService.getAccessToken(code);
    console.log(accessToken)
  }

  @Get("/newAccess")
  @ApiOperation({ summary: 'Getting a new access token' })
  async getNewAccessTokenByRefresh() {
    const accessToken = await this.appService.getNewAccessTokenByRefresh();
    return accessToken;
  }

  @Get("/createDeal/:name/:email/:phone")
  @ApiOperation({ summary: 'Creating or updating a user. Creating a funnel with it' })
  async checkContactsAndCreateDeal(
      @Param("name") clientName: string,
      @Param("email") clientEmail: string,
      @Param("phone") clientPhone: string
  ) {
    const res = await this.appService.checkContactsAndCreateDeal(clientEmail, clientPhone, clientName);
    console.log(res);
  }



}
