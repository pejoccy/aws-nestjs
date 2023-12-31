import _ from 'lodash';
import moment from 'moment';
import {
  Between,
  FindManyOptions,
  getConnection,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import {
  IPaginationMeta,
  IPaginationOptions,
  paginate,
  paginateRaw,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Account } from '../../account/account.entity';
import { Session } from '../../pacs/session/session.entity';
import { PaginationOptionsDto } from '../dto/pagination-options.dto';

export enum OrderType {
  asc = 'ASC',
  desc = 'DESC',
}

export interface FilterOptions {
  sortType: string;
  orderType?: string;
  limit?: number;
}

export interface ReportOptions {
  date?: [string, string];
  dateColumn: string;
  interval?: any /*ReportInterval*/;
  groupByCols?: string[];
  orderByCols?: string[];
  valueColumns: (
    | [string, 'COUNT' | 'SUM']
    | [string, 'COUNT' | 'SUM', string]
  )[];
}

export interface TransformTemplate {
  selections: (string | [string, string])[];
  groupBy: string[];
  orderBy?: string[];
}

export class BaseService {
  protected isCollaborator(
    session: Session,
    collaborators: Account[],
    account: Account,
  ): boolean {
    return (
      (collaborators || []).some(
        (collaborator) => account.id === collaborator.id,
      ) ||
      session.creatorId === account.id ||
      session.patient?.accountId !== account.id
    );
  }

  protected isSessionOwner(session: Session, account: Account): boolean {
    return (
      session.creatorId === account.id ||
      session.patient?.accountId !== account.id
    );
  }

  public async startTransaction(): Promise<QueryRunner> {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    return queryRunner;
  }

  public excludeExtraneousKeys<T extends Record<string, any>>(
    dto: any = {},
  ): T {
    return (
      Object.entries(dto).reduce((acc, [key, val]) => {
        if (typeof val === 'object' && !Array.isArray(val)) {
          acc[key] = this.excludeExtraneousKeys(val);
        } else if (typeof val !== 'undefined') {
          acc[key] = val;
        }
        return acc;
      }, {} as any) || {}
    );
  }

  public async paginate<T, CustomMetaType = IPaginationMeta>(
    queryBuilder: SelectQueryBuilder<T>,
    options: IPaginationOptions<CustomMetaType> & { isRaw?: boolean },
  ): Promise<Pagination<T, CustomMetaType>>;
  public async paginate<T, CustomMetaType = IPaginationMeta>(
    repository: Repository<T>,
    options: IPaginationOptions<CustomMetaType> & { isRaw?: boolean },
    searchOptions?: FindManyOptions<T>,
  ): Promise<Pagination<T, CustomMetaType>>;
  public async paginate<T, CustomMetaType = IPaginationMeta>(
    queryBuilderOrRepository: Repository<T> | SelectQueryBuilder<T>,
    options: IPaginationOptions<CustomMetaType> & { isRaw?: boolean },
    searchOptions?: FindManyOptions<T>,
  ): Promise<Pagination<T, CustomMetaType>> {
    options.limit =
      (typeof options.limit === 'number' &&
        (options.limit > 100 ? 100 : options.limit)) ||
      10;
    options.page = options.page ?? 1;

    const query: FindManyOptions = {};
    searchOptions = this.excludeExtraneousKeys(searchOptions);
    if (queryBuilderOrRepository instanceof Repository && !!searchOptions) {
      let columnsData = queryBuilderOrRepository.metadata.columns.reduce(
        (acc, column) => {
          acc[column.propertyName] = {
            type: column.type,
            enum: column.enum,
          };

          return acc;
        },
        {},
      );

      columnsData = queryBuilderOrRepository.metadata.relations.reduce(
        (acc, column) => {
          acc[column.propertyName] = { type: 'string' };

          return acc;
        },
        columnsData,
      );

      const composeWhereOptions = (options = {}) => {
        return Object.entries(options).reduce((acc, [key, value]) => {
          const [relation] = key.split('.');
          if (
            typeof columnsData[key] !== 'undefined' ||
            (typeof columnsData[relation] !== 'undefined' &&
              (searchOptions?.relations || []).includes(relation))
          ) {
            if (
              (!columnsData[key]?.enum &&
                typeof columnsData[key]?.type === 'function' &&
                columnsData[key]?.type?.prototype === String.prototype) ||
              columnsData[key]?.type === 'string' ||
              columnsData[relation]?.type === 'string'
            ) {
              if (key.includes('.')) {
                _.set(acc, key, ILike(`%${value}%`));
              } else {
                acc[key] = ILike(`%${value}%`);
              }
            } else if (
              columnsData[key]?.type === 'timestamp' &&
              Array.isArray(value)
            ) {
              const [from, to] = value;
              if (from && to) {
                acc[key] = Between(
                  moment(from).format('YYYY-MM-DD HH:MM:SS'),
                  moment(to).format('YYYY-MM-DD HH:MM:SS'),
                );
              } else if (from) {
                acc[key] = MoreThanOrEqual(from);
              } else if (to) {
                acc[key] = LessThanOrEqual(to);
              }
            } else if (typeof value !== 'undefined') {
              acc[key] = value;
            }
          }

          return acc;
        }, {});
      };

      query.where = Array.isArray(searchOptions.where)
        ? [...searchOptions.where].map(composeWhereOptions)
        : composeWhereOptions(searchOptions.where || {});
    }

    return queryBuilderOrRepository instanceof SelectQueryBuilder
      ? options.isRaw
        ? paginateRaw<T, CustomMetaType>(queryBuilderOrRepository, options)
        : paginate<T, CustomMetaType>(queryBuilderOrRepository, options)
      : paginate<T, CustomMetaType>(queryBuilderOrRepository, options, {
          ...searchOptions,
          ...query,
        });
  }

  public async search<T>(
    repository: Repository<T>,
    fields: string[],
    term: string,
    pagination: PaginationOptionsDto,
    options: any = {},
  ) {
    const { where: whereElse, ...findOptions } = options;
    let where = {};
    if (term) {
      term = String(term).replace(/\s/g, '%');
      where = fields.map((field) => ({ [field]: term, ...whereElse }));
    } else if (whereElse) {
      where = whereElse;
    }

    return this.paginate(repository, pagination, { where, ...findOptions });
  }
}
