import { Body, Controller, Get, HttpStatus, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserRole } from "src/models/entities/user.entity";
import { Roles } from "src/modules/authentication/auth.const";
import { UserEmail } from "src/decorators/user-email.decorator";
import { WalletService } from "src/modules/wallet/wallet.service";
import { WalletMessageSuccess } from "src/modules/wallet/wallet.const";
import { IResponseToClient } from "src/configs/response-to-client.config";
import { WithdrawMoneyDto } from "src/modules/wallet/dto/withdraw-money.dto";
import { TransferMoneyDto } from "src/modules/wallet/dto/transfer-money.dto";

@Controller("wallet")
@ApiTags("Wallet")
@ApiBearerAuth()
@Roles(UserRole.Worker)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get("get-wallet")
  @ApiOperation({
    summary: "[Worker] Api to worker for get wallet.",
  })
  async getWallet(@UserEmail() userEmail: string): Promise<IResponseToClient> {
    const data = await this.walletService.getWorkerWallet(userEmail);
    return {
      message: WalletMessageSuccess.GetWalletSuccess,
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Post("transfer-money")
  @ApiOperation({
    summary: "[Worker] Api to worker for transfer money to another wallet.",
  })
  async transferMoney(
    @UserEmail() userEmail: string,
    @Body() transferMoneyDto: TransferMoneyDto
  ): Promise<IResponseToClient> {
    const data = await this.walletService.transferMoney(
      userEmail,
      transferMoneyDto.receiveEmail,
      transferMoneyDto.amount,
      transferMoneyDto.note
    );
    return {
      message: WalletMessageSuccess.GetWalletSuccess,
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Post("withdraw-money")
  @ApiOperation({
    summary: "[Worker] Api to worker for withdraw money.",
  })
  async withDrawMoney(
    @UserEmail() workerEmail: string,
    @Body() withdrawMoneyDto: WithdrawMoneyDto
  ): Promise<IResponseToClient> {
    const data = await this.walletService.withdraw(
      workerEmail,
      withdrawMoneyDto.bankName,
      withdrawMoneyDto.bankAccountNumber,
      withdrawMoneyDto.amount
    );
    return {
      message: WalletMessageSuccess.GetWalletSuccess,
      data,
      statusCode: HttpStatus.OK,
    };
  }
}
