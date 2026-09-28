import { SelectQueryBuilder } from 'kysely';

export interface IKyselyQueryParams {
    searchTerm?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    fields?: string;
    include?: string;
    [key: string]: string | undefined;
}

export interface IKyselyQueryConfig {
    searchableFields?: string[];
    filterableFields?: string[];
}

export interface IKyselyQueryResult<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface IKyselyModelDelegate<T> {
    findMany(builder: SelectQueryBuilder<any, any, any>[]): Promise<T[]>;
    count(builder: SelectQueryBuilder<any, any, any>[]): Promise<number>;
}