import fs from 'fs';
import stream from 'stream';
import express from 'express';
import path, { dirname } from 'path';
import {  decodeTokenType } from '../utils';
const routes = express.Router();
import cors from 'cors';
import { MyContext } from '../types/MyContext';
import { prisma } from '../resolver/user';
import axios from 'axios';
import { emailRandom } from '../systemEmail';
import bodyParser from 'body-parser';
import { isArray, isBoolean, isNumber, isObject, isString } from 'class-validator';
import { OrdersResolver } from '../resolver/orders';
const v1 = express.Router();


const jsonParser = bodyParser.json();

const urlencodedParser = bodyParser.urlencoded({ extended: false });

routes.use('/static', function(req,res, next) {
	res.header('Access-Control-Allow-Origin','*');
	// const context = {
	// 	req,
	// 	res
	// };
	// const businessEnum = ['ADMIN','MANAGER','DEVELOPER','TESTER'];

	// if (getTokenId(context)?.Enum) {
	// 	if (businessEnum.includes(getTokenId(context).Enum) ) {
	// 		next();
	// 	}else{
	// 		throw new Error('not user authenticated');
	// 	}
	// }else{
	// 	throw new Error('not user authenticated');
	// }
	next();

});

routes.use('/static', express.static(path.join(__dirname,'../../images/')));

routes.get('/confirmation_emial/:tokenID', async function(req, res) {
	res.header('Access-Control-Allow-Origin','*');
	

	const idPrimary = decodeTokenType(req.params.tokenID).userId;
	console.log(process.env.FRONT_IP!);
	console.log(idPrimary);
	if(idPrimary){
		try{
			await prisma.user.update({
				where: { id: idPrimary },
				data: { confirm: 'valid' },
			});
			
			return res.send('valid');
		}catch(error){
			console.log(error);
			res.status(404);
		}
	}
	res.status(404);
});


routes.get('/exchange', async function(req, res) {
	res.header('Access-Control-Allow-Origin','*');
	let result:any;
	try{

		await axios.get('https://api.bitapi.pro/v1/market/overview').then((res) => {
			console.log(res.data);
			result = res.data;
		});
		res.send(result);

	}catch(error){
		console.log(error);
		res.status(404);
	}
	
});

routes.use('/post_email', function(req,res, next) {
	res.set('Access-Control-Allow-Origin', '*');
	next();

});
routes.post('/post_email',jsonParser, async function (req, res) {

	res.set('Access-Control-Allow-Origin', '*');
	console.log(req.body);
	console.log(await req.body);
	console.log(await req.body);
	const emailRandomD = await req.body;
	const resume = await emailRandom(emailRandomD);
	console.log(resume); 
	res.send(resume);
	

});

routes.use('/api/set_sinal', async function (req, res, next) {
	
	res.set('Access-Control-Allow-Origin', '*');
	next();
});

routes.post('/api/set_sinal', async function (req, res) {
	res.set('Access-Control-Allow-Origin', '*');
	console.log('set_sinal');

	// capture the encoded form data
	req.on('data', async (data) => {

		//este funciona		
		let adccc = ( await data.toString()).replace('{','').replace('}','').replace('"','').replace('\\x00','');
		adccc = adccc.replace('{','');
		adccc = adccc.replace('}','');
		adccc = adccc.replace('"','');
		adccc = adccc.replace('\'','');
		adccc = adccc.replace(/"/g,'');
		adccc = adccc.replace(/x00/,'');
		adccc = adccc.replace('x00','');
		console.log('origin ',adccc);

		const foo = adccc.split(',').reduce(function(obj:any, str:string, index:number) {
			const strParts = str.split(':');
			if (strParts[0] && strParts[1]) { //<-- Make sure the key & value are not undefined
				obj[strParts[0].replace(/\s+/g, '')] = strParts[1].trim(); //<-- Get rid of extra spaces at beginning of value strings
			}
			return obj;
		}, {});

		console.log(foo);
		console.log(foo.ticket);
		if(foo.status === 1){
			console.log(foo.status);
			console.log('error');
			res.send({'status':'erro'});
		}
		else{
			console.log(await prisma.orders.findFirst(
				{where:
					{
						
						ticket: Number(foo.ticket)
						,local:foo.abertura
						,par:((foo.par).replace('micro','')).replace('m','')
						,lote:Math.trunc(Number(foo.lots)*100)
						
					}
				}
			));
			try {
				if(await prisma.orders.findFirst(
					{where:
						{
							local:(foo.abertura),
							par:((foo.par).replace('micro','')).replace('m',''),
							status:'OPEN',
							ticket: Number(foo.ticket),
							lote:Math.trunc(Number(foo.lots)*100),	
							type:foo.type === 'normal' ? 'NORMAL' : ( foo.type === 'auto' ? 'CORRECTION' : 'SPECIAL' )
						}
					}
				)){
					console.log('jaTem');
					res.send({'status':'jaTem'});
					return;
				}
				await prisma.orders.create({ data:{
					local:(foo.abertura),
					par:((foo.par).replace('micro','')).replace('m',''),
					status:'OPEN',
					ticket: Number(foo.ticket),
					lote:Math.trunc(Number(foo.lots)*100),
					direction: foo.direcao === 'buy' ?'BUY' : 'SELL',
					type:foo.type === 'normal' ? 'NORMAL' : ( foo.type === 'auto' ? 'CORRECTION' : 'SPECIAL' ) ,
				} });
	
				console.log('success ');
				res.send({'status':'gravado'});
	
			} catch(error) {
				console.log('bad :',error);
				res.send({'status':'erro'});
			}
		}
	});
});

routes.use('/api/auter_sinal', async function (req, res, next) {
	res.set('Access-Control-Allow-Origin', '*');
	next();
});

routes.post('/api/auter_sinal', async function (req, res) {
	res.set('Access-Control-Allow-Origin', '*');
	console.log('auter_sinal');

	// capture the encoded form data
	req.on('data', async (data) => {
		
		//este funciona		
		let adccc = ( await data.toString()).replace('{','').replace('}','').replace('"','').replace('\\x00','');
		adccc = adccc.replace('{','');
		adccc = adccc.replace('}','');
		adccc = adccc.replace('"','');
		adccc = adccc.replace('\'','');
		adccc = adccc.replace(/"/g,'');
		adccc = adccc.replace(/x00/,'');
		adccc = adccc.replace('x00','');
		console.log('origin ',adccc);
		
		const foo = adccc.split(',').reduce(function(obj:any, str:string, index:number) {
			const strParts = str.split(':');
			if (strParts[0] && strParts[1]) { //<-- Make sure the key & value are not undefined
				obj[strParts[0].replace(/\s+/g, '')] = strParts[1].trim(); //<-- Get rid of extra spaces at beginning of value strings
			}
			return obj;
		}, {});

		console.log(foo);
		console.log(foo.ticket);
		if(foo.status !== 'fechamento\x00'){
			console.log(foo.status);
			console.log('error');
			res.send({'status':'error'});
		}
		try {
			const ord = await prisma.orders.findFirst({where:{ticket:Number(foo.ticket)}});
			await prisma.orders.update({ where:{id: ord!.id ?? 0}, data:{status:'CLOSE'} });

			console.log('success ');
			res.send({'status':'fechamento'});

		} catch(error) {
			console.log('bad :',error);
			res.send({'status':'error'});
		}
	});
});



export default routes;
