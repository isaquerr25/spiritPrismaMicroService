
import { createTokenAffiliate } from './../utils/index';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';
import { GraphState, PassToken, SendToken } from '../dto/utils';
import { CreateUser, LoginUser, PasswordAlter, UserAll, UserCash, UserHaveComponents, WalletAlter, NumberTelephoneAlter, ForgetPasswordAlter, ForgetPasswordNewAlter, InputUserBaseInfo, UserAccountStaff } from '../dto/user';
import { decodeTokenType, getTokenId, HashGenerator, validateCreateUser, validateLogin, validatePassword, validationNumberPhone } from '../utils';
import { validate } from 'bitcoin-address-validation';

import { isManagerAuth } from '../middleware/isManagerAuth';
import emailValidSend, { emailForgetPasswordSend } from '../systemEmail';
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

	@Mutation(() => [GraphState])
	async createUserResolver(@Arg('data', () => CreateUser) data: CreateUser) {

		const stateReturn = await validateCreateUser(data);

		if (await prisma.user.findFirst({ where: { email: data.email } })) {

			stateReturn.push({
				field: 'error',
				message: 'this email already exists',
			});

			return stateReturn;

		}

		if (stateReturn.length == 0) {

			try {
				data.password = await HashGenerator(data.password);
				const createUser = await prisma.user.create({ data:{
					name:data.name,
					email:data.email,
					password:data.password,
					affiliatedId: decodeTokenType(data.affiliate)?.userId

				} });
				console.log(createUser);
				emailValidSend(createUser);
				stateReturn.push({
					field: 'create',
					message: 'success',
				});

			} catch(error){
				console.log(error);
				stateReturn.push({
					field: 'error',
					message: 'erro in create account',
				});
			
			}

		} else {

			stateReturn.push({
				field: 'create',
				message: 'contact the support',
			});

		}

		return stateReturn;

	}

	GetValidateEmail(email: string) {
		return prisma.user.findFirst({ where: { email } });
	}


	@Mutation(() => [GraphState])
	async loginAuthUser(
		@Arg('data', () => LoginUser) data: LoginUser,
		@Ctx() ctx: any
	) {
		console.log('ctx');
		const newValidateUser: GraphState[] = [];


		const haveEmail = await this.GetValidateEmail(data.email);
		
		if (haveEmail) {
			if(haveEmail?.confirm != 'Valid'){
				emailValidSend(haveEmail);
				newValidateUser.push({
					field: 'access',
					message: 'email sent to confirm an account',
				});
			
				return newValidateUser;
			}
			const coke = await validateLogin(
				haveEmail.password,
				data.password,
				haveEmail.id,
				haveEmail.Role
			);


			console.log('coke =============================>', coke);

			if (coke) {
				const { res } = ctx;

				res.cookie('access-token', coke,{maxAge: 1000 * 60 * 60 * 24 * 7,});

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

	@UseMiddleware(isUserAuth)
	@Mutation(() => GraphState, { nullable: true })
	async updateAuthPassword(
		@Arg('data', () => PasswordAlter) data: PasswordAlter,
		@Ctx() ctx: any	)
	{
		let newValidateUser = {};

		const currentToken = getTokenId(ctx)?.userId;
		const newUser = await prisma.user.findFirst({
			where: { id: currentToken },
		});
		if (!currentToken || !newUser){
			newValidateUser = {
				field: 'password',
				message: 'Account not exist',
			};
			return newValidateUser;
		}
		if (validatePassword(data.oldPassword)) {
			console.log('asd');
			if (data.password == data.oldPassword) {
				newValidateUser = {
					field: 'password',
					message: 'The old password is same new password',
				};
				return newValidateUser;
			}
			if (currentToken != null) {
				console.log('await');
				if (await bcrypt.compare(data.oldPassword, newUser.password))
				{
					console.log('s');
					const newPassword= await HashGenerator(data.password);
					try {
						await prisma.user.update({
							where: { id: currentToken },
							data: { password: newPassword },
						});
						return { field: 'success', message: 'change password' };
					} catch (errors) {
						return { field: 'update', message: errors };
					}
				} else {
					return {
						field: 'password',
						message: 'The old password is not the same',
					};
				}
			} else {
				return { field: 'Server', message: 'Do not have access' };
			}
		} else {
			return {
				field: 'new password',
				message:
						'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
			};
		}
		return { field: 'old password', message: '404' };
	}


	@UseMiddleware(isUserAuth)
	@Mutation(() => GraphState, { nullable: true })
	async updateNumberTelephone(

		@Arg('data', () => NumberTelephoneAlter) data: NumberTelephoneAlter,
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
		const validNumberTelephone =validationNumberPhone(data.numberTelephone);

		if (validNumberTelephone) {
			console.log('asd');
			if (currentToken != null) {
				console.log('await');
				try {

					await prisma.user.update({
						where: { id: currentToken },
						data: { numberTelephone: data.numberTelephone },
					});

					return { field: 'success', message: 'change Number' };

				} catch (errors) {

					return { field: 'Number', message: errors };
				}
			}
			else {
				return { field: 'Server', message: 'Do not have access' };
			}
		} else {
			return {
				field: 'Number',
				message:'Number invalid, try another Number',
			};
		}
	}

	@Mutation(()=>Boolean,{nullable:true})
	async logout(@Ctx() ctx: any) {
		const { res } = ctx;
		res.clearCookie('access-token');
		return null;
	}


	@Mutation(() => GraphState, { nullable: true })
	async resolverForgetPassword(

		@Arg('data', () => ForgetPasswordAlter) data: ForgetPasswordAlter)
	{
		let newValidateUser = {};
		const newUser = await prisma.user.findFirst({
			where: { email: data.email},
		});
		
		if(newUser==null){
			newValidateUser = {
				field: 'account',
				message: 'Account not exist',
			};
			return newValidateUser;
		}
		const emailSendBack = await emailForgetPasswordSend(newUser);
		if(emailSendBack == 'success'){
			newValidateUser = {
				field: 'success',
				message: 'Email Send',
			};
			return newValidateUser;
		}

		newValidateUser = {
			field: 'Error',
			message: 'Try later',
		};

		return newValidateUser;
	}

	@Mutation(() => GraphState, { nullable: true })
	async newPassword(@Arg('data', () => ForgetPasswordNewAlter) data: ForgetPasswordNewAlter)
	{
		let newValidateUser = {};
		
		console.log('currentToken ');
		const decodeValid = decodeTokenType(data.token) ?? null;
		if(decodeValid === null){
			newValidateUser = {
				field: 'error',
				message: 'Token Invalid',
			};
			return newValidateUser;
		}
		const currentToken = decodeValid.userId;
		console.log('currentToken ==> ', currentToken);
		const newUser = await prisma.user.findFirst({
			where: { id: currentToken },
		});
		if (!currentToken || !newUser){
			newValidateUser = {
				field: 'password',
				message: 'Account not exist',
			};
			return newValidateUser;
		}

		const newPassword= await HashGenerator(data.password);
		try {
			await prisma.user.update({
				where: { id: currentToken },
				data: { password: newPassword },
			});
			return { field: 'success', message: 'change password' };
		} catch (errors) {
			return { field: 'update', message: errors };
		}
	}

	@Mutation(() => GraphState)
	async userValidAccount(@Arg('data', () => PassToken) data: PassToken) {

		
		let newValidateUser = {};

		const tokenOpen = decodeTokenType(data.token);

		if (tokenOpen === null || tokenOpen.userId == null){
			newValidateUser = {
				field: 'error',
				message: 'token invalid',
			};
			return newValidateUser;
		}
		try{

			const newUser = await prisma.user.update({
				where: { id: tokenOpen.userId },
				data:{confirm:'Valid'}
			});
			newValidateUser = {
				field: 'success',
				message: 'account valid',
			};
			return newValidateUser;
		}catch(error){
			newValidateUser = {
				field: 'error',
				message: 'error alter status account',
			};
			return newValidateUser;
		}
	}


	@UseMiddleware(isUserAuth)
	@Query(() => UserHaveComponents, { nullable: true })
	async userInfoDocument(	@Ctx() ctx: any	){

		const currentToken = getTokenId(ctx)?.userId;
		const user = await prisma.user.findFirst({
			where: { id: currentToken},
		});

		const token:string = createTokenAffiliate(currentToken,'');
		
		return ({...user,'affiliate':token});
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
