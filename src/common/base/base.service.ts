import { BadRequestException, InternalServerErrorException } from "@nestjs/common";


export abstract class BaseService {
    protected handleExceptions(error: any){
        if(error.code === 11000){
        throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`);
        }
        console.log(error.code);
        throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`); 
    }
}