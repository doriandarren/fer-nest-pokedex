import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from 'src/common/base/base.service';
import { PaginatioDto } from '../common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService extends BaseService {

  private defaultLimit : number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService,
  ){ 
    super();
    this.defaultLimit = configService.get<number>('defaultLimit') || 0;
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }

  }

  findAll(paginationDto: PaginatioDto) {

    const {
      limit = this.defaultLimit, 
      offset = 0
    } = paginationDto;

    return this.pokemonModel.find()
    .limit(limit)
    .skip(offset)
    .sort({
      no: 1
    })
    .select('-__v'); // Quita el campo

  }

  async findOne(id: string) {

    let pokemon: Pokemon | null = null;

    if(!isNaN(+id)){
      pokemon = await this.pokemonModel.findOne({no: id});
    }

    if(!pokemon && isValidObjectId(id)){
      pokemon = await this.pokemonModel.findById(id);
    }

    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({ name: id.toLowerCase().trim() })
    }

    if(!pokemon)
      throw new NotFoundException(`Pokemon "${id}" not found`);
      
    return pokemon;
  }


  async update(id: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(id);

    if(updatePokemonDto?.name){
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try {
      await pokemon.updateOne(updatePokemonDto, {new: true});
      return { ...pokemon.toJSON(), ...updatePokemonDto};
      
    } catch (error) {
      this.handleExceptions(error);
    }
    
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // try {
    //   await pokemon.deleteOne();
    //   return true;
    // } catch (error) {
    //   this.handleExceptions(error);
    // }

    //const result = await this.pokemonModel.findByIdAndDelete(id);

    
    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});
    if(deletedCount === 0)
      throw new BadRequestException(`Pokemon with id "${id}" not found`);
      

    return true;

  }

}
