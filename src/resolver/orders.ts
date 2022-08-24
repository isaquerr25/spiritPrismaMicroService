import { InputDeleteOrders, InputNewtOrders, InputUpdateOrders, InputUpdateOrdersSite, ObjectFilterAccountOrders, ObjectOrders } from './../dto/orders';
import { isUserAuth } from '../middleware/isUserAuth';
import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';
import { InvoicesEnum, PrismaClient, Orders, AccountMetaTraderEnum, AccountMetaTraderTypeEnum, accountTypeEnum, OrdersAccount } from '@prisma/client';
import { GraphState, PassToken, SendToken } from '../dto/utils';
import { InputChangeAccountMetaTrader, InputDeleteAccountMetaTrader, InputNewAccountMetaTrader, InputStopWorkAccountMetaTrader, ObjectAccountFilterAccount, ObjectAccountMetaTrader } from '../dto/accountMetaTrader';
import { getTokenId } from '../utils';
import { InputNewInvoices, ObjectInvoices } from '../dto/invoices';
import { InputNewPlanInvoices, InputUpdatePlanInvoices, ObjectPlanInvoices } from '../dto/planInvoices';
import { isManagerAuth } from '../middleware/isManagerAuth';
import { length } from 'class-validator';
import { loteRangeInfluence } from './loteAutoCalculate';
export const prisma = new PrismaClient();


@Resolver()
export class OrdersResolver {

	@UseMiddleware(isManagerAuth)
	@Query(() => [ObjectOrders], { nullable: true })
	async ordersAll() {
		return prisma.orders.findMany({include:{OrdersAccount:true}});
	}

	@UseMiddleware(isManagerAuth)
	@Query(() => ObjectOrders, { nullable: true })
	async ordersFindSingleOrderStaff( 
		@Arg('data') data: PassToken, 
		@Ctx() ctx: any){
		return prisma.orders.findFirst({where:{id:Number(data.token ?? 0)}, include:{OrdersAccount:true}});
	}

	@UseMiddleware(isManagerAuth)
	@Mutation(() => GraphState)
	async ordersUpdateSite(@Arg('data', () => InputUpdateOrdersSite) 
		data: InputUpdateOrders,
		@Ctx() ctx: any	
	) {
		
		const progressInfo = [{}];

		try {

			await prisma.orders.update({ where:{id:data.id} ,data });
			return{
				field: 'update',
				message: 'success',
			};

		} catch(error) {
			console.log('bad :',error);
			return{
				field: 'update',
				message: 'error',
			};

		}
		return progressInfo;
	}

	@UseMiddleware(isManagerAuth)
	@Mutation(() => [GraphState])
	async ordersDeleteSite(@Arg('data', () => InputDeleteOrders) 
		data: InputDeleteOrders,
		@Ctx() ctx: any	
	) {
		
		const progressInfo = [{}];

		try {

			await prisma.orders.delete({ where:{id:data.id} });
			progressInfo.push({
				field: 'delete',
				message: 'success',
			});

		} catch(error) {
			console.log('bad :',error);
			progressInfo.push({
				field: 'delete',
				message: 'error',
			});

		}
		return progressInfo;
	}	


	@Mutation(() => [GraphState])
	async ordersCreate(@Arg('data', () => InputNewtOrders) 
		data: InputNewtOrders,
		@Ctx() ctx: any	
	) {
		
		const progressInfo = [{}];
		if( data.par === undefined || 
			data.direction === undefined || 
			data.ticket === undefined || 
			data.local === undefined || 
			data.type === undefined || 
			data.lote === undefined 
		){

			if(data.lote === undefined){
				progressInfo.push({
					field: 'lote',
					message: 'lote is empty',
				});
			}
			if(data.type === undefined){
				progressInfo.push({
					field: 'type',
					message: 'type is empty',
				});
			}
			if(data.local === undefined){
				progressInfo.push({
					field: 'local',
					message: 'local is empty',
				});
			}
			if(data.par === undefined){
				progressInfo.push({
					field: 'par',
					message: 'par is empty',
				});
			}
			if(data.direction === undefined){
				progressInfo.push({
					field: 'direction',
					message: 'direction is empty',
				});
			}
			if(data.ticket === undefined){
				progressInfo.push({
					field: 'ticket',
					message: 'ticket is empty',
				});
			}
			return progressInfo;
		}   
		try {

			await prisma.orders.create({ data });
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
	
	@Mutation(() => GraphState)
	async ordersUpdate(@Arg('data', () => InputUpdateOrders) 
		data: InputUpdateOrders,
		@Ctx() ctx: any	
	) {


		try {

			await prisma.orders.update({ where:{id:data.id} ,data });
			return{
				field: 'success',
				message: 'update with success',
			};

		} catch(error) {
			console.log('bad :',error);
			return{
				field: 'error',
				message: 'update with error',
			};

		}

	}


	@Mutation(() => [GraphState])
	async ordersDelete(@Arg('data', () => InputDeleteOrders) 
		data: InputDeleteOrders,
		@Ctx() ctx: any	
	) {
		
		const progressInfo = [{}];

		try {

			await prisma.orders.delete({ where:{id:data.id} });
			progressInfo.push({
				field: 'delete',
				message: 'success',
			});

		} catch(error) {
			console.log('bad :',error);
			progressInfo.push({
				field: 'delete',
				message: 'error',
			});

		}
		return progressInfo;
	}	

	
}

