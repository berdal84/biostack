/** Generic Page type */
export type Page<T> = {
    items: Array<T>;
    total_item_count: number;
}