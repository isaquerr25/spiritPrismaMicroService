import { start } from 'repl';
import { MiddlewareFn } from 'type-graphql';

import { MyContext, MyContextAdvance } from '../types/MyContext';
import { getTokenId } from '../utils';
import fs from 'fs';

const getActualRequestDurationInMilliseconds = (start:any) => {
	const NS_PER_SEC = 1e9; // convert to nanoseconds
	const NS_TO_MS = 1e6; // convert to milliseconds
	const diff = process.hrtime(start);
	return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};


export const isLogs: MiddlewareFn<MyContextAdvance> = async ({ context }, next) => {

	const current_datetime = new Date();
	const formatted_date =
	current_datetime.getFullYear() +
	'-' +
	(current_datetime.getMonth() + 1) +
	'-' +
	current_datetime.getDate() +
	' ' +
	current_datetime.getHours() +
	':' +
	current_datetime.getMinutes() +
	':' +
	current_datetime.getSeconds();
	const method = context.req.method;
	const url = context.req.url;
	const status = context.res.statusCode;

	const log = `[${formatted_date}] ${method}:${url} ${status} ${JSON.stringify(context.req)} ms`;

	console.log(url);

	fs.appendFile('request_logs.txt', log + '\n', err => {
		if (err) {
			console.log(err);
		}
	});

	return next();
};
