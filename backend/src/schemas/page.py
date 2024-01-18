
from pydantic import BaseModel


class Page[ItemType](BaseModel):
    """
    Generic class to declare a Page schema for a given item ItemType
    
    usage example:
        # Items in the database
        items = ["item1", "item2", ..., "item42"]

        # Let's make the page 1 (zero-based) with a 10 items limit
        page  = Page[str]()
        page.data.append(item((page)*limit:((page+1)*limit))
        page.total_item_count = len(items)

        return page
    """

    items: list[ItemType]
    "Page items (size is limited, depends on the client's query)"

    total_item_count: int
    "The total item count (not limited to data's content)"

    limit: int
    "The item max count for a page (client needs it when using defaults)"

    index: int
    "Page index (zero-based)"