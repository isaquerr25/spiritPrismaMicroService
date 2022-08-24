import { InputUpdateLoteAutoCalculate, InputDeleteLoteAutoCalculate, SendId } from './../dto/loteAutoCalculate';
import { InputDeleteOrders, InputNewtOrders, InputUpdateOrders, ObjectOrders } from './../dto/orders';
import { isUserAuth } from '../middleware/isUserAuth';
import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';
import { InvoicesEnum, LoteAutoCalculateDangerEnum, PrismaClient } from '@prisma/client';
import { GraphState } from '../dto/utils';
import { InputChangeAccountMetaTrader, InputDeleteAccountMetaTrader, InputNewAccountMetaTrader, InputStopWorkAccountMetaTrader, ObjectAccountMetaTrader } from '../dto/accountMetaTrader';
import { getTokenId } from '../utils';
import { InputNewInvoices, ObjectInvoices } from '../dto/invoices';
import { InputNewPlanInvoices, InputUpdatePlanInvoices, ObjectPlanInvoices } from '../dto/planInvoices';
import { isManagerAuth } from '../middleware/isManagerAuth';
import { InputNewLoteAutoCalculate, ObjectLoteAutoCalculate } from '../dto/loteAutoCalculate';
export const prisma = new PrismaClient();


@Resolver()
export class LoteAutoCalculateResolver {
	
	@UseMiddleware(isManagerAuth)
	@Query(() => [ObjectLoteAutoCalculate], { nullable: true })
	async loteAutoCalculateAll() {
		return await prisma.loteAutoCalculate.findMany();
	}

	@UseMiddleware(isManagerAuth)
	@Query(() => ObjectLoteAutoCalculate, { nullable: true })
	async loteAutoCalculateSingleFindStaff(@Arg('data', () => SendId ) 
		data: SendId,
		@Ctx() ctx: any	
	) {

		return	await prisma.loteAutoCalculate.findFirst({ where:{id:data.id} });	

	}
	@UseMiddleware(isManagerAuth)
	@Mutation(() => [GraphState])
	async loteAutoCalculateCreate(@Arg('data', () => InputNewLoteAutoCalculate) 
		data: InputNewLoteAutoCalculate,
		@Ctx() ctx: any	
	) {
		
		const progressInfo = [{}];
		if( data.maxLot !== undefined &&
			data.minLot !== undefined && 
			data.maxLot < data.minLot  
		){

			progressInfo.push({
				field: 'maxLot < minLot ',
				message: 'minLot < maxLot can not have same value',
			});
			
			return progressInfo;
		}

		if( data.minCapital === undefined || 
			data.maxCapital === undefined || 
			data.local === undefined || 
			data.valueBase === undefined || 
			data.type === undefined || 
			data.minCapital  > data.maxCapital || 
			data.styleMath === undefined 
		){

			if(data.minCapital  > data.maxCapital){
				progressInfo.push({
					field: 'minCapital > maxCapital ',
					message: 'minCapital > maxCapital can not have same value ',
				});
			}
			if(data.minCapital === undefined){
				progressInfo.push({
					field: 'minCapital',
					message: 'minCapital is empty',
				});
			}
			if(data.maxCapital === undefined){
				progressInfo.push({
					field: 'maxCapital',
					message: 'maxCapital is empty',
				});
			}
			if(data.local === undefined){
				progressInfo.push({
					field: 'local',
					message: 'local is empty',
				});
			}
			if(data.valueBase === undefined){
				progressInfo.push({
					field: 'valueBase',
					message: 'valueBase is empty',
				});
			}
			if(data.type === undefined){
				progressInfo.push({
					field: 'type',
					message: 'type is empty',
				});
			}
			if(data.styleMath === undefined){
				progressInfo.push({
					field: 'styleMath',
					message: 'styleMath is empty',
				});
			}
			return progressInfo;
		}   
		try {

			await prisma.loteAutoCalculate.create({ data });
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
	@Mutation(() => [GraphState])
	async loteAutoCalculateUpdate (@Arg('data', () => InputUpdateLoteAutoCalculate) 
		data: InputUpdateLoteAutoCalculate,
		@Ctx() ctx: any	
	) {
		
		const progressInfo = [{}];
		

		if( data.id === undefined ){
			if(data.id === undefined){
				progressInfo.push({
					field: 'id',
					message: 'id is empty',
				});
			}
			return progressInfo;
		}   
		try {

			await prisma.loteAutoCalculate.update({where:{id:data.id}, data });
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

	@UseMiddleware(isManagerAuth)
	@Mutation(() => [GraphState])
	async loteAutoCalculateDelete (@Arg('data', () => InputDeleteLoteAutoCalculate) 
		data: InputDeleteLoteAutoCalculate,
		@Ctx() ctx: any	
	) {
		
		const progressInfo = [{}];
		if( data.id === undefined ){
			if(data.id === undefined){
				progressInfo.push({
					field: 'id',
					message: 'id is empty',
				});
			}
			return progressInfo;
		}   
		try {

			await prisma.loteAutoCalculate.delete({where:{id:data.id}});
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
export const loteRangeInfluence = async (balance:number,local:string) => {
	const typeRange = await prisma.loteAutoCalculate.findMany({where:{local:local}});
	
	for(let i=0; i< typeRange.length;i++){
		//console.log('typeRange[i] ',typeRange[i],balance,typeRange[i].minCapital <= balance, typeRange[i].maxCapital >= balance );
		if(typeRange[i].minCapital <= balance && typeRange[i].maxCapital >= balance ){
			
			return typeRange[i];
		}
	}
	return null;
};