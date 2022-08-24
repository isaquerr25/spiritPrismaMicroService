import { AccountMetaTraderEnum, AccountMetaTraderTypeEnum, accountTypeEnum, InvoicesEnum, OrdersStatusEnum } from '@prisma/client';
import { ObjectType, Field, InputType, Int, registerEnumType} from 'type-graphql';
import BigInt from 'graphql-bigint';
import { ObjectOrdersAccounts } from './ordersAccount';
import { ObjectOrders } from './orders';

@ObjectType()
export class StaffActivity {
	@Field(() => Int)
		cyclesStart?: number;
	@Field(() => Int)
		withdrawAll?: number;
	@Field(() => Int)
		documentsValidate?: number;
	@Field(() => Int)
		transactionPay?: number;
	@Field(() => Int)
		valueEnterToday?: number;
}


@InputType()
export class InputIdUser {
	@Field(() => Int)
		id!: number;
}


@ObjectType()
export class StaffInfoUserComponents {
	@Field(() => String, { nullable: true })
		name?: string | null;
	@Field(() => String)
		email!: string;
	@Field(() => String, { nullable: true })
		wallet?: string | null;
	@Field(() => String, { nullable: true })
		document?: string;
	@Field(() => String, { nullable: true })
		qDeposit?: string| null;
	@Field(() => String, { nullable: true })
		allDeposit?: string| null;
	@Field(() => String, { nullable: true })
		qWithdraw?: string| null;
	@Field(() => String, { nullable: true })
		allWithdraw?: string| null;
	@Field(() => String, { nullable: true })
		qInvest?: string| null;
	@Field(() => String, { nullable: true })
		allInvest?: string| null;
	@Field(() => String, { nullable: true })
		qCompleteInvest?: string| null;
	@Field(() => String, { nullable: true })
		allCompleteInvest?: string| null;
	@Field(() => String, { nullable: true })
		qCycleProcess?: string| null;
	@Field(() => String, { nullable: true })
		allCycleProcess?: string| null;
	@Field(() => String, { nullable: true })
		qCycleActive?: string| null;
	@Field(() => String, { nullable: true })
		allCycleActive?: string| null;
	@Field(() => String, { nullable: true })
		qCycleComplete?: string| null;
	@Field(() => String, { nullable: true })
		allCycleComplete?: string| null;
	@Field(() => String, { nullable: true })
		cash?: string| null;
}


@ObjectType()
export class ObjectAccountMetaTraderStaff  {

	@Field(() => Int, { nullable: true })	id?: number;
	@Field(() => String, { nullable: true }) name?: string;
	@Field(() => String, { nullable: true }) password?: string;
	@Field(() => String, { nullable: true }) server?: string;
	@Field(() => Int, { nullable: true }) balance?: number;
	@Field(() => Int, { nullable: true }) balanceCredit?: number;
	@Field(() => Int, { nullable: true }) accountNumber?: number;
	@Field(() => AccountMetaTraderEnum) status!: AccountMetaTraderEnum;
	@Field(() => Date, { nullable: true }) finishDate?: Date;
	@Field(() => Int, { nullable: true }) userId?: number;
	@Field(() => AccountMetaTraderTypeEnum) typeAccount!: AccountMetaTraderTypeEnum;
	@Field(() => [String], { nullable: true }) local?: string[];
	@Field(() => accountTypeEnum) accountType!: accountTypeEnum;
	@Field(() => [ObjectOrders], { nullable: true }) refOriginalOrder?: ObjectOrders[];

}

@InputType()
export class InputUpdateAccountMetaTraderStaff  {
	@Field(() => Int) id!: number;
	@Field(() => String) name!: string;
	@Field(() => String) password!: string;
	@Field(() => String) server!: string;
	@Field(() => Int) balance!: number;
	@Field(() => Int) balanceCredit!: number;
	@Field(() => Int) accountNumber!: number;
	@Field(() => AccountMetaTraderEnum) status!: AccountMetaTraderEnum;
	@Field(() => Date) finishDate!: Date;
	@Field(() => AccountMetaTraderTypeEnum) typeAccount!: AccountMetaTraderTypeEnum;
	@Field(() => [String]) local!: string[];
	@Field(() => accountTypeEnum) accountType!: accountTypeEnum;
}

registerEnumType(AccountMetaTraderEnum, {
	name: 'AccountMetaTraderEnum',
});

registerEnumType(AccountMetaTraderTypeEnum, {
	name: 'AccountMetaTraderTypeEnum',
});

registerEnumType(accountTypeEnum, {
	name: 'accountTypeEnum',
});





