import type {IAuthStrategy} from "@/services/auth/IAuthStrategy";
import {DefaultAuthStrategy} from "@/services/auth/strategies/DefaultAuthStrategy";

export enum AuthType {}

export class AuthService {
    private readonly authStrategy: IAuthStrategy;

    constructor(type?: AuthType) {
        this.authStrategy = DefaultAuthStrategy;
    }

    public async authenticate(): Promise<{
        name: string;
    }> {
        // TODO:

        return {
            name: 'Undefined User'
        };
    }
}