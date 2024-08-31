import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from 'express';
import { APP_USER_ID_COOKIE } from "src/constants";
import { IS_PUBLIC_KEY } from "src/decorators/public";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            // 💡 See this condition
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromCookie(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        
        return true;
    }

    private extractTokenFromCookie(request: Request): string | undefined {
        return request.cookies?.[APP_USER_ID_COOKIE];
    }
}
