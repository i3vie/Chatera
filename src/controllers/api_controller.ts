import { readFileSync } from "node:fs";
import { Controller, Get, Route, SuccessResponse, Tags, Response, Example } from "tsoa";

const ver = JSON.parse(readFileSync("package.json").toString("utf-8"))["version"];
const parts = ver.split(".")
const [major, minor, patch] = parts;

export enum HealthCode {
    OK = "OK"
}

interface HealthResponse {
    code: HealthCode;
}

interface VersionResponse {
    major: number;
    minor: number;
    patch: number;
}

@Route("api/v1")
@Tags("API")
export class ApiController extends Controller {

    @Get("health")
    @Response<HealthResponse>(200, "OK")
    public async health(): Promise<HealthResponse> {
        return { code: HealthCode.OK };
    }

    @Get("version")
    public async version(): Promise<VersionResponse> {
        return parts
    }
}
