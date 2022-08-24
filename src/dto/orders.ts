import { AccountMetaTraderEnum, InvoicesEnum, OrdersDirectionEnum, OrdersStatusEnum, OrdersTypeEnum } from '@prisma/client';
import { ObjectType, Field, InputType, Int, registerEnumType} from 'type-graphql';
import { ObjectOrdersAccounts } from './ordersAccount';

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
export class ObjectOrders  {

	@Field(() => Int, { nullable: true }) id?: number;
	@Field(() => String, { nullable: true }) par?: string;
	@Field(() => OrdersDirectionEnum, { nullable: true }) direction?: OrdersDirectionEnum;
	@Field(() => Int, { nullable: true }) lote?: number;
	@Field(() => Int, { nullable: true }) ticket?: number;
	@Field(() => String, { nullable: true }) local?: string;
	@Field(() => OrdersTypeEnum, { nullable: true }) type?: OrdersTypeEnum;
	@Field(() => OrdersStatusEnum, { nullable: true }) status?: OrdersStatusEnum;
	@Field(() => [ObjectOrdersAccounts], { nullable: true }) OrdersAccount?: ObjectOrdersAccounts[];
	@Field(() => Date, { nullable: true }) createdAt?: Date;
	@Field(() => Date, { nullable: true }) updatedAt?: Date;

}

@InputType()
export class InputNewtOrders  {

	@Field(() => String) par!: string;
	@Field(() => OrdersDirectionEnum) direction!: OrdersDirectionEnum;
	@Field(() => Int) lote!: number;
	@Field(() => Int) ticket!: number;
	@Field(() => String) local!: string;
	@Field(() => OrdersTypeEnum) type!: OrdersTypeEnum;
	@Field(() => OrdersStatusEnum) status!: OrdersStatusEnum;

}


@InputType()
export class InputUpdateOrdersSite  {
    @Field(() => Int) id!: number;
	@Field(() => OrdersStatusEnum, { nullable: true }) status?: OrdersStatusEnum;
}
@InputType()
export class InputUpdateOrders  {
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
export class InputDeleteOrders  {
    @Field(() => Int) id!: number;
}

@InputType()
export class ObjectFilterAccountOrders   {
    @Field(() => [String]) local!: string[];
}


