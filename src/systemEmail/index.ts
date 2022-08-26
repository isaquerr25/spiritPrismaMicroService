import _ from 'lodash';
import nodemailer from 'nodemailer';
import { createAuthToken, createWithdrawToken } from '../utils';
import { UserAll } from '../dto/user';
import sgMail from '@sendgrid/mail';
import invoiceEmailTemplet from './emailStyle/invoiceEmailTemplet';


interface typeEmailRandom{
	
	to:string
	from:string
	subject:string
	text:string
}

export interface infoEmail{
	
	idTransfer:string;
	numberContact:string;
	name:string;
	month:string;
	account:{
		login:string;
		beginCapital:string;
		finishCapital:string;
		percent:string;
		taxes:string;
		taxesReal:string;
	};
	quotation?:number;

}

export const emailInvoiceStruct = async(emailRandom:typeEmailRandom,propsEmail:infoEmail) =>{

	console.log(process.env.SENDGRID_API_KEY!);
	sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

	const msg = {
		to: emailRandom.to, // Change to your recipient
		from: emailRandom.from, // Change to your verified sender
		subject:  emailRandom.subject,
		text:  emailRandom.text,
		html:  invoiceEmailTemplet(propsEmail),
	};
	return await sgMail
		.send(msg)
		.then((result) => {console.log('result ',result);return('success');})
		.catch((error) => {console.log('result ',error);return(error);});
	
};


export const emailRandom = async(emailRandom:typeEmailRandom,propsEmail:infoEmail) =>{

	console.log(process.env.SENDGRID_API_KEY!);
	sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

	const msg = {
		to: emailRandom.to, // Change to your recipient
		from: emailRandom.from, // Change to your verified sender
		subject:  emailRandom.subject,
		text:  emailRandom.text,
		html:  invoiceEmailTemplet(propsEmail),
	};
	return await sgMail
		.send(msg)
		.then((result) => {console.log('result ',result);return('success');})
		.catch((error) => {console.log('result ',error);return(error);});
	
};

