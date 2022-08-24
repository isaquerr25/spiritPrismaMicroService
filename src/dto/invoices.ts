import { ObjectAccountMetaTrader } from './accountMetaTrader';
import { AccountMetaTraderEnum, InvoicesEnum } from '@prisma/client';
import { ObjectType, Field, InputType, Int, registerEnumType} from 'type-graphql';
import { LoginUser } from './user';

@ObjectType()
export class ObjectInvoices  {
	@Field(() => Int, { nullable: true }) id?: number;
	@Field(() => Int, { nullable: true }) accountMetaTraderId?: number;
	@Field(() => Int, { nullable: true }) valueDollar?: number;
	@Field(() => Int, { nullable: true }) valueReal?: number;
	@Field(() => Int, { nullable: true }) dollarQuote?: number;
	@Field(() => Int, { nullable: true }) percentProfit?: number;
	@Field(() => Int, { nullable: true }) percentFess?: number;
	@Field(() => Int, { nullable: true }) percentAffiliated?: number;
	@Field(() => Int, { nullable: true }) valueOrigin?: number;
	@Field(() => InvoicesEnum, { nullable: true }) status?: InvoicesEnum;
	@Field(() => Date, { nullable: true }) createdAt?: Date;
	@Field(() => Date, { nullable: true }) paymenbeginDate?: Date;
	@Field(() => Date, { nullable: true }) paymentDate?: Date;
	@Field(() => Date, { nullable: true }) updatedAt?: Date;
	@Field(() => ObjectAccountMetaTrader, { nullable: true }) metaTraderRefr?: ObjectAccountMetaTrader;
	@Field(() => Date, { nullable: true }) PaymentProof?: Date;
	@Field(() => Date, { nullable: true }) expirationDate?: Date;
	
}

registerEnumType(InvoicesEnum, {
	name: 'InvoicesEnum',

});




@InputType()
export class InputNewInvoices {

	@Field(() => Int, { nullable: true }) idPlanToAccount!: number; 
	@Field(() => Int, { nullable: true }) accountNumber?: number; 
	@Field(() => Int) profit!: number; 
	@Field(() => Int) capital!: number;
	@Field(() => Int, { nullable: true }) planInvoicesId?: number; 
	
}

@InputType()
export class InputInvoicesAuth {

	@Field(() => LoginUser) auth!: LoginUser; 
	@Field(() => InputNewInvoices) inputsProgress!: InputNewInvoices; 	
}


@InputType()
export class InputObjectInvoicesStaff  {

	@Field(() => Int) id!: number;
	@Field(() => Int, { nullable: true }) valueDollar?: number;
	@Field(() => Int, { nullable: true }) valueReal?: number;
	@Field(() => Int, { nullable: true }) dollarQuote?: number;
	@Field(() => Int, { nullable: true }) percentProfit?: number;
	@Field(() => Int, { nullable: true }) percentFess?: number;
	@Field(() => Int, { nullable: true }) percentAffiliated?: number;
	@Field(() => Int, { nullable: true }) valueOrigin?: number;
	@Field(() => InvoicesEnum, { nullable: true }) status?: InvoicesEnum;
	@Field(() => Date, { nullable: true }) paymenbeginDate?: Date;
	@Field(() => Date, { nullable: true }) paymentDate?: Date;
	@Field(() => Date, { nullable: true }) PaymentProof?: Date;
	@Field(() => Date, { nullable: true }) expirationDate?: Date;
	
}
