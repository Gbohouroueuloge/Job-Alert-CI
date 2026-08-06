from schemas.base import ORMModel


class OfferStatsSummaryRead(ORMModel):
    total_offers: int
    new_offers: int


class OfferStatsBucketRead(ORMModel):
    id: str
    code: str
    label: str
    total_offers: int
    new_offers: int
