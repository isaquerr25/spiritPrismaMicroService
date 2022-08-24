import { AccountMetaTraderEnum, LoteAutoCalculateDangerEnum, styleEnum } from '@prisma/client';
import { ObjectType, Field, InputType, Int, registerEnumType} from 'type-graphql';

@ObjectType()
export class ObjectLoteAutoCalculate  {
	@Field(() => Int, { nullable: true })id?: number;
	@Field(() => Int, { nullable: true })minCapital?: number;
	@Field(() => Int, { nullable: true })maxCapital?: number;
	@Field(() => Int, { nullable: true })maxLot?: number;
	@Field(() => Int, { nullable: true })minLot?: number;
	@Field(() => String, { nullable: true })local?: string;
	@Field(() => Int, { nullable: true })valueBase?: number;
	@Field(() => LoteAutoCalculateDangerEnum, { nullable: true })type?: LoteAutoCalculateDangerEnum;
	@Field(() => styleEnum, { nullable: true })styleMath?: styleEnum;
	@Field(() => Date, { nullable: true })createdAt?: Date;
	@Field(() => Date, { nullable: true })updatedAt?: Date;
}

registerEnumType(LoteAutoCalculateDangerEnum, {
	name: 'LoteAutoCalculateDangerEnum',
});

registerEnumType(styleEnum, {
	name: 'styleEnum',
});


@InputType()
export class InputNewLoteAutoCalculate {

	@Field(() => Int)minCapital!: number;
	@Field(() => Int)maxCapital!: number;
	@Field(() => Int, { nullable: true })maxLot?: number;
	@Field(() => Int, { nullable: true })minLot?: number;
	@Field(() => String)local!: string;
	@Field(() => Int)valueBase!: number;
	@Field(() => LoteAutoCalculateDangerEnum)type!: LoteAutoCalculateDangerEnum;
	@Field(() => styleEnum)styleMath!: styleEnum;
}


@InputType()
export class InputUpdateLoteAutoCalculate {
    @Field(() => Int)id!: number;
	@Field(() => Int, { nullable: true })minCapital?: number;
	@Field(() => Int, { nullable: true })maxCapital?: number;
	@Field(() => Int, { nullable: true })maxLot?: number;
	@Field(() => Int, { nullable: true })minLot?: number;
	@Field(() => String, { nullable: true })local?: string;
	@Field(() => Int, { nullable: true })valueBase?: number;
	@Field(() => LoteAutoCalculateDangerEnum, { nullable: true })type?: LoteAutoCalculateDangerEnum;
	@Field(() => styleEnum, { nullable: true })styleMath?: styleEnum;
}

@InputType()
export class InputDeleteLoteAutoCalculate {
    @Field(() => Int)id!: number;
}


@InputType()
export class SendId {
	@Field(() => Int)id!: number;
}
