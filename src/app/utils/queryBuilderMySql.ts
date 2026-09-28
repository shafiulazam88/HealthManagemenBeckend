import { IMySqlQueryParams, IMySqlQueryConfig, IMySqlQueryResult, IMySqlPool } from '../interface/mysqlQuery.interface';

// T = Model Type
// TWhereInput = where input type object for filtering the data
// TInclude = include type object for including related data

export class QueryBuilderMySql<
    T,
    TWhereInput = Record<string, unknown>,
    TInclude = Record<string, unknown>
> {
    private selectClause: string = '*';
    private whereClause: string = '';
    private orderByClause: string = '';
    private limitClause: string = '';
    private params: any[] = [];
    private countParams: any[] = [];
    private page: number = 1;
    private limit: number = 10;
    private skip: number = 0;
    private sortBy: string = 'createdAt';
    private sortOrder: 'asc' | 'desc' = 'desc';
    private selectFields: string[] | undefined;
    private tableName: string;

    constructor(
        private db: IMySqlPool,
        private queryParams: IMySqlQueryParams,
        private config: IMySqlQueryConfig = {},
        tableName: string
    ) {
        this.tableName = tableName;
    }

    search(): this {
        const { searchTerm } = this.queryParams;
        const { searchableFields } = this.config;

        if (searchTerm && searchableFields && searchableFields.length > 0) {
            const searchConditions: string[] = searchableFields.map((field) => {
                if (field.includes('.')) {
                    const parts = field.split('.');

                    if (parts.length === 2) {
                        const [relation, nestedField] = parts as [string, string];
                        this.params.push(`%${searchTerm}%`);
                        return `${relation}.${nestedField} LIKE ?`;
                    } else if (parts.length === 3) {
                        const [relation, nestedRelation, nestedField] = parts as [string, string, string];
                        this.params.push(`%${searchTerm}%`);
                        return `${relation}.${nestedRelation}.${nestedField} LIKE ?`;
                    }
                }

                // direct field
                this.params.push(`%${searchTerm}%`);
                return `${field} LIKE ?`;
            });

            const orCondition = searchConditions.join(' OR ');
            this.whereClause = this.whereClause
                ? `${this.whereClause} AND (${orCondition})`
                : `(${orCondition})`;

            // Copy params for count query
            this.countParams = [...this.params];
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
                    this.params.push(parsedValue);
                    const condition = `${relation}.${nestedField} = ?`;
                    this.whereClause = this.whereClause
                        ? `${this.whereClause} AND ${condition}`
                        : condition;
                    this.countParams.push(parsedValue);
                    return;
                } else if (parts.length === 3) {
                    const [relation, nestedRelation, nestedField] = parts as [string, string, string];
                    const parsedValue = this.parseFilterValue(value);
                    this.params.push(parsedValue);
                    const condition = `${relation}.${nestedRelation}.${nestedField} = ?`;
                    this.whereClause = this.whereClause
                        ? `${this.whereClause} AND ${condition}`
                        : condition;
                    this.countParams.push(parsedValue);
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
                    this.params.push(operatorValue);
                    const sqlOperator = this.getSqlOperator(operator);
                    const condition = `${key} ${sqlOperator} ?`;
                    this.whereClause = this.whereClause
                        ? `${this.whereClause} AND ${condition}`
                        : condition;
                    this.countParams.push(operatorValue);
                });
                return;
            }

            // direct value parsing
            const parsedValue = this.parseFilterValue(value);
            this.params.push(parsedValue);
            const condition = `${key} = ?`;
            this.whereClause = this.whereClause
                ? `${this.whereClause} AND ${condition}`
                : condition;
            this.countParams.push(parsedValue);
        });

        return this;
    }

    paginate(): this {
        const page = Number(this.queryParams.page) || 1;
        const limit = Number(this.queryParams.limit) || 10;

        this.page = page;
        this.limit = limit;
        this.skip = (page - 1) * limit;

        this.limitClause = `LIMIT ${limit} OFFSET ${this.skip}`;

        return this;
    }

    sort(): this {
        const sortBy = this.queryParams.sortBy || 'createdAt';
        const sortOrder = this.queryParams.sortOrder === 'asc' ? 'asc' : 'desc';

        this.sortBy = sortBy;
        this.sortOrder = sortOrder;

        const mysqlSortOrder = sortOrder.toUpperCase();

        if (sortBy.includes('.')) {
            const parts = sortBy.split('.');

            if (parts.length === 2) {
                const [relation, nestedField] = parts as [string, string];
                this.orderByClause = `ORDER BY ${relation}.${nestedField} ${mysqlSortOrder}`;
            } else if (parts.length === 3) {
                const [relation, nestedRelation, nestedField] = parts as [string, string, string];
                this.orderByClause = `ORDER BY ${relation}.${nestedRelation}.${nestedField} ${mysqlSortOrder}`;
            } else {
                this.orderByClause = `ORDER BY ${sortBy} ${mysqlSortOrder}`;
            }
        } else {
            this.orderByClause = `ORDER BY ${sortBy} ${mysqlSortOrder}`;
        }

        return this;
    }

    fields(): this {
        const fieldsParam = this.queryParams.fields;

        if (fieldsParam && typeof fieldsParam === 'string') {
            const fieldsArray = fieldsParam.split(',').map(field => field.trim());
            this.selectFields = fieldsArray;

            // Sanitize field names to prevent SQL injection
            const sanitizedFields = fieldsArray.map(field => {
                if (field.includes('.')) {
                    const parts = field.split('.');
                    return parts.map(part => `\`${part}\``).join('.');
                }
                return `\`${field}\``;
            });

            this.selectClause = sanitizedFields.join(', ');
        }

        return this;
    }

    include(relation: TInclude): this {
        if (this.selectFields) {
            return this;
        }

        // For raw MySQL, we would need to implement JOIN logic
        // This is a placeholder - actual implementation depends on your schema
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

        // Apply JOINs based on requested relations
        // This is a simplified implementation - you'd need to implement actual JOIN logic
        requestedRelations.forEach((relation) => {
            if (includeConfig[relation as string]) {
                // Add JOIN logic here based on your schema
            }
        });

        return this;
    }

    where(condition: TWhereInput): this {
        Object.keys(condition as Record<string, unknown>).forEach((key) => {
            const value = (condition as Record<string, unknown>)[key];
            this.params.push(value);
            const newCondition = `\`${key}\` = ?`;
            this.whereClause = this.whereClause
                ? `${this.whereClause} AND ${newCondition}`
                : newCondition;
            this.countParams.push(value);
        });

        return this;
    }

    async execute(): Promise<IMySqlQueryResult<T>> {
        const selectSql = this.buildSelectQuery();
        const countSql = this.buildCountQuery();

        const [dataResult, countResult] = await Promise.all([
            this.db.query(selectSql, this.params),
            this.db.query(countSql, this.countParams)
        ]);

        const data = dataResult as T[];
        const total = countResult[0] ? Number(countResult[0].total) : 0;
        const totalPages = Math.ceil(total / this.limit);

        return {
            data,
            meta: {
                page: this.page,
                limit: this.limit,
                total,
                totalPages,
            }
        };
    }

    async count(): Promise<number> {
        const countSql = this.buildCountQuery();
        const result = await this.db.query(countSql, this.countParams);
        return result[0] ? Number(result[0].total) : 0;
    }

    getQuery(): { sql: string; params: any[] } {
        return {
            sql: this.buildSelectQuery(),
            params: this.params
        };
    }

    private buildSelectQuery(): string {
        let sql = `SELECT ${this.selectClause} FROM \`${this.tableName}\``;

        if (this.whereClause) {
            sql += ` WHERE ${this.whereClause}`;
        }

        if (this.orderByClause) {
            sql += ` ${this.orderByClause}`;
        }

        if (this.limitClause) {
            sql += ` ${this.limitClause}`;
        }

        return sql;
    }

    private buildCountQuery(): string {
        let sql = `SELECT COUNT(*) as total FROM \`${this.tableName}\``;

        if (this.whereClause) {
            sql += ` WHERE ${this.whereClause}`;
        }

        return sql;
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