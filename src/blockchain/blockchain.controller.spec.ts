import { Test, TestingModule } from "@nestjs/testing";
import { BlockchainController } from "./blockchain.controller";

describe("UsersController", () => {
  let controller: BlockchainController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlockchainController],
    }).compile();

    controller = module.get<BlockchainController>(BlockchainController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
