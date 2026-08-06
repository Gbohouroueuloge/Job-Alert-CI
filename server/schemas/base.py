from pydantic import BaseModel, ConfigDict


class ORMModel(BaseModel):
    """Base Pydantic compatible ORM SQLAlchemy.

    À quoi ça sert : les routes peuvent retourner des objets SQLAlchemy sans
    mapper manuellement chaque attribut dans un dictionnaire.
    """

    model_config = ConfigDict(from_attributes=True)
