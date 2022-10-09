import { InputObjectInvoicesStaff, InputInvoicesAuth, InputInvoicesJustAloneEmail } from './../dto/invoices';
import { isManagerAuth } from './../middleware/isManagerAuth';
import { isUserAuth } from '../middleware/isUserAuth';
import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';
import { accountTypeEnum, InvoicesEnum, PrismaClient, AccountMetaTrader, PlanToAccount } from '@prisma/client';
import { GraphState, PassToken } from '../dto/utils';
import { InputChangeAccountMetaTrader, InputDeleteAccountMetaTrader, InputNewAccountMetaTrader, InputStopWorkAccountMetaTrader, ObjectAccountMetaTrader } from '../dto/accountMetaTrader';
import { getTokenId, validateLogin } from '../utils';
import { InputNewInvoices, ObjectInvoices } from '../dto/invoices';
import { emailInvoiceStruct } from '../systemEmail';
export const prisma = new PrismaClient();


@Resolver()
export class InvoicesResolver {

	@UseMiddleware(isManagerAuth)
	@Query(() => [ObjectInvoices], { nullable: true })
	async invoiceObjectsStaff() {
		const value =  await prisma.invoices.findMany({include:{metaTraderRefr:true,paymentProof:true,PlanInvoices:true}});
		console.log(value);
		return value;
	}

	@UseMiddleware(isManagerAuth)
	@Mutation(() => GraphState, { nullable: true })
	async invoiceObjectsStaffUpdate( @Arg('data', () => InputObjectInvoicesStaff) data: InputObjectInvoicesStaff) {
		try{

			const value =  await prisma.invoices.update({
				where: { id: data.id ?? 0 },
				data: {...data}
			});
			console.log('invoiceObjectsStaffUpdate => ',value);
			return {
				field: 'success',
				message: 'alter invoice with success',
			};
		}
		catch(error){
			console.log('invoiceObjectsStaffUpdate => ', error);
			return {
				field: 'error',
				message: 'problem in alter this invoice',
			};
		}
	
	}

	@UseMiddleware(isUserAuth)
	@Query(() => [ObjectInvoices], { nullable: true })
	async invoiceObjects(@Ctx() ctx: any) {
		console.log(getTokenId(ctx)?.userId);
		const value =  await prisma.invoices.findMany({
			where:{
				metaTraderRefr:{
					userId:getTokenId(ctx)?.userId
				}
			},
			include:{metaTraderRefr:true}
		});

		return value;
	}

	@UseMiddleware(isUserAuth)
	@Query(() => [ObjectInvoices], { nullable: true })
	async invoiceObjectsOpen(@Ctx() ctx: any) {
		console.log(getTokenId(ctx)?.userId);
		const value =  await prisma.invoices.findMany({
			where:{
				status:{notIn:['PAID_OUT']},
				metaTraderRefr:{
					userId:getTokenId(ctx)?.userId
				}
			},
			include:{metaTraderRefr:true}
		});
		return value;
	}

	@UseMiddleware(isManagerAuth)
	@Query(() => ObjectInvoices, { nullable: true })
	async invoiceObjectSingleRequestStaff( @Arg('data', () => PassToken) data: PassToken,@Ctx() ctx: any) {
		const value =  await prisma.invoices.findFirst({
			where:{
				id:Number(data.token)
			},
			include:{metaTraderRefr:true}
		});

	
		const { res } = ctx;

		res.cookie('invoice', {token:value?.id} ,{maxAge: 1000 * 60 * 60 * 24,});
		
		return value;
	}

	@Query(() => ObjectInvoices, { nullable: true })
	async invoiceObjectSingleRequest( @Arg('data', () => PassToken) data: PassToken,@Ctx() ctx: any) {
		const value =  await prisma.invoices.findFirst({
			where:{
				id:Number(data.token)
			},
			include:{metaTraderRefr:true}
		});

	
		const { res } = ctx;

		res.cookie('invoice', {token:value?.id} ,{maxAge: 1000 * 60 * 60 * 24,});
		
		return value;
	}
	
	@Mutation(() => GraphState)
	async invoiceCreateStaff(@Arg('res', () => InputInvoicesAuth) 
		res: InputInvoicesAuth,
		@Ctx() ctx: any	
	) {

		

		const businessEnum = ['ADMIN','MANAGER','DEVELOPER','TESTER'];
		const newValidateUser: GraphState[] = [];
	
		const haveEmail = await prisma.user.findFirst({ where: { email: res.auth.email } });
	
		let auth = false;
	
		try{

			if (haveEmail) {
				
				if (!businessEnum.includes(haveEmail.Role.toString())) {
					
					return {
						field: 'error',
						message: 'email or password wrong',
					};
	
				}
	
				const coke = await validateLogin(
					haveEmail.password,
					res.auth.password,
					haveEmail.id,
					haveEmail.Role.toString()
				);
				console.log('coke =============================>', coke);
	
				if (coke) {
					const { res } = ctx;
	
					res.cookie('access-token', coke);
	
					auth = true;
				} else {
					auth = false;
					return{
						field: 'access',
						message: 'email or password wrong',
					};
				}
			} else {
				//email wrong
				return{
					field: 'access',
					message: 'email or password wrong',
				};
			}
		}catch{
			return{
				field: 'access',
				message: 'email or password wrong',
			};

		}
		if(!auth){
			return{
				field: 'access',
				message: 'email or password wrong',
			};

		}

		console.log('1> ' );
		const toPlan = await prisma.planToAccount.findUnique({where:{id:res.inputsProgress.idPlanToAccount}});
		if (!toPlan){
			return{
				field: 'error',
				message: 'do not have this plan',
			};
		}
		if( toPlan.status == 'COMPLETE'  ){
			return{
				field: 'error',
				message: 'this plan alright complete',
			};
		}
		let resultPlanInvoicesPrisma:any = null;
		try {

			resultPlanInvoicesPrisma =  await prisma.planInvoices.findFirst({where:{id:res.inputsProgress.planInvoicesId}});
			
		} catch (error) {
			console.log('dasdasd => ',error );
			resultPlanInvoicesPrisma =  null;
		}
		console.log('2> ' );

		const accountMTPrisma =  await prisma.accountMetaTrader.findFirst({where:{accountNumber:Number(res.inputsProgress.accountNumber)},include:{user:true}});
		console.log('3> ' );
		console.log(resultPlanInvoicesPrisma != null ? resultPlanInvoicesPrisma!.realDollarQuote : 'asds');
		console.log('5> ' );
		console.log('percentProfit=> ',res.inputsProgress.capital);
		console.log('percentProfit=> ',Math.ceil(( (res.inputsProgress.capital-(res.inputsProgress.capital-res.inputsProgress.profit))/res.inputsProgress.capital)*100*100));
			
		if(accountMTPrisma){	
			const data = {
				valueDollar: (res.inputsProgress.profit ?? 0) * (  Number(process.env.PROFIT_BUSINESS_PERCENTAGE)  /100 )*100,
				valueReal: Math.ceil((res.inputsProgress.profit ?? 0) * (  Number(process.env.PROFIT_BUSINESS_PERCENTAGE)  /100 ) * (resultPlanInvoicesPrisma?.realDollarQuote ? resultPlanInvoicesPrisma.realDollarQuote : 520)),
				dollarQuote: (resultPlanInvoicesPrisma?.realDollarQuote ? resultPlanInvoicesPrisma.realDollarQuote : 520),
				percentProfit:Math.ceil(( (res.inputsProgress.capital-(res.inputsProgress.capital-res.inputsProgress.profit))/res.inputsProgress.capital)*100*100),
				percentFess:Number(process.env.PROFIT_BUSINESS_PERCENTAGE),
				status:InvoicesEnum.WAIT_PAYMENT,
				paymenbeginDate: new Date(),
				accountMetaTraderId: accountMTPrisma.id,
				planInvoicesId: resultPlanInvoicesPrisma?.id,
			}; 
			try {
				
				await prisma.invoices.create({data});
				
				await prisma.planToAccount.update({
					where:{
						id:res.inputsProgress.idPlanToAccount
					},
					data:{
						status:'COMPLETE'
					}
				});
				
				const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
					'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
					
				const d = new Date();
				
				const propEmail ={
					to:accountMTPrisma.user.email,
					from:'spiritgold.forex@gmail.com',
					subject:'Informações sobre o progresso da conta e informações sobre pagamentos',
					text:' '
				};
				console.log(propEmail);
				await emailInvoiceStruct(
					propEmail,
					{
	
						idTransfer:process.env.KEY_PIX!,
						numberContact:process.env.KEY_NUMBER_CONTACT!,
						name:haveEmail.name,
						month: monthNames[d.getMonth()],
						account:
							{
								login:String(accountMTPrisma.accountNumber),
								beginCapital:String((res.inputsProgress.capital-res.inputsProgress.profit)/100),
								finishCapital:String(res.inputsProgress.capital/100),
								percent:String(
									(
										( 
											(res.inputsProgress.capital -
											(res.inputsProgress.capital - res.inputsProgress.profit))
											/res.inputsProgress.capital)*100
									)/100
								),
								
								taxes:String(
									(res.inputsProgress.profit ?? 0) *
									(Number(process.env.PROFIT_BUSINESS_PERCENTAGE) /100 )
									/100),
								
								taxesReal: String(
									Math.ceil((res.inputsProgress.profit ?? 0) * 
									(  Number(process.env.PROFIT_BUSINESS_PERCENTAGE)  /100 ) * 
									(resultPlanInvoicesPrisma?.realDollarQuote ? resultPlanInvoicesPrisma.realDollarQuote : 520) /100 /100)
								),
							},
							
						quotation:(resultPlanInvoicesPrisma?.realDollarQuote ? resultPlanInvoicesPrisma.realDollarQuote : 520)/100,
					
					}
				);


				return{
					field: 'success',
					message: 'account '+ res.inputsProgress.accountNumber,
				};

			} catch (error) {
				console.log('catch => ',error );
				return{
					field: 'error',
					message: 'account '+ res.inputsProgress.accountNumber,
				};
			}

		}else{
			return{
				field: 'not exist',
				message: 'account '+ res.inputsProgress.accountNumber,
			};
		}
		console.log('4> ' );
		
		return null;
	}


	@Mutation(() => GraphState)
	async invoiceEmailCreateStaff(@Arg('res', () => InputInvoicesJustAloneEmail) 
		res: InputInvoicesJustAloneEmail,
		@Ctx() ctx: any	
	) {
		try {
				
			
	
				
			const propEmail ={
				to:res.email,
				from:'spiritgold.forex@gmail.com',
				subject:'Informações sobre o progresso da conta e informações sobre pagamentos',
				text:' '
			};
			console.log(propEmail);
			await emailInvoiceStruct(
				propEmail,
				{
	
					idTransfer:process.env.KEY_PIX!,
					numberContact:process.env.KEY_NUMBER_CONTACT!,
					name:res.name,
					month: res.month,
					account:
							{
								login:String(res.accountForex),
								beginCapital:String((res.capital-res.profit)/100),
								finishCapital:String(res.capital/100),
								percent:String(
									Math.ceil(
										(( 
											(res.capital -
											(res.capital - res.profit))
											/res.capital)*100
										)*100)/100
								),
								
								taxes:String  (
									Math.ceil((res.profit ?? 0) *
									(Number(res.fees)) /100 )
									/100),
								
								taxesReal: String(
									Math.ceil((res.profit ?? 0) * 
									(  Number(res.fees)  /100 ) * 
									res.quoteRealDollar /100) /100
								),
							},
							
					quotation:res.quoteRealDollar/100,
					
				}
			);


			return{
				field: 'success',
				message: 'account '+ res.accountForex,
			};

		} catch (error) {
			console.log('catch => ',error );
			return{
				field: 'error',
				message: 'account '+ res.accountForex,
			};
		}


		console.log('4> ' );
		
		return null;
	}
}