import { Test, TestingModule } from "@nestjs/testing";
import { NftService } from "./nft.service";

describe("NFTService", () => {
  let service: NftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NftService],
    }).compile();

    service = module.get<NftService>(NftService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
