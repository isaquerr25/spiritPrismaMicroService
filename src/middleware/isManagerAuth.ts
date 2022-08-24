import { MiddlewareFn } from 'type-graphql';

import { MyContext } from '../types/MyContext';
import { getTokenId } from '../utils';

export const isManagerAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
	const businessEnum = ['ADMIN','MANAGER','DEVELOPER','TESTER'];

	if (getTokenId(context)?.Enum) {
		if (businessEnum.includes(getTokenId(context).Enum) ) {
			return next();
		}
	}

	throw new Error('not user authenticated');
};
