import { PaymentProviderIFX } from '@ports/ifx';
import { GetWalletBalancesUseCase } from './abstract.handler';
import { CurrenciesNameIfx, IFXCurrencies } from '@tools/models';
import { ViewBalancesResponse } from './balances.response.type';

export class GetWalletbalancesIFXUseCase extends GetWalletBalancesUseCase {
  /**
   * any other injections in order, after paymentProvider and request
   */
  constructor(
    protected paymentProvider: PaymentProviderIFX,
    private request: Request,
    private beneficiariesService: any,
  ) {
    super();
  }

  async handle(): Promise<ViewBalancesResponse[]> {
    const wallets = await this.paymentProvider.getWallets();

    const walletBalancesPromise = wallets.data.map((wallet) =>
      this.paymentProvider.getWalletBalances(wallet.id),
    );

    const walletBalances = await Promise.all(walletBalancesPromise);

    const balances = walletBalances.flatMap((wallet) =>
      wallet.balances.map((balance) => ({
        currency: balance.currency,
        name: CurrenciesNameIfx[balance.currency].name,
        amount: balance.amount,
      })),
    );

    return balances as ViewBalancesResponse[];
  }
}