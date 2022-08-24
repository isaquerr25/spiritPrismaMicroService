import { InputAccountMetaTraderSingleFind, InputChangeAccountMetaTrader, ObjectAccountFilterAccount } from './../dto/accountMetaTrader';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';
import { GraphState } from '../dto/utils';
import { CreateUser, LoginUser, PasswordAlter, UserAll, UserCash, UserHaveComponents, WalletAlter } from '../dto/user';
import { getTokenId, HashGenerator, validateCreateUser, validateLogin, validatePassword } from '../utils';
import { validate } from 'bitcoin-address-validation';
import { isUserAuth } from '../middleware/isUserAuth';
import { isManagerAuth } from '../middleware/isManagerAuth';
import { InputIdUser, InputUpdateAccountMetaTraderStaff, ObjectAccountMetaTraderStaff, StaffActivity, StaffInfoUserComponents } from '../dto/staff';
import { addDays } from 'date-fns';
import { ObjectAccountFindToUser } from '../dto/accountMetaTrader';
export const prisma = new PrismaClient();


@Resolver()
export class StaffResolver {

	GetValidateEmail(email: string) {
		return prisma.user.findFirst({ where: { email } });
	}

	@Mutation(() => [GraphState])
	async loginStaff(

		@Arg('data', () => LoginUser) data: LoginUser,
		@Ctx() ctx: any
	) {

		const businessEnum = ['ADMIN','MANAGER','DEVELOPER','TESTER'];
		const newValidateUser: GraphState[] = [];

		const haveEmail = await this.GetValidateEmail(data.email);




		if (haveEmail) {

			if (!businessEnum.includes(haveEmail.Role.toString())) {
				
				newValidateUser.push({
					field: 'error',
					message: 'email or password wrong',
				});
				return newValidateUser;
			}

			const coke = await validateLogin(
				haveEmail.password,
				data.password,
				haveEmail.id,
				haveEmail.Role.toString()
			);
			console.log('coke =============================>', coke);

			if (coke) {
				const { res } = ctx;

				res.cookie('access-token', coke);

				newValidateUser.push({
					field: 'success',
					message: 'login success',
				});
			} else {
				//password wrong
				newValidateUser.push({
					field: 'access',
					message: 'email or password wrong',
				});
			}
		} else {
			//email wrong
			newValidateUser.push({
				field: 'access',
				message: 'email or password wrong',
			});
		}

		return newValidateUser;
	}

	@UseMiddleware(isManagerAuth)
	@Query(() => ObjectAccountMetaTraderStaff, { nullable: true })
	async accountMetaTraderSingleFindStaff( 
		@Arg('data') data: InputAccountMetaTraderSingleFind, 
		@Ctx() ctx: any) {
			
		const value =  await prisma.accountMetaTrader.findFirst({
			where:{

				id:data.id
			},
			include:{ OrdersAccount:{where:{status:'OPEN'}},user:true }
		});

		return value;
	}


	@UseMiddleware(isManagerAuth)
	@Mutation(() => GraphState, { nullable: true })
	async accountMetaTraderUpdateStaff(
		@Arg('data', () => InputUpdateAccountMetaTraderStaff) data: InputUpdateAccountMetaTraderStaff,
		@Ctx() ctx: any	)
	{
		try {

			await prisma.accountMetaTrader.update({
				where: { id: data.id },
				data: { 
					...data,
					local: {
						
						set: data.local
					}
				},
			});
			return { field: 'success', message: 'change Information' };
		} catch (errors) {
			console.log('errors', errors);
			return { field: 'error', message: errors };
		}
				
		
		return { field: 'update', message: '404' };
	}
	/* -------------------------------------------------------------------------- */


	
}



const getTypeTransition = (
	arrayNow:[]|any,
	type:'DEPOSIT'|'WITHDRAW'|'INVEST'|'COMPLETE_CYCLE',
	lent=true) =>{
	
	let cont =0;
	if(lent){
		arrayNow.reduce(function (previous:unknown, key:any) {
			if(!key.state){return previous;}
			if(key.state == 'COMPLETE'){
				if(key.action ==type){
					cont++;
				}
			}
			return previous;
		}, { value: 0 });

	}else{

		arrayNow.reduce(function (previous:unknown, key:any) {
			if(key.state === 'COMPLETE'){
				if(type==='DEPOSIT'){
					console.log('DEPOSIT',key);
					console.log('DEPOSIT',Number(key.value));
				}
				if(key.action ===type){
					cont+=Number(key.value);
				}
			}
			
			return previous;

		}, { value: 0 });
	}
	return cont;
	
};


const getTypeCycle = (
	arrayNow:[]|any,
	type:'PROCESS'|'CANCEl'|'ACTIVE'|'COMPLETE',
	lent=true) =>{
	let cont =0;
	if(lent){
		arrayNow.reduce(function (previous:unknown, key:any) {
			if(key.state == type){
				cont++;

			}
			return previous;
		}, { value: 0 });

	}else{
		
		arrayNow.reduce(function (previous:unknown, key:any) {
			if(key.state === type){
				cont+=Number(key.valueUSD);
			}
			return previous;
		}, { value: 0 });
	}
	return cont;
	
};