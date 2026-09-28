export interface IMySqlQueryParams {
    searchTerm?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    fields?: string;
    include?: string;
    [key: string]: string | undefined;
}

export interface IMySqlQueryConfig {
    searchableFields?: string[];
    filterableFields?: string[];
}

export interface IMySqlQueryResult<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface IMySqlPool {
    query(sql: string, params?: any[]): Promise<any>;
    execute(sql: string, params?: any[]): Promise<any>;
}

export interface IMySqlConnection {
    query(sql: string, params?: any[]): Promise<any>;
    release(): void;
}