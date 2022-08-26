
import { createTokenAffiliate } from './../utils/index';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';
import { GraphState, PassToken, SendToken } from '../dto/utils';
import { CreateUser, LoginUser, PasswordAlter, UserAll, UserCash, UserHaveComponents, WalletAlter, NumberTelephoneAlter, ForgetPasswordAlter, ForgetPasswordNewAlter, InputUserBaseInfo, UserAccountStaff } from '../dto/user';
import { decodeTokenType, getTokenId, HashGenerator, validateCreateUser, validateLogin, validatePassword, validationNumberPhone } from '../utils';
import { validate } from 'bitcoin-address-validation';

import { isManagerAuth } from '../middleware/isManagerAuth';
import { number } from 'yup';
import { isLogs } from '../middleware/isLogs';
import { isUserAuth } from '../middleware/isUserAuth';
export const prisma = new PrismaClient();


enum DocumentEnum {
	'INVALID',
	'PROCESS',
	'VALID',
}
@Resolver()
export class UserResolver {

	@UseMiddleware(isManagerAuth)
	@Query(() => [UserAll], { nullable: true })
	async allUsers() {
		return prisma.user.findMany();
	}

	@UseMiddleware(isManagerAuth)
	@Query(() => [UserAccountStaff], { nullable: true })
	async allUsersAccountStaff() {
		return await prisma.user.findMany({include:{AccountMetaTrader:true}});
	}

	GetValidateEmail(email: string) {
		return prisma.user.findFirst({ where: { email } });
	}



	@UseMiddleware(isUserAuth)
	@Mutation(() => GraphState, { nullable: true })
	async  userBaseInfoUpdate(

		@Arg('data', () => InputUserBaseInfo) data: InputUserBaseInfo,
		@Ctx() ctx: any	)
	{
		let newValidateUser = {};

		const currentToken = getTokenId(ctx)?.userId;
		const newUser = await prisma.user.findFirst({
			where: { id: currentToken},
		});

		if (!currentToken || !newUser){
			newValidateUser = {
				field: 'account',
				message: 'Account not exist',
			};
			return newValidateUser;
		}
		const validNumberTelephone = validationNumberPhone(data.numberTelephone);
		if(data.name.trim() === ''){
			return { field: 'error', message: 'name empty' };
		}

		if (validNumberTelephone) {

			if (currentToken != null) {
				console.log('await');
				try {

					await prisma.user.update({
						where: { id: currentToken },
						data: {  
							name: data.name,
							numberTelephone: data.numberTelephone 
						},
					});

					return { field: 'success', message: 'change information' };

				} catch (errors) {
					console.log(errors);
					return { field: 'error', message: 'erro in alter information, try later' };

				}
			}
			else {

				return { field: 'error', message: 'Do not have access' };
			}
		} else {
			return {
				field: 'Number',
				message:'Number invalid, try another Number',
			};
		}
	}

	@UseMiddleware(isUserAuth)
	@Mutation(() => GraphState, { nullable: true })
	async userWalletUpdate(

		@Arg('data', () => WalletAlter) data: WalletAlter,
		@Ctx() ctx: any	)
	{
		let newValidateUser = {};

		const currentToken = getTokenId(ctx)?.userId;
		const newUser = await prisma.user.findFirst({
			where: { id: currentToken},
		});

		if (!currentToken || !newUser){
			newValidateUser = {
				field: 'account',
				message: 'Account not exist',
			};
			return newValidateUser;
		}
		if (!data.wallet || data.wallet.trim() ==''){
			newValidateUser = {
				field: 'error',
				message: 'send address valid',
			};
			return newValidateUser;
		}

		if (currentToken != null) {
			console.log('await');
			try {

				await prisma.user.update({
					where: { id: currentToken },
					data: { hashPayment: data.wallet },
				});

				return { field: 'success', message: 'change value' };

			} catch (errors) {

				return { field: 'error', message: 'error on change try later' };
			}
		}
		else {
			return { field: 'error', message: 'Do not have access' };
		}
		
	}

	@UseMiddleware(isUserAuth)
	@Query(() => SendToken, { nullable: true })
	async userLinkAffiliate( @Ctx() ctx: any ){

		const currentToken = getTokenId(ctx)?.userId;
		
	}
}
