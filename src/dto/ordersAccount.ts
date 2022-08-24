import { ObjectAccountMetaTrader } from './accountMetaTrader';
import { AccountMetaTrader, AccountMetaTraderEnum, InvoicesEnum, Orders, OrdersDirectionEnum, OrdersStatusEnum, OrdersTypeEnum } from '@prisma/client';
import { ObjectType, Field, InputType, Int, registerEnumType} from 'type-graphql';
import { ObjectOrders } from './orders';

registerEnumType(OrdersDirectionEnum, {
	name: 'OrdersDirectionEnum',

});
registerEnumType(OrdersTypeEnum, {
	name: 'OrdersTypeEnum',

});
registerEnumType(OrdersStatusEnum, {
	name: 'OrdersStatusEnum',

});



@ObjectType()
export class ObjectOrdersAccounts  {

	@Field(() => Int, { nullable: true }) id?: number;
	@Field(() => String, { nullable: true }) par?: string;
	@Field(() => OrdersDirectionEnum, { nullable: true }) direction?: OrdersDirectionEnum;
	@Field(() => Int, { nullable: true }) lote?: number;
	@Field(() => Int, { nullable: true }) ticket?: number;
	@Field(() => String, { nullable: true }) local?: string;
	@Field(() => OrdersTypeEnum, { nullable: true }) type?: OrdersTypeEnum;
	@Field(() => ObjectAccountMetaTrader, { nullable: true }) refAccount?: ObjectAccountMetaTrader;
	@Field(() => ObjectOrders, { nullable: true }) refOriginalOrder?: ObjectOrders;
	@Field(() => OrdersStatusEnum, { nullable: true }) status?: OrdersStatusEnum;
	@Field(() => Date, { nullable: true }) createdAt?: Date;
	@Field(() => Date, { nullable: true }) updatedAt?: Date;

}


@InputType()
export class InputNewtOrdersAccounts  {
	@Field(() => String) par!: string;
	@Field(() => OrdersDirectionEnum) direction!: OrdersDirectionEnum;
	@Field(() => Int) lote!: number;
	@Field(() => Int) ticket!: number;
	@Field(() => Int) accountMetaTraderId!: number;
	@Field(() => Int) ordersId!: number;
	@Field(() => String) local!: string;
	@Field(() => OrdersTypeEnum) type!: OrdersTypeEnum;
	@Field(() => OrdersStatusEnum) status!: OrdersStatusEnum;
}

@InputType()
export class InputOrdersAccountGroupDefinition  {
	@Field(() => Int, { nullable: true }) id?: number;
	@Field(() => Int, { nullable: true }) ordersId?: number;
	@Field(() => Int, { nullable: true }) ticket?: number;
	@Field(() => String, { nullable: true }) par?: string;
	@Field(() => OrdersDirectionEnum, { nullable: true }) direction?: OrdersDirectionEnum;
	@Field(() => Int, { nullable: true }) lote?: number;
	@Field(() => Int, { nullable: true }) accountMetaTraderId?: number;
	@Field(() => String, { nullable: true }) local?: string;
	@Field(() => OrdersTypeEnum, { nullable: true }) type?: OrdersTypeEnum;
	@Field(() => OrdersStatusEnum, { nullable: true }) status?: OrdersStatusEnum;
}


@InputType()
export class InputUpdateOrdersAccounts  {
    @Field(() => Int) id!: number;
	@Field(() => String, { nullable: true }) par?: string;
	@Field(() => OrdersDirectionEnum, { nullable: true }) direction?: OrdersDirectionEnum;
	@Field(() => Int, { nullable: true }) lote?: number;
	@Field(() => Int, { nullable: true }) ticket?: number;
	@Field(() => String, { nullable: true }) local?: string;
	@Field(() => OrdersTypeEnum, { nullable: true }) type?: OrdersTypeEnum;
	@Field(() => OrdersStatusEnum, { nullable: true }) status?: OrdersStatusEnum;
}

@InputType()
export class InputDeleteOrdersAccounts  {
    @Field(() => Int) id!: number;
}