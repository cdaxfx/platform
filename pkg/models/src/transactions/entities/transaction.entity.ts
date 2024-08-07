import { Entity, EntityRepositoryType, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { Account, User } from '../../users';
import { Beneficiary } from '../../beneficiaries';
import { Client } from '../../clients';
import { BaseEntity } from '../../base';
import { TransactionStatusApproval } from '../enums/transaction-status.enum';
import { TransactionsRepository } from '../repository/transactions.repository';

@Entity({ repository: () => TransactionsRepository })
export class Transaction extends BaseEntity {
  @Property()
  account_id: string;

  /*chris
  @ManyToOne({entity: () => Account, nullable: true, joinColumn: 'account_id', referenceColumnName: 'uuid'})
  account: Account;*/

  //chris
  @ManyToOne({entity: () => Account, nullable: true, fieldName: 'account'})
  account: Account;
  ////////////////////////////////////

  @Property({ nullable: true })
  balance_id: string;

  @Property({ nullable: true })
  destination_balance_id: string;

  @Property()
  action: string;

  @Property()
  amount: string;

  @Property({ nullable: true })
  buy_amount: string;

  @Property()
  currency: string;

  @Property({ nullable: true })
  buy_currency: string;

  @Property({ nullable: true })
  fixed_side: string;

  @Property({ nullable: true })
  transaction_id: string;

  @Property()
  short_id: string;

  @Property()
  cdax_id: string;

  @Property()
  gateway: string;

  @Property({ nullable: true })
  gateway_id: string;

  @Property({ nullable: true })
  reason: string;

  @Property({ nullable: true })
  reference: string;

  @Property()
  status: string;

  @Property({ nullable: true })
  fee_amount: string;

  @Property({ nullable: true })
  fee_currency: string;

  @Property({ nullable: true })
  gateway_fee_amount: string;

  @Property({ nullable: true })
  gateway_fee_currency: string;

  @Property({ nullable: true })
  client_rate: string;

  @Property({ nullable: true })
  core_rate: string;

  /*chris
  @ManyToOne({entity: () => Beneficiary, nullable: true, joinColumns: ['cdax_beneficiary_id']})
  beneficiary: Beneficiary;*/

  //chris
  @ManyToOne({entity: () => Beneficiary, nullable: true, fieldName: 'beneficiary'})
  beneficiary: Beneficiary;
  //////////////////////////////////////////

  @Property({ nullable: true })
  cdax_beneficiary_id: string;

  @Property({ nullable: true })
  beneficiary_id: string;

  @Property({ nullable: true })
  payment_date: string;

  @Property({ nullable: true })
  payment_type: string;

  @Property({ nullable: true })
  payment_reason: string;

  @Property({ nullable: true })
  purpose_code: string;

  @Enum(() => TransactionStatusApproval)
  @Property({ nullable: true })
  status_approval: string;

  @Property({ nullable: true })
  description: string;

  @Property({ nullable: true })
  source: string;

  @Property({ nullable: true })
  destination: string;

  @Property({ nullable: true })
  sender_name: string;

  @Property({ nullable: true })
  sender_address: string;

  @Property({ nullable: true })
  sender_information: string;

  @Property({ nullable: true })
  sender_accountNumber: string;

  @Property({ nullable: true })
  sender_BIC: string;

  @Property({ nullable: true })
  sender_IBAN: string;

  @Property({ nullable: true })
  sender_routing_key: string;

  @Property({ nullable: true })
  sender_routing_value: string;

  @Property({ nullable: true })
  mid_market_rate: string;

  @Property({ nullable: true })
  conversion_date: string;

  @Property({ nullable: true })
  settlement_date: string;

  @Property({ nullable: true })
  gateway_created_at: string;

  @Property({ nullable: true })
  gateway_updated_at: string;

  @Property({ nullable: true })
  gateway_completed_at: string;

  @Property({ nullable: true })
  gateway_spread_table: string;

  @Property({ nullable: true })
  partner_rate: string;

  @Property({ nullable: true })
  deposit_required: boolean;

  @Property({ nullable: true })
  deposit_amount: string;

  @Property({ nullable: true })
  deposit_currency: string;

  @Property({ nullable: true })
  deposit_status: string;

  @Property({ nullable: true })
  deposit_required_at: string;

  @Property({ nullable: true })
  estimated_arrival: string;

  @Property({ nullable: true })
  transferred_at: string;

  /*chris
  @ManyToOne({ entity: () => User, nullable: true })
  creator: User;*/

  //chris
  @ManyToOne({ entity: () => User, nullable: true, fieldName: 'creator' })
  creator: User;
  //////////////////////////////////////////////

  @Property({ nullable: true})
  creator_uuid: string;

  @Property({ nullable: true })
  client_uuid: string;

  /*chris
  @ManyToOne({ entity: () => Client, nullable: true})
  client: Client;*/

  //chris
  @ManyToOne({ entity: () => Client, nullable: true, fieldName: 'client'})
  client: Client;
  ///////////////////////////////////////////

  @Property({ nullable: true })
  approver_uuid: string;

  @Property({ nullable: true })
  impersonator_uuid: string;

  /*chris
  @ManyToOne({ entity: () => User, nullable: true})
  approver: User;*/

  //chris
  @ManyToOne({ entity: () => User, nullable: true, fieldName: 'approver'})
  approver: User;
  //////////////////////////////////////////////////

  [EntityRepositoryType]: TransactionsRepository;
}
