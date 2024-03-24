import { Test } from "@nestjs/testing";
import { HttpStatus, INestApplication } from "@nestjs/common";
import Modules from "src/modules";
import * as request from "supertest";
import { PartnerUpdateInfoDto } from "src/modules/partner-config/dto/partner-update-info.dto";
import { JwtService } from "@nestjs/jwt";
import { UserRole } from "src/models/entities/user.entity";

describe("Partner Config Service", () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let partnerAccessToken: string;
  let workerAccessToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [...Modules],
      controllers: [],
      providers: [],
    }).compile();

    app = moduleRef.createNestApplication();
    jwtService = moduleRef.get(JwtService);

    partnerAccessToken = jwtService.sign({
      id: 1,
      role: UserRole.Partner,
      email: "mockPartnerEmail@gmail.com",
    });
    workerAccessToken = jwtService.sign({
      id: 2,
      role: UserRole.Worker,
      email: "mockWorkerEmail@gmail.com",
    });
    adminAccessToken = jwtService.sign({
      id: 3,
      role: UserRole.Admin,
      email: "mockAdminEmail@gmail.com",
    });
    await app.init();
  });

  describe("Test Update Company Info", () => {
    const mockPartnerUpdateInfoDto = new PartnerUpdateInfoDto();
    mockPartnerUpdateInfoDto.companyName = "mock company name";
    mockPartnerUpdateInfoDto.companyDescription = "mock description";
    mockPartnerUpdateInfoDto.timezone = 1500;

    it("Should be forbidden because not login", async () => {
      const response = await request(app.getHttpServer())
        .put("/partner-config/update-info")
        .send(mockPartnerUpdateInfoDto);
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it("Should be forbidden because worker has no permission to access this api", async () => {
      const response = await request(app.getHttpServer())
        .put("/partner-config/update-info")
        .set("Authorization", `Bearer ${workerAccessToken}`)
        .send(mockPartnerUpdateInfoDto);
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it("Should be forbidden because admin has no permission to access this api", async () => {
      const response = await request(app.getHttpServer())
        .put("/partner-config/update-info")
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .send(mockPartnerUpdateInfoDto);
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it("Should be created because partner has permission to access this api", async () => {
      const response = await request(app.getHttpServer())
        .put("/partner-config/update-info")
        .set("Authorization", `Bearer ${partnerAccessToken}`)
        .send(mockPartnerUpdateInfoDto);
      expect(response.status).toBe(HttpStatus.OK);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
