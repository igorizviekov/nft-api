import { Test, TestingModule } from "@nestjs/testing";
import { NftController } from "./nft.controller";

describe("UsersController", () => {
  let controller: NftController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NftController],
    }).compile();

    controller = module.get<NftController>(NftController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
