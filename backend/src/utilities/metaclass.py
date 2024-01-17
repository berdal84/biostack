
from typing import Optional

# TODO: find the appropriate pydantic v2 solution to do that (see create_model).
# Couldn't find an easy solution working for Pydantic v2.
# This is not ideal to rely on internal, but I prefer to allocate my time on other tasks.
from pydantic._internal._model_construction import ModelMetaclass

class Partial(ModelMetaclass):
    """
    Meta class to turn every single field of a class Optional.

    Limitation: does not handle nesting, rely on _internal!

    example:
        class UpdateItem(Item, metaclass=Partial):
            pass
    
    adapted from: https://stackoverflow.com/questions/67699451/make-every-field-as-optional-with-pydantic
    """

    def __new__(cls, name, bases, namespaces, **kwargs):
        annotations = namespaces.get('__annotations__', {})
        for base in bases:
            annotations.update(base.__annotations__)
        for field in annotations:
            if not field.startswith('__'):
                annotations[field] = Optional[annotations[field]]
        namespaces['__annotations__'] = annotations
        return super().__new__(cls, name, bases, namespaces, **kwargs)