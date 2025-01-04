import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { AuthService } from "./auth.service";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
    constructor(private authService: AuthService) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { username, password } = request.body;

        const user = await this.authService.validateUser(username, password);
        if (!user) {
            return false;
        }

        request.user = user; // Attach user to the request object
        return true;
    }
}
