/**
 * 建模器通用查表，如果不够请补充
 */

// @ts-ignore
import { api } from '@@/plugin-portal/sdk';
import transform from './transformRequest';

interface ResponseRelation {
  attributes: { [key: string]: any };
  entity_id: number;
  data: ResponseRelation[];
}

/** 表查询 */
type RequestEntity = {
  entity_ids: number;
  attributes: string;
  param: {
    [key: string]: string | number | string[] | number[];
  };
};

/** 关联表查询 */
type RequestRelation = RequestEntity & {
  relationTypes: string;
};

/**
 * 通用单表查询
 * @param entityName 表名称
 * @param query 查询对象
 * @returns
 */
export async function getInstance<T = any>(
  entityName: string,
  query?: Partial<RequestEntity>,
) {
  return api.dataService.get<{ attributes: T }[]>(
    `/data/namespaces/{namespace_name}/entity_types/${entityName}/entities?${transform(
      query,
    )}`,
  );
}

/**
 * 通用关联查表
 * @param entityName 表名称
 * @param query 查询对象
 * @returns
 */
export async function getRelation(
  entityName: string,
  query?: Partial<RequestRelation>,
) {
  return api.dataService.get<ResponseRelation[]>(
    `/data/namespaces/{namespace_name}/entity_types/${entityName}/entities_via_relation_types?${transform(
      query,
    )}`,
  );
}

/**
 * 通用sql查询
 * @param entityName 表名称
 * @param sql 查询语句
 */
export async function getSql<T = any>(entityName: string, sql: string) {
  return api.dataService.get<{ attributes: T }[]>(
    `/data/namespaces/{namespace_name}/entity_types/${entityName}/entities_sql?sql=${escape(
      sql,
    )}`,
  );
}