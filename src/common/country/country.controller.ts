import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { PublicRoute } from '../decorators/public-route-decorator';
import { Country } from './country.entity';
import { CountryService } from './country.service';
import { SearchCountryDto } from './dto/search-country.dto';
import { StateService } from '../state/state.service';
import { EntityIdDto } from '../dto/entity.dto';
import { State } from '../state/state.entity';

@ApiTags('Country')
@Controller('countries')
export class CountryController {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectRepository(State)
    private stateRepository: Repository<State>,
    private countryService: CountryService,
    private stateService: StateService,
  ) {}

  @ApiQuery({ name: 'searchText', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get()
  @PublicRoute()
  async getCountries(
    @Query() { limit, page, searchText }: SearchCountryDto,
  ): Promise<Pagination<Country>> {
    return this.countryService.search(
      this.countryRepository,
      ['name', 'code'],
      searchText,
      { limit, page },
    );
  }

  @ApiQuery({ name: 'searchText', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get('/:id/states')
  @PublicRoute()
  async getCountryStates(
    @Query() { limit, page, searchText }: SearchCountryDto,
    @Param() { id }: EntityIdDto,
  ): Promise<Pagination<Country>> {
    return this.stateService.search(
      this.stateRepository,
      ['name', 'code'],
      searchText,
      { limit, page },
      { where: { countryId: id } },
    );
  }
}
