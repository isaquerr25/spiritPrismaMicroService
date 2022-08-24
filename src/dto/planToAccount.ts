import { ObjectPlanInvoicesComplete } from './planInvoices';
import { PlanToAccount, PlanToAccountStatusEnum } from '@prisma/client';
import { Field, ObjectType } from 'type-graphql';
import { ObjectAccountFilterAccount } from './accountMetaTrader';

@ObjectType()
export class ObjectPlanToAccount implements PlanToAccount {
	@Field(() => Number, { nullable: true }) id!: number;
    @Field(() => String, { nullable: true }) status!: PlanToAccountStatusEnum ;
	@Field(() => Number, { nullable: true }) planInvoicesId!: number;
	@Field(() => Number, { nullable: true }) accountMetaTraderId!: number;
    @Field(() => Date, { nullable: true }) createdAt!: Date;
    @Field(() => ObjectPlanInvoicesComplete, { nullable: true }) PlanInvoices!: ObjectPlanInvoicesComplete;
    @Field(() => ObjectAccountFilterAccount, { nullable: true }) AccountMetaTrader!: ObjectAccountFilterAccount;
    
}