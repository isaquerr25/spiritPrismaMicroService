
import { ObjectType, Field, InputType, Int } from 'type-graphql';
import BigInt from 'graphql-bigint';
import { ObjectAccountMetaTrader } from './accountMetaTrader';

@ObjectType()
export class UserAll {
	@Field(() => Int)
		id!: number;
	@Field(() => String)
		email!: string;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	@Field(() => String, { nullable: true })
		name?: string | null;
	@Field(() => String, { nullable: true })
		hashPayment?: string | null;
	@Field(() => String, { nullable: true })
		numberTelephone?: string | null;
}


@ObjectType()
export class UserHaveComponents {
	@Field(() => String)
		email!: string;
	@Field(() => String, { nullable: true })
		name?: string | null;
	@Field(() => String, { nullable: true })
		hashPayment?: string | null;
	@Field(() => String, { nullable: true })
		document?: string;
	@Field(() => String, { nullable: true })
		numberTelephone?: string | null;
	@Field(() => String, { nullable: true })
		affiliate?: string | null;
}

@ObjectType()
export class UserCash {
	@Field(() => String, { nullable: true })
		balance?: string| null;
	@Field(() => String, { nullable: true })
		profitCycle?: string| null;
	@Field(() => String, { nullable: true })
		profitFuture?: string| null;
}


@InputType()
export class CreateUser {
	@Field(() => String)
		email!: string;

	@Field(() => String)
		name!: string;
	
	@Field(() => String)
		password!: string;
	
	@Field(() => String, { nullable: true })
		affiliate?: string | null;

}


@InputType()
export class LoginUser {
	@Field(() => String)
		email!: string;
	@Field(() => String)
		password!: string;
}

@InputType()
export class PasswordAlter {
	@Field(() => String)
		oldPassword!: string;
	@Field(() => String)
		password!: string;
}
@InputType()
export class WalletAlter {
	@Field(() => String)
		wallet!: string;
}

@InputType()
export class NumberTelephoneAlter {
	@Field(() => String)
		numberTelephone!: string;
}


@InputType()
export class ForgetPasswordAlter {
	@Field(() => String)
		email!: string;
}

@InputType()
export class ForgetPasswordNewAlter {
	@Field(() => String)
		token!: string;
	@Field(() => String)
		password!: string;
}

@InputType()
export class InputUserBaseInfo {
	
	@Field(() => String)
		name!: string;
	@Field(() => String)
		numberTelephone!: string;
		
}


@ObjectType()
export class UserAccountStaff {
	@Field(() => Int)
		id!: number;
	@Field(() => String)
		email!: string;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	@Field(() => String, { nullable: true })
		name?: string | null;
	@Field(() => String, { nullable: true })
		hashPayment?: string | null;
	@Field(() => String, { nullable: true })
		numberTelephone?: string | null;
	@Field(() => [ObjectAccountMetaTrader], { nullable: true })
		AccountMetaTrader?: ObjectAccountMetaTrader[] | null;
}