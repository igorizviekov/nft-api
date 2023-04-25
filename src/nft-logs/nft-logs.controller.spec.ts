import { Test, TestingModule } from "@nestjs/testing";
import { NftLogsController } from "./nft-logs.controller";

describe("NftLogsController", () => {
  let controller: NftLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NftLogsController],
    }).compile();

    controller = module.get<NftLogsController>(NftLogsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
