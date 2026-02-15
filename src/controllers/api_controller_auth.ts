import { Body, Controller, Example, Post, Route, SuccessResponse, Tags } from "tsoa";
import { hash, verify } from "argon2";

export class RegisterRequest {
    /**
     * @pattern ^[a-zA-Z0-9_]+$
     * @minLength 2
     * @maxLength 30
     * @example "evelyn127"
     */
    username!: string;

    /**
     * @format email
     * @example "evelyn127@email.provider.online"
     */
    email!: string;

    /**
     * @minLength 10
     * @pattern ^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).+$
     * @example "A3nmF93$m6f#1x"
     */
    password!: string;
}

@Route("api/v1/auth")
@Tags("Auth")
export class AuthController extends Controller {
    @Post("register")
    @SuccessResponse("201", "Created. You can use the provided username and password to log in.")
    public async register(
        @Body() body: RegisterRequest
    ): Promise<void> {
        // SAFETY: By this point, TSOA has validated request shape and field
        // constraints declared on RegisterRequest.
        // THIS DOES NOT ENSURE DATABASE SAFETY! e.g. non-unique user
        const hashedPw = await hash(body.password)
        console.log(hashedPw);

        this.setStatus(201);
        return;
    }
}
