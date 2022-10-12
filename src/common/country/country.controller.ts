import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { PublicRoute } from '../decorators/public-route-decorator';
import { Country } from './country.entity';
import { CountryService } from './country.service';
import { SearchCountryDto } from './dto/search-country.dto';

@ApiBearerAuth()
@ApiTags('Country')
@Controller('countries')
export class CountryController {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    private countryService: CountryService,
  ) {}

  @ApiQuery({ name: 'searchText', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get()
  @PublicRoute()
  async getPlans(
    @Query() { limit, page, searchText }: SearchCountryDto,
  ): Promise<Pagination<Country>> {
    return this.countryService.search(
      this.countryRepository,
      ['name', 'code'],
      searchText,
      { limit, page },
    );
  }
}
