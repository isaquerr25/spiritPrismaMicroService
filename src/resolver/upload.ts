import { isUserAuth } from '../middleware/isUserAuth';
import { Resolver, Mutation, Arg, Ctx, Query, UseMiddleware } from 'type-graphql';
import { createWriteStream } from 'fs';
import { Stream } from 'stream';
import { PrismaClient } from '@prisma/client';
import { getTokenId } from '../utils';
import { randomBytes }  from 'crypto';
import fs from 'fs';
import { isManagerAuth } from '../middleware/isManagerAuth';
import { DocumentAll, DocumentAllUser, InputDocumentAlter } from '../dto/document';
import { GraphQLUpload } from 'graphql-upload';
import { GraphState, SendToken } from '../dto/utils';


export const prisma = new PrismaClient();


@Resolver()
export class DocumentPictureResolver {

	@UseMiddleware(isUserAuth)
	@Mutation(() => Boolean, { nullable: true })
	async addDocumentPicture( @Ctx() ctx: any, @Arg('picture', () => GraphQLUpload  ) 
		{
			createReadStream,
			filename,
		}: Upload   ): Promise<boolean> {
		
		const { res, req } = ctx;
		
		const referenceInvoice = req.cookies['invoice'].token;
			
		console.log('ent=> ',filename);
		try{
			if(!(filename.includes('.jpg') || filename.includes('.pdf') || filename.includes('.jpeg') || filename.includes('.png')) ){
				console.log('não passou');
				return false;
			}
			console.log('en22222sssstro');
			let idValid =1;
			try{
				console.log('2222');
				idValid = getTokenId(ctx)?.userId;
				if (!await prisma.invoices.findFirst({ where: { 
					id: referenceInvoice ,
					metaTraderRefr:{user:{id:idValid}}
				} }) || idValid == null) {
					console.log('ja existe');
					return false;
				}
			}catch{
				return false;
			}
			console.log('ensssstro');
			const hashName = createHash();
			if(verificationExist(__dirname + `/../../images/${hashName}-${filename}`)){
				return false;
			}
			console.log('entro');
			return new Promise( (resolve, reject) =>
				createReadStream()
					.pipe(createWriteStream(__dirname + `/../../images/${hashName}-${filename}`))
					.on('finish', async () =>{
					
						try{
							console.log('prisma => ','ssssss');
							await prisma.paymentProof.create({data:{
								fileName:`${hashName}-${filename}`,
								invoicesId: referenceInvoice
							}});
							await prisma.invoices.update({where:{id:referenceInvoice},data:{status:'PROCESS'}});
							console.log('prisma => ','ssssdasdasdsccccss');
							resolve(true);
							
						}catch(error){
							console.log('prisma => ',error);
							reject(false);
						}

					})
					.on('error', () => reject(false))
			);
		}catch(error){
			console.log('addDocumentPicture => ',error);
			return false;
		}
		return true;
	}

	@UseMiddleware(isManagerAuth)
	@Query(() => [DocumentAll])
	async allDocuments(){
		return prisma.paymentProof.findMany();
	}

	@UseMiddleware(isManagerAuth)
	@Query(() => [DocumentAll])
	async allDocumentsValidation(){
		return prisma.paymentProof.findMany({where:{state:'PROCESS'},include:{refInvoce:{include:{metaTraderRefr:true}}}});
	}

	@UseMiddleware(isManagerAuth)
	@Mutation(() => GraphState, { nullable: true })
	async alterDocument(@Arg('data',()=>InputDocumentAlter) data:InputDocumentAlter){

		try{

			const pay = await prisma.paymentProof.update({
				where:{id:data.id},
				data:{state:data.state}
			});

			const invoicesAlter = await prisma.invoices.update({
				where:{id:pay.invoicesId},
				data:{status: 
					pay.state == 'INVALID' ? 'DOCUMENT_SEND_INVALID' : (
						pay.state == 'VALID' ? 'PAID_OUT' : 'CANCEL' )
				
				},
				include:{metaTraderRefr:true}
			});

			if(pay.state == 'VALID'){
				const nextDay = new Date();
				nextDay.setMonth(nextDay.getMonth() + 1); 
				const correctDay = new Date(nextDay.getFullYear(),nextDay.getMonth(),10);
				
				nextDay.setMonth((invoicesAlter.metaTraderRefr.finishDate ?? nextDay).getDate() + 35);
	
				await prisma.accountMetaTrader.update({
					where:{id:invoicesAlter.accountMetaTraderId},
					data:{status: invoicesAlter.metaTraderRefr.status == 'STOP' || 
									invoicesAlter.metaTraderRefr.status == 'WORK' ? 
						invoicesAlter.metaTraderRefr.status : 'STOP',
					finishDate: correctDay}
					
				});
			}

			return  {
				field: 'success',
				message: 'success in alter',
			};


		}catch(error){
			console.log('alterDocument  ',error);
			return  {
				field: 'error',
				message: 'success in alter',
			};
			
		}


	}
}


export interface Upload {
	filename: string;
	mimetype: string;
	encoding: string;
	createReadStream: () => Stream;
    invoicesId: number;
}

export const createHash =() =>{
	const hash = randomBytes(32);
	console.log(hash.toString('hex'));
	return hash.toString('hex');
};


const verificationExist =(path:string) =>{
	try {
		if (fs.existsSync(path)) {
			return true;
		}
	} catch(err) {
		return false;
	}
};


