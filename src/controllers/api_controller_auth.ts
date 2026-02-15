import { Body, Controller, Example, Post, Route, SuccessResponse, Tags, Response } from "tsoa";
import { hash, verify } from "argon2";
import global_prisma_instance from "../util/global_prisma_instance";
import crypto from "node:crypto";
import { generateToken } from "../authentication";


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

export class LoginRequest {
    /**
     * @example "evelyn127"
     */
    username!: string;

    /**
     * @example "A3nmF93$m6f#1x"
     */
    password!: string;
}

export class LoginResponse {
    /**
     * JWT bearer token.
     * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     */
    token!: string;
}

@Route("api/v1/auth")
@Tags("Auth")
export class AuthController extends Controller {
    @Post("register")
    @SuccessResponse("201", "Created. You can use the provided username and password to log in.")
    @Response("400", "Username, email and/or password are invalid.")
    @Response("409", "This username or email is already in use.")
    public async register(
        @Body() body: RegisterRequest
    ): Promise<void> {
        // SAFETY: By this point, TSOA has validated request shape and field
        // constraints declared on RegisterRequest.
        // THIS DOES NOT ENSURE DATABASE SAFETY! e.g. non-unique user

        let newUser;

        try {
            newUser = await global_prisma_instance.user.create({
                data: {
                    id: crypto.randomUUID().replaceAll("-", ""),
                    password_hash: await hash(body.password),
                    email: body.email,
                    username: body.username
                }
            })
        } catch (e) {
            console.log(e);
            this.setStatus(409);
            return;
        }

        this.setStatus(201);
        return;
    }

    @Post("login")
    @SuccessResponse("200", "Successfully authenticated.")
    @Response("401", "Invalid username or password.")
    public async login(
        @Body() body: LoginRequest
    ): Promise<LoginResponse> {
        const user = await global_prisma_instance.user.findUnique({
            where: {
                username: body.username
            }
        });

        if (!user) {
            this.setStatus(401);
            throw new Error("Invalid username or password.");
        }

        const validPassword = await verify(user.password_hash, body.password);

        if (!validPassword) {
            this.setStatus(401);
            throw new Error("Invalid username or password.");
        }

        return {
            token: generateToken({ id: user.id })
        };
    }
}
