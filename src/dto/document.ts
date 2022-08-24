import { ObjectType, Field, InputType, Int, registerEnumType} from 'type-graphql';
import { UserAll } from './user';
import { GraphQLUpload, Upload, FileUpload } from 'graphql-upload';
import { Stream } from 'stream';
import { ObjectInvoices } from './invoices';
import { PaymentProofEnum } from '@prisma/client';

@ObjectType()
export class DocumentAll {
	@Field(() => Int)
		id?: number;
	@Field(() => String)
		state?: string;
	@Field(() => String)
		fileName?: string;
	@Field(() => Int)
		userId?: number;
	@Field(() => Date)
		createdAt?: Date;
	@Field(() => Date)
		updatedAt?: Date;
	@Field(() => ObjectInvoices)
		refInvoce?: ObjectInvoices;
	@Field(() => Int)
		invoicesId?: number;
}



@ObjectType()
export class DocumentAllUser {
	@Field(() => Int)
		id?: number;
	@Field(() => String)
		state?: string;
	@Field(() => String)
		fileName?: string;
	@Field(() => Int)
		userId?: number;
	@Field(() => Date)
		createdAt?: Date;
	@Field(() => Date)
		updatedAt?: Date;
	@Field(() => UserAll)
		user?: UserAll;
}



@InputType()
export class InputDocumentAlter {
	@Field(() => Int)
		id!: number;
	@Field(() => PaymentProofEnum)
		state!: PaymentProofEnum;
}

registerEnumType(PaymentProofEnum, {
	name: 'PaymentProofEnum',

});