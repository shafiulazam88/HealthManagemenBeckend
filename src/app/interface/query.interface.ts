
//skip means how many records to skip from the start of the result set.
//  It is used for pagination. For example, if you have 100 records
//  and you want to fetch records 11-20, you would set skip to 10 and take to 10.


//take means how many records to take from the result set.
//  It is used for pagination. For example, if you have 100 records 
// and you want to fetch records 11-20, you would set skip to 10 and take to 10.

//cursor is used to specify a starting point for the query. like pointer
export interface PrismaFindManyArgs {
    where ?: Record<string, unknown>;
    include ?: Record<string, unknown>;
    select ?: Record<string, boolean | Record<string, unknown> >
    orderBy ?: Record<string, unknown> | Record<string, unknown>[];
    skip ?: number;
    take ?: number;
    cursor ?: Record<string, unknown>;
    distinct ?: string[] | string;
    [key: string] : unknown;
}

export interface PrismaCountArgs {
    where?: Record<string, unknown>;
    include?: Record<string, unknown>;
    select?: Record<string, boolean | Record<string, unknown>>
    orderBy?: Record<string, unknown> | Record<string, unknown>[];
    skip?: number;
    take?: number;
    cursor?: Record<string, unknown>;
    distinct?: string[] | string;
    [key: string]: unknown;
}

export interface PrismaModelDelegate {
    findMany(args ?: PrismaFindManyArgs) : Promise<unknown[]>;
    count (args ?: PrismaCountArgs) : Promise<number>;
}

export interface IQueryParams {
    searchTerm ?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    fields?: string;
    include?: string;
    [key: string] : string | undefined;
}

export interface IQueryConfig {
    searchableFields?: string[];
    filterableFields?: string[];
}

export interface PrismaStringFilter{
    contains ?: string;
    startsWith ?: string;
    endsWith ?: string;
    mode ?: 'insensitive' | 'default';
    equals ?: string;
    in ?: string[];
    notIn ?: string[];
    lt ?: string;
    lte ?: string;
    gt ?: string;
    gte ?: string;
    not ?: PrismaStringFilter | string;
}

export interface PrismaNumberFilter{
    equals ?: number;
    in ?: number[];
    notIn ?: number[];
    lt ?: number;
    lte ?: number;
    gt ?: number;
    gte ?: number;
    not ?: PrismaNumberFilter | number;
}

export interface PrismaWhereConditions {
    OR ?: Record<string, unknown>[];
    AND ?: Record<string, unknown>[];
    NOT ?: Record<string, unknown>[];
    [key: string] : unknown;
}

export interface IQueryResult<T>{
    data : T[];
    meta : {
        page : number;
        limit : number;
        total : number;
        totalPages : number;
    }
}