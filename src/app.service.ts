import { Injectable } from '@nestjs/common';
import * as process from "process";
import axios from "axios";
import {isLogLevelEnabled} from "@nestjs/common/services/utils";

@Injectable()
export class AppService {

     async checkContacts(clientEmail: string, clientPhone: string, clientName: string) {
        const route = process.env.ADMIN_URI + "api/v4/contacts";
        const token = process.env.ACCESS_TOKEN;
        const res = await axios.get(route, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const contacts = res["data"]["_embedded"]["contacts"];
        let flag = false;
        let idContactForUpdate = 5;
        for(let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];
            if(contact.hasOwnProperty("custom_fields_values")) {
                const customFieldsValues = contacts[i]["custom_fields_values"];
                for(let j = 0; j < customFieldsValues.length; j++) {
                    const fieldCode = customFieldsValues[j]["field_code"];
                    const values = customFieldsValues[j]["values"][0];
                    if(fieldCode === "PHONE" && values["value"] === clientPhone ||
                        fieldCode === "EMAIL" && values["value"] === clientEmail) {
                        flag = true;
                        idContactForUpdate = i;
                        break;
                    }
                }
            }

            if(flag) {
                break;
            }
        }
        return idContactForUpdate;
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
