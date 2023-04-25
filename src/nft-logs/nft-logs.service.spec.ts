import { Test, TestingModule } from "@nestjs/testing";
import { NftLogsService } from "./nft-logs.service";

describe("NftLogsService", () => {
  let service: NftLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NftLogsService],
    }).compile();

    service = module.get<NftLogsService>(NftLogsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
