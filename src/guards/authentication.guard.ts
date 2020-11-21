import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';


@Injectable()
export class AuthenticationGuard implements CanActivate {

    canActivate(context: ExecutionContext): boolean  {

        const host = context.switchToHttp(),
                request = host.getRequest();
        const user = request["user"];

        if (!user) {
            throw new UnauthorizedException();
        }


        return true;
    }

}