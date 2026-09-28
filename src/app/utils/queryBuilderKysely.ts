import { SelectQueryBuilder, sql } from 'kysely';
import { IKyselyQueryParams, IKyselyQueryConfig, IKyselyQueryResult } from '../interface/kyselyQuery.interface';

// T = Model Type
// TWhereInput = where input type object for filtering the data
// TInclude = include type object for including related data

export class QueryBuilderKysely<
    T,
    TWhereInput = Record<string, unknown>,
    TInclude = Record<string, unknown>
> {
    private queryBuilder: SelectQueryBuilder<any, any, any>;
    private countQueryBuilder: SelectQueryBuilder<any, any, any>;
    private page: number = 1;
    private limit: number = 10;
    private skip: number = 0;
    private sortBy: string = 'createdAt';
    private sortOrder: 'asc' | 'desc' = 'desc';
    private selectFields: string[] | undefined;
    private tableName: string;

    constructor(
        private db: any, // Kysely database instance
        private queryParams: IKyselyQueryParams,
        private config: IKyselyQueryConfig = {},
        tableName: string
    ) {
        this.tableName = tableName;
        this.queryBuilder = db.selectFrom(tableName);
        this.countQueryBuilder = db.selectFrom(tableName);
    }

    search(): this {
        const { searchTerm } = this.queryParams;
        const { searchableFields } = this.config;

        if (searchTerm && searchableFields && searchableFields.length > 0) {
            const searchConditions = searchableFields.map((field) => {
                if (field.includes('.')) {
                    const parts = field.split('.');

                    if (parts.length === 2) {
                        const [relation, nestedField] = parts as [string, string];
                        return sql`${sql.raw(relation)}.${sql.raw(nestedField)} ILIKE ${`%${searchTerm}%`}`;
                    } else if (parts.length === 3) {
                        const [relation, nestedRelation, nestedField] = parts as [string, string, string];
                        return sql`${sql.raw(relation)}.${sql.raw(nestedRelation)}.${sql.raw(nestedField)} ILIKE ${`%${searchTerm}%`}`;
                    }
                }

                // direct field
                return sql`${sql.raw(field)} ILIKE ${`%${searchTerm}%`}`;
            });

            const orCondition = searchConditions.join(' OR ');
            this.queryBuilder = this.queryBuilder.where(sql`${sql.raw(`(${orCondition})`)}` as any);
            this.countQueryBuilder = this.countQueryBuilder.where(sql`${sql.raw(`(${orCondition})`)}` as any);
        }

        return this;
    }

    filter(): this {
        const { filterableFields } = this.config;
        const excludedField = ['searchTerm', 'page', 'limit', 'sortBy', 'sortOrder', 'fields', 'include'];

        const filterParams: Record<string, unknown> = {};

        Object.keys(this.queryParams).forEach((key) => {
            if (!excludedField.includes(key)) {
                filterParams[key] = this.queryParams[key];
            }
        });

        Object.keys(filterParams).forEach((key) => {
            const value = filterParams[key];

            if (value === undefined || value === '') {
                return;
            }

            const isAllowedField = !filterableFields || filterableFields.length === 0 || filterableFields.includes(key);

            if (key.includes('.')) {
                const parts = key.split('.');

                if (filterableFields && !filterableFields.includes(key)) {
                    return;
                }

                if (parts.length === 2) {
                    const [relation, nestedField] = parts as [string, string];
                    const parsedValue = this.parseFilterValue(value);
                    this.queryBuilder = this.queryBuilder.where(
                        sql`${sql.raw(relation)}.${sql.raw(nestedField)} = ${parsedValue}` as any
                    );
                    this.countQueryBuilder = this.countQueryBuilder.where(
                        sql`${sql.raw(relation)}.${sql.raw(nestedField)} = ${parsedValue}` as any
                    );
                    return;
                } else if (parts.length === 3) {
                    const [relation, nestedRelation, nestedField] = parts as [string, string, string];
                    const parsedValue = this.parseFilterValue(value);
                    this.queryBuilder = this.queryBuilder.where(
                        sql`${sql.raw(relation)}.${sql.raw(nestedRelation)}.${sql.raw(nestedField)} = ${parsedValue}` as any
                    );
                    this.countQueryBuilder = this.countQueryBuilder.where(
                        sql`${sql.raw(relation)}.${sql.raw(nestedRelation)}.${sql.raw(nestedField)} = ${parsedValue}` as any
                    );
                    return;
                }
            }

            if (!isAllowedField) {
                return;
            }

            // Range filter parsing
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                const rangeConditions = this.parseRangeFilter(value as Record<string, string | number>);
                Object.keys(rangeConditions).forEach((operator) => {
                    const operatorValue = rangeConditions[operator];
                    this.queryBuilder = this.queryBuilder.where(
                        sql`${sql.raw(key)} ${sql.raw(this.getSqlOperator(operator as string))} ${operatorValue}` as any
                    );
                    this.countQueryBuilder = this.countQueryBuilder.where(
                        sql`${sql.raw(key)} ${sql.raw(this.getSqlOperator(operator as string))} ${operatorValue}` as any
                    );
                });
                return;
            }

            // direct value parsing
            const parsedValue = this.parseFilterValue(value);
            this.queryBuilder = this.queryBuilder.where(sql`${sql.raw(key)} = ${parsedValue}` as any);
            this.countQueryBuilder = this.countQueryBuilder.where(sql`${sql.raw(key)} = ${parsedValue}` as any);
        });

        return this;
    }

    paginate(): this {
        const page = Number(this.queryParams.page) || 1;
        const limit = Number(this.queryParams.limit) || 10;

        this.page = page;
        this.limit = limit;
        this.skip = (page - 1) * limit;

        this.queryBuilder = this.queryBuilder.limit(limit).offset(this.skip);

        return this;
    }

    sort(): this {
        const sortBy = this.queryParams.sortBy || 'createdAt';
        const sortOrder = this.queryParams.sortOrder === 'asc' ? 'asc' : 'desc';

        this.sortBy = sortBy;
        this.sortOrder = sortOrder;

        if (sortBy.includes('.')) {
            const parts = sortBy.split('.');

            if (parts.length === 2) {
                const [relation, nestedField] = parts as [string, string];
                this.queryBuilder = this.queryBuilder.orderBy(
                    sql`${sql.raw(relation)}.${sql.raw(nestedField)}`,
                    sortOrder
                );
            } else if (parts.length === 3) {
                const [relation, nestedRelation, nestedField] = parts as [string, string, string];
                this.queryBuilder = this.queryBuilder.orderBy(
                    sql`${sql.raw(relation)}.${sql.raw(nestedRelation)}.${sql.raw(nestedField)}`,
                    sortOrder
                );
            } else {
                this.queryBuilder = this.queryBuilder.orderBy(sql.raw(sortBy), sortOrder);
            }
        } else {
            this.queryBuilder = this.queryBuilder.orderBy(sql.raw(sortBy), sortOrder);
        }

        return this;
    }

    fields(): this {
        const fieldsParam = this.queryParams.fields;

        if (fieldsParam && typeof fieldsParam === 'string') {
            const fieldsArray = fieldsParam.split(',').map(field => field.trim());
            this.selectFields = fieldsArray;

            // Use callback form for dynamic field selection
            this.queryBuilder = this.queryBuilder.select((eb) => {
                return fieldsArray.map(field => sql.raw(field) as any);
            });
        }

        return this;
    }

    include(relation: TInclude): this {
        if (this.selectFields) {
            return this;
        }

        // For Kysely, we would need to use with() for relationships
        // This is a simplified version - actual implementation depends on your schema
        return this;
    }

    dynamicInclude(
        includeConfig: Record<string, unknown>,
        defaultInclude?: string[]
    ): this {
        if (this.selectFields) {
            return this;
        }

        const requestedRelations: string[] = [];

        defaultInclude?.forEach((field) => {
            if (includeConfig[field as string]) {
                requestedRelations.push(field);
            }
        });

        const includeParam = this.queryParams.include as string | undefined;

        if (includeParam && typeof includeParam === 'string') {
            const requested = includeParam.split(',').map(relation => relation.trim());
            requested.forEach((relation) => {
                if (includeConfig[relation as string]) {
                    requestedRelations.push(relation);
                }
            });
        }

        // Apply relationships using Kysely's with() method
        // This is a simplified implementation
        requestedRelations.forEach((relation) => {
            if (includeConfig[relation as string]) {
                // this.queryBuilder = this.queryBuilder.with(relation, includeConfig[relation as string]);
            }
        });

        return this;
    }

    where(condition: TWhereInput): this {
        // Simplified where clause implementation
        Object.keys(condition as Record<string, unknown>).forEach((key) => {
            const value = (condition as Record<string, unknown>)[key];
            this.queryBuilder = this.queryBuilder.where(sql`${sql.raw(key)} = ${value}` as any);
            this.countQueryBuilder = this.countQueryBuilder.where(sql`${sql.raw(key)} = ${value}` as any);
        });

        return this;
    }

    async execute(): Promise<IKyselyQueryResult<T>> {
        const [total, data] = await Promise.all([
            this.countQueryBuilder.executeTakeFirst(),
            this.queryBuilder.execute()
        ]);

        const totalCount = total ? Number(Object.values(total)[0]) : 0;
        const totalPages = Math.ceil(totalCount / this.limit);

        return {
            data: data as T[],
            meta: {
                page: this.page,
                limit: this.limit,
                total: totalCount,
                totalPages,
            }
        };
    }

    async count(): Promise<number> {
        const result = await this.countQueryBuilder.executeTakeFirst();
        return result ? Number(Object.values(result)[0]) : 0;
    }

    getQuery(): SelectQueryBuilder<any, any, any> {
        return this.queryBuilder;
    }

    private parseFilterValue(value: unknown): unknown {
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
            return false;
        }

        if (typeof value === 'string' && !isNaN(Number(value)) && value !== '') {
            return Number(value);
        }

        if (Array.isArray(value)) {
            return value.map((item) => this.parseFilterValue(item));
        }

        return value;
    }

    private parseRangeFilter(value: Record<string, string | number>): Record<string, string | number | (string | number)[]> {
        const rangeQuery: Record<string, string | number | (string | number)[]> = {};

        Object.keys(value).forEach((operator) => {
            const operatorValue = value[operator];

            if (operatorValue === undefined) {
                return;
            }

            const parsedValue: string | number = typeof operatorValue === 'string' && !isNaN(Number(operatorValue)) ? Number(operatorValue) : operatorValue;

            switch (operator) {
                case 'lt':
                case 'lte':
                case 'gt':
                case 'gte':
                case 'equals':
                case 'not':
                case 'contains':
                case 'startsWith':
                case 'endsWith':
                case 'in':
                case 'notIn':
                    rangeQuery[operator] = parsedValue;
                    break;
                default:
                    break;
            }
        });

        return rangeQuery;
    }

    private getSqlOperator(operator: string): string {
        const operatorMap: Record<string, string> = {
            'lt': '<',
            'lte': '<=',
            'gt': '>',
            'gte': '>=',
            'equals': '=',
            'not': '!=',
            'contains': 'LIKE',
            'startsWith': 'LIKE',
            'endsWith': 'LIKE',
            'in': 'IN',
            'notIn': 'NOT IN'
        };

        return operatorMap[operator] || '=';
    }
}