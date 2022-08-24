
import { isUserAuth } from '../middleware/isUserAuth';
import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';
import { InvoicesEnum, PrismaClient, AccountMetaTrader, PlanInvoices } from '@prisma/client';
import { GraphState } from '../dto/utils';
import { 
	InputChangeAccountMetaTrader, 
	InputDeleteAccountMetaTrader, 
	InputNewAccountMetaTrader, InputStopWorkAccountMetaTrader, ObjectAccountMetaTrader } from '../dto/accountMetaTrader';
import { getTokenId } from '../utils';
import { InputNewInvoices, ObjectInvoices } from '../dto/invoices';
import { InputNewPlanInvoices, InputUpdatePlanInvoices, ObjectPlanInvoices } from '../dto/planInvoices';
import { isManagerAuth } from '../middleware/isManagerAuth';
import { ObjectFilterAccountOrders } from '../dto/orders';
import { ObjectPlanToAccount } from '../dto/planToAccount';
export const prisma = new PrismaClient();


@Resolver()
export class PlanInvoicesResolver {

	@UseMiddleware(isManagerAuth)
	@Mutation(() => [GraphState])
	async planInvoicesCreate(@Arg('data', () => InputNewPlanInvoices) 
		data: InputNewPlanInvoices,
		@Ctx() ctx: any	
	) {

		const beginMoth = new Date();
		beginMoth.setHours(0);
		beginMoth.setMinutes(0);
		beginMoth.setSeconds(0);
		beginMoth.setDate(1);

		const progressInfo = [{}];
		if( data.beginDate === undefined || 
			data.finishDate === undefined || 
			data.realDollarQuote === undefined 
		){

			if(data.beginDate === undefined){
				progressInfo.push({
					field: 'beginDate',
					message: 'beginDate is empty',
				});
			}
			if(data.finishDate === undefined){
				progressInfo.push({
					field: 'finishDate',
					message: 'finishDate is empty',
				});
			}
			if(data.realDollarQuote === undefined){
				progressInfo.push({
					field: 'realDollarQuote',
					message: 'realDollarQuote is empty',
				});
			}
			return progressInfo;
		}   
		try {

			
			const accountTo = await prisma.accountMetaTrader.findMany({
				where:{
					local:{
						hasSome:[data.local]
					},
					invoices:{
						none:{
							createdAt:{
								gte:beginMoth
							}
						}
					}
				}
			});

			if(accountTo.length === 0){
				progressInfo.push({
					field: 'already have invoice to moth',
					message: 'error',
				});
				return progressInfo;
			}

			const plan = await prisma.planInvoices.create({ data });
		
			const resultMap = accountTo.map((item) =>{
				return {
					accountMetaTraderId:item.id,
					planInvoicesId:plan.id,
				};
			});

			await prisma.planToAccount.createMany(
				{ data:resultMap}
			);
			
			progressInfo.push({
				field: 'create',
				message: 'success',
			});

		} catch(error) {
			console.log('bad :',error);
			progressInfo.push({
				field: 'create',
				message: 'error',
			});

		}
		return progressInfo;
	}

	@UseMiddleware(isManagerAuth)
	@Query(() => [ObjectPlanInvoices], { nullable: true })
	async planInvoicesAll() {
		return prisma.planInvoices.findMany();
	}


	@UseMiddleware(isManagerAuth)
	@Mutation(() => [GraphState])
	async planInvoicesUpdate(@Arg('data', () => InputUpdatePlanInvoices) 
		data: InputUpdatePlanInvoices,
		@Ctx() ctx: any	
	) {
		
		const progressInfo = [{}];

		try {

			await prisma.planInvoices.update({where:{id:data.id},  data });
			progressInfo.push({
				field: 'update',
				message: 'success',
			});

		} catch(error) {
			console.log('bad :',error);
			progressInfo.push({
				field: 'update',
				message: 'error',
			});

		}
		return progressInfo;
	}



	@Query(() => [ObjectPlanToAccount], { nullable: true })
	async planInvoiceLocalPython( @Arg('data') data: ObjectFilterAccountOrders)  {

		const yesterday = new Date();
		yesterday.setHours(0);
		yesterday.setMinutes(0);
		yesterday.setSeconds(0);
		
		const finishDay = new Date();
		finishDay.setHours(23);
		finishDay.setMinutes(59);
		finishDay.setSeconds(59);

		const beginMoth = new Date();
		beginMoth.setHours(0);
		beginMoth.setMinutes(0);
		beginMoth.setSeconds(0);
		beginMoth.setDate(1);

		return await prisma.planToAccount.findMany({
			where:{
				status:'OPEN',
				createdAt: {gte:yesterday,lte:finishDay},
				PlanInvoices:{
					local:{in :data.local}
				}
			},
			include:{
				AccountMetaTrader:true,
				PlanInvoices:true
			}
		});
	}
	
}