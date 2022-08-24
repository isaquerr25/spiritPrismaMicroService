import { ObjectAccountFilterAccount, ObjectAccountMetaTrader } from './accountMetaTrader';
import { AccountMetaTrader, AccountMetaTraderEnum, InvoicesEnum, PlanInvoices, PlanInvoicesStatusEnum, PlanInvoicesTypeEnum } from '@prisma/client';
import { ObjectType, Field, InputType, Int, registerEnumType} from 'type-graphql';

@ObjectType()
export class ObjectPlanInvoicesComplete implements  PlanInvoices  {
	@Field(() => Int, { nullable: true }) id!: number;
	@Field(() => Date, { nullable: true }) beginDate!: Date;
	@Field(() => Date, { nullable: true }) finishDate!: Date;
	@Field(() => Int, { nullable: true }) realDollarQuote!: number;
	@Field(() => Date, { nullable: true }) createdAt!: Date;
	@Field(() => Date, { nullable: true }) updatedAt!: Date;
	@Field(() => Int, { nullable: true }) accountNumber!: number;
	@Field(() => Int, { nullable: true }) grossProfitDollar!: number;
	@Field(() => Int, { nullable: true }) profitDollar!: number;
	@Field(() => Int, { nullable: true }) affiliatedProfitDollar!: number;
	@Field(() => String, { nullable: true }) local!: string;
	@Field(() => PlanInvoicesTypeEnum) type!: PlanInvoicesTypeEnum;
	@Field(() => PlanInvoicesStatusEnum) status!: PlanInvoicesStatusEnum;
	@Field(() => [ObjectAccountFilterAccount], { nullable: true }) refenceAccount?: ObjectAccountFilterAccount[] | null;

}
@ObjectType()
export class ObjectPlanInvoices  {
    @Field(() => Int, { nullable: true }) id?: number;
	@Field(() => Date, { nullable: true }) beginDate?: Date;
	@Field(() => Date, { nullable: true }) finishDate?: Date;
	@Field(() => Int, { nullable: true }) realDollarQuote?: number;
	@Field(() => Date, { nullable: true }) createdAt?: Date;
	@Field(() => Date, { nullable: true }) updatedAt?: Date;
	@Field(() => Int, { nullable: true }) accountNumber?: number;
	@Field(() => Int, { nullable: true }) grossProfitDollar?: number;
	@Field(() => Int, { nullable: true }) profitDollar?: number;
	@Field(() => Int, { nullable: true }) affiliatedProfitDollar?: number;
	@Field(() => PlanInvoicesTypeEnum) type?: PlanInvoicesTypeEnum;
	@Field(() => PlanInvoicesStatusEnum) status?: PlanInvoicesStatusEnum;
	@Field(() => [ObjectAccountFilterAccount], { nullable: true }) refenceAccount?: ObjectAccountFilterAccount[] | null;

}

registerEnumType(PlanInvoicesTypeEnum, {
	name: 'PlanInvoicesTypeEnum',

});
registerEnumType(PlanInvoicesStatusEnum, {
	name: 'PlanInvoicesStatusEnum',

});

@InputType()
export class InputNewPlanInvoices {
	@Field(() => Date) beginDate!: Date; 
	@Field(() => Date) finishDate!: Date; 
	@Field(() => Int) realDollarQuote!: number; 
	@Field(() => Int, { nullable: true }) accountNumber?: number; 
	@Field(() => PlanInvoicesTypeEnum) type?: PlanInvoicesTypeEnum; 
	@Field(() => String, { nullable: true }) local!: string;
}

@InputType()
export class InputUpdatePlanInvoices {
    @Field(() => Int) id!: number; 
	@Field(() => Date, { nullable: true }) beginDate?: Date; 
	@Field(() => Date, { nullable: true }) finishDate?: Date; 
	@Field(() => Int, { nullable: true }) realDollarQuote?: number; 
	@Field(() => Int, { nullable: true }) grossProfitDollar?: number; 
	@Field(() => Int, { nullable: true }) accountNumber?: number; 
	@Field(() => Int, { nullable: true }) profitDollar?: number; 
	@Field(() => Int, { nullable: true }) affiliatedProfitDollar?: number; 
	@Field(() => PlanInvoicesTypeEnum, { nullable: true }) type?: PlanInvoicesTypeEnum; 
	@Field(() => PlanInvoicesStatusEnum, { nullable: true }) status?: PlanInvoicesStatusEnum; 
}


@InputType()
export class InputPlanInvoicesLocalPython {
    @Field(() => [String]) local!: string[]; 
 
}

