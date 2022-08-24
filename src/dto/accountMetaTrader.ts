import { AccountMetaTraderEnum, OrdersDirectionEnum, OrdersTypeEnum, OrdersStatusEnum, AccountMetaTrader, PlanInvoicesTypeEnum, PlanInvoicesStatusEnum, AccountMetaTraderTypeEnum, accountTypeEnum } from '@prisma/client';
import { ObjectType, Field, InputType, Int, registerEnumType} from 'type-graphql';

import { UserHaveComponents } from './user';

@ObjectType()
export class ObjectAccountMetaTrader  {
	@Field(() => Int, { nullable: true })
		id?: number;
	@Field(() => String, { nullable: true })
		name?: string;
	@Field(() => Int, { nullable: true })
		balance?: number;
	@Field(() => Int, { nullable: true })
		balanceCredit?: number;
	@Field(() => Int, { nullable: true })
		accountNumber?: number;
	@Field(() => String, { nullable: true })
		status?: string;
	@Field(() => Date, { nullable: true })
		finishDate?: Date;
}



@ObjectType()
export class ObjectAccountFilterAccount implements AccountMetaTrader{
	createdAt!: Date;
	updatedAt!: Date;
	userId!: number;
	accountType!: accountTypeEnum;

	@Field(() => Int, { nullable: true })
		id!: number ;
	@Field(() => Date, { nullable: true })
		finishDate!: Date;
	@Field(() => String, { nullable: true })
		name!: string;
	@Field(() => String, { nullable: true })
		password!: string;
	@Field(() => String, { nullable: true })
		server!: string;
	@Field(() => Int, { nullable: true })
		balance!: number;
	@Field(() => Int, { nullable: true })
		balanceCredit!: number;
	@Field(() => Int, { nullable: true })
		accountNumber!: number;
	@Field(() => String, { nullable: true })
		status!: AccountMetaTraderEnum;
	@Field(() => String, { nullable: true })
		typeAccount!: AccountMetaTraderTypeEnum;
	@Field(() => Int, { nullable: true })
		allCurrent?: number;
	@Field(() => Int, { nullable: true })
		allCopyCurrent?: number;
	@Field(() => [String], { nullable: true })
		local!: string[];
	@Field(() => [ObjectGroupSimpleOrder], { nullable: true })
		missingOrders?: ObjectGroupSimpleOrder[] | null;
}


@ObjectType()
export class ObjectAccountFilterShort  {
	@Field(() => [ObjectAccountFilterShort], { nullable: true })
		id?: ObjectAccountFilterShort[];
}


@ObjectType()
export class ObjectAccountFindToUser  {
	@Field(() => Int, { nullable: true })
		id?: number;
	@Field(() => Date, { nullable: true })
		finishDate?: Date;
	@Field(() => String, { nullable: true })
		name?: string;
	@Field(() => String, { nullable: true })
		server?: string;
	@Field(() => Int, { nullable: true })
		balance?: number;
	@Field(() => Int, { nullable: true })
		balanceCredit?: number;
	@Field(() => Int, { nullable: true })
		accountNumber?: number;
	@Field(() => String, { nullable: true })
		status?: string;
	@Field(() => [ObjectGroupSimpleOrder], { nullable: true })
		OrdersAccount?: ObjectGroupSimpleOrder[] | null;
	@Field(() => UserHaveComponents, { nullable: true })	
		user?: UserHaveComponents;
}

@InputType()
export class InputAccountMetaTraderSingleFind{
	@Field(() => Int)
		id!: number;	
	
}


@ObjectType()
export class ObjectGroupSimpleOrder  {

	@Field(() => Int, { nullable: true })
		ordersId?: number;
	@Field(() => Int, { nullable: true })
		id?: number;
	@Field(() => Int, { nullable: true })
		ticket?: number;
	@Field(() => String, { nullable: true })
		par?: string;
	@Field(() => OrdersDirectionEnum, { nullable: true })
		direction?: OrdersDirectionEnum;
	@Field(() => Int, { nullable: true })
		lote?: number;
	@Field(() => String, { nullable: true })
		local?: string;
	@Field(() => OrdersStatusEnum, { nullable: true })
		status?: OrdersStatusEnum;
	@Field(() => OrdersTypeEnum, { nullable: true })
		type?: OrdersTypeEnum;
	@Field(() => Int, { nullable: true })
		accountMetaTraderId?: number;			
}

@InputType()
export class InputOrdersAccountGroupDefinition  {

	@Field(() => Int, { nullable: true })
		ordersId?: number;
	@Field(() => Int, { nullable: true })
		id?: number;
	@Field(() => Int, { nullable: true })
		ticket?: number;
	@Field(() => String, { nullable: true })
		par?: string;
	@Field(() => OrdersDirectionEnum, { nullable: true })
		direction?: OrdersDirectionEnum;
	@Field(() => Int, { nullable: true })
		lote?: number;
	@Field(() => String, { nullable: true })
		local?: string;
	@Field(() => OrdersStatusEnum, { nullable: true })
		status?: OrdersStatusEnum;
	@Field(() => OrdersTypeEnum, { nullable: true })
		type?: OrdersTypeEnum;
	@Field(() => Int, { nullable: true })
		accountMetaTraderId?: number;			
}

registerEnumType(OrdersStatusEnum, {
	name: 'OrdersStatusEnum',
});
registerEnumType(OrdersTypeEnum, {
	name: 'OrdersTypeEnum',
});
registerEnumType(OrdersDirectionEnum, {
	name: 'OrdersDirectionEnum',
});
registerEnumType(AccountMetaTraderEnum, {
	name: 'AccountMetaTraderEnum',
});

@InputType()
export class InputNewAccountMetaTrader {
	@Field(() => String)
		name!: string;
	@Field(() => String)
		password!: string;
	@Field(() => String)
		server!: string;
	@Field(() => Int)
		balance!: number;
	@Field(() => Int)
		balanceCredit!: number;
	@Field(() => Int)
		accountNumber!: number;
	@Field(() => Int, { nullable: true })
		userId!: number;
}

@InputType()
export class InputChangeAccountMetaTrader {
	@Field(() => Int)
		id!: number;
	@Field(() => String,{ nullable: true })
		name?: string;
	@Field(() => String,{ nullable: true })
		password?: string;
	@Field(() => Int,{ nullable: true })
		balance?: number;
	@Field(() => Int,{ nullable: true })
		balanceCredit?: number;
}

@InputType()
export class InputAccountPython  {
	@Field(() => Int)
		id!: number;
	@Field(() => Int,{ nullable: true })
		balance!: number;
	@Field(() => Int,{ nullable: true })
		balanceCredit!: number;
	@Field(() => AccountMetaTraderEnum, { nullable: true })
		status?: AccountMetaTraderEnum;
}



@InputType()
export class InputStopWorkAccountMetaTrader {
	@Field(() => Int)
		id?: number;
	@Field(() => AccountMetaTraderEnum)
		status!: AccountMetaTraderEnum;
}

@InputType()
export class InputDeleteAccountMetaTrader {
	@Field(() => Int)
		id?: number;
}