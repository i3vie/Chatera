import { Controller, Get, Route, Tags } from "tsoa";

@Route("api/v1")
@Tags("API")
export class ApiController extends Controller {
  @Get("health")
  public async health(): Promise<{ status: number }> {
    return { status: 100 };
  }
}
