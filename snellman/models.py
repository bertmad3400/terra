from datetime import datetime

from pydantic import BaseModel


class PlayerStats(BaseModel):
    dropped: int
    exclude_from_stats: int
    faction: str
    id_hash: str | None
    rank: int
    start_order: int
    vp: int | None
    player_count: int


class GameStats(BaseModel):
    base_map: str
    options: list[str]
    game_id: str
    last_update: datetime
    expansion_scoring: int
    players: list[PlayerStats]
    player_count: int
