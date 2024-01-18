/** Generic Page type, see Backend's schemas */
export type Page<T> = {
    items: Array<T>;
    total_item_count: number;
    limit: number;
    index: number;
}