import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();


export default ()=>{

	(async function routines (){
	//logic here
		setTimeout(routines, 1000*60*10);
	})();

};

// consult if cycle invest finish