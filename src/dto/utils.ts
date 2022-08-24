import { ObjectType, Field, InputType } from 'type-graphql';
import { Stream } from 'stream';
@ObjectType()
export class GraphState {
	@Field(() => String, { nullable: true })
		field?: string;
	@Field(() => String, { nullable: true })
		message?: string;
}


@ObjectType()
export class DepositState {
	@Field(() => String, { nullable: true })
		field!: string;
	@Field(() => String, { nullable: true })
		message!: string;
}

@InputType()
export class PassToken {
	@Field(() => String)
		token!: string;
}

@ObjectType()
export class SendToken {
	@Field(() => String)
		token!: string;
}
