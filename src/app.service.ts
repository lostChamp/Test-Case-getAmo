import { Injectable } from '@nestjs/common';
import * as process from "process";
import axios from "axios";
import {isLogLevelEnabled} from "@nestjs/common/services/utils";

@Injectable()
export class AppService {

     async checkContactsAndCreateDeal(clientEmail: string, clientPhone: string, clientName: string) {
        const routeByEmail = process.env.ADMIN_URI + `api/v4/contacts?query=${clientEmail}`;
        const routeByPhone = process.env.ADMIN_URI + `api/v4/contacts?query=${clientPhone}`;
        const token = process.env.ACCESS_TOKEN;
        const resByEmail = await axios.get(routeByEmail, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
         const resByPhone = await axios.get(routeByPhone, {
             headers: {
                 Authorization: `Bearer ${token}`
             }
         });

         if(resByEmail.data === '' && resByPhone.data === '') {
             const res = this.createUser(clientPhone, clientEmail, clientName);
             return res;
         }
    }

    async createDeal() {
         const route = process.env.ADMIN_URI + `/api/v4/leads`;
         const token = process.env.ACCESS_TOKEN;
         const res = await axios.post(route, [
             {

             }
         ], {
             headers: {
                 Authorization: `Bearer ${token}`
             }
         });
    }

    async updateUserData(idContact) {
        const route = process.env.ADMIN_URI + `api/v4/contacts/${idContact}`;
        const token = process.env.ACCESS_TOKEN;
        const res = await axios.patch(route, [

        ], {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    async createUser(clientPhone: string, clientEmail: string, clientName: string) {
        const route = process.env.ADMIN_URI + `api/v4/contacts`;
        const token = process.env.ACCESS_TOKEN;
        const arrayName = /(?=[А-ЯЁ])/g[Symbol.split](clientName);
        const firstName = arrayName[0];
        const lastName = arrayName[1];
        const res = await axios.post(route, [
            {
                first_name: firstName,
                last_name: lastName,
                custom_fields_values: [
                    {
                        field_id: 1470495,
                        values: [
                            {
                                value: clientPhone
                            }
                        ]
                    },
                    {
                        field_id: 1470497,
                        values: [
                            {
                                value: clientEmail
                            }
                        ]
                    },
                ],
            }
        ], {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return `Пользователь ${firstName} ${lastName} зарегистрирован!`;
    }

    async getAccessToken(authorizationCode: string) {
        const axiosInstance = axios.create({
            baseURL: process.env.ADMIN_URI_FOR_AUTH
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
            baseURL: process.env.ADMIN_URI_FOR_AUTH
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
