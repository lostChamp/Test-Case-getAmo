import { Injectable } from '@nestjs/common';
import * as process from "process";
import axios from "axios";
import {isLogLevelEnabled} from "@nestjs/common/services/utils";

@Injectable()
export class AppService {

    async getAccessToken(authorizationCode: string) {
        const axiosInstance = axios.create({
            baseURL: process.env.ADMIN_URI
        });
        const route = "access_token?=" + process.env.SESSION_KEY;
        const res = await axiosInstance.post(route, {
            client_id: process.env.ID_INTEGRATION,
            client_secret: process.env.SECRET_KEY,
            grant_type: "authorization_code",
            code: authorizationCode,
            redirect_uri: process.env.REDIRECT_URI
        })

        return res.data;
    }

    async getNewAccessTokenByRefresh() {
        const axiosInstance = axios.create({
            baseURL: process.env.ADMIN_URI
        });
        const route = "access_token?=" + process.env.SESSION_KEY;
        const res = await axiosInstance.post(route, {
            client_id: process.env.ID_INTEGRATION,
            client_secret: process.env.SECRET_KEY,
            grant_type: "refresh_token",
            refresh_token: process.env.REFRESH_TOKEN,
            redirect_uri: process.env.REDIRECT_URI
        })

        return res.data;
    }
}
