import json
import os
from datetime import datetime

import typer
from pydantic import BaseModel, computed_field
from rich.console import Console
from rich.table import Table

from models import GameStats, PlayerStats

console = Console()

app = typer.Typer(pretty_exceptions_enable=False)


def load_stats(
    *,
    min_player_count: int | None = None,
    max_player_count: int | None = None,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    min_vp: int | None = None
) -> list[GameStats]:
    def load() -> list[GameStats]:
        with open(os.path.join("downloads", "game-stats.json"), "r") as f:
            docs = json.load(f)
            return [GameStats.model_validate(doc) for doc in docs.values()]

    stats = load()
    filtered_stats: list[GameStats] = []

    for game in stats:
        if start_date and game.last_update < start_date:
            continue
        if end_date and game.last_update > end_date:
            continue

        if min_player_count is not None and game.player_count < min_player_count:
            continue

        if max_player_count is not None and game.player_count > max_player_count:
            continue

        if min_vp is not None:
            invalid = False
            for player in game.players:
                if player.vp is None or player.vp < min_vp:
                    invalid = True
                    break

            if invalid:
                continue

        filtered_stats.append(game)

    return filtered_stats


class WinStats(BaseModel):
    wins: int
    games: int
    average_position: float
    average_score: float
    faction: str
    loses: int

    @computed_field  # type: ignore[prop-decorator]
    @property
    def win_rate(self) -> float:
        return self.wins / self.games

    @computed_field  # type: ignore[prop-decorator]
    @property
    def lose_rate(self) -> float:
        return self.loses / self.games


@app.command()
def analyze_winrates(
    min_vp: int | None = None,
    min_player_count: int = 2,
    max_player_count: int = 5,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
) -> None:
    stats = load_stats(
        min_vp=min_vp,
        min_player_count=min_player_count,
        max_player_count=max_player_count,
        start_date=start_date,
        end_date=end_date,
    )

    player_stats_by_faction: dict[str, list[PlayerStats]] = {}

    for game in stats:
        for player_stats in game.players:
            if player_stats.faction.startswith("nofaction"):
                continue
            elif player_stats.faction in player_stats_by_faction:
                player_stats_by_faction[player_stats.faction].append(player_stats)
            else:
                player_stats_by_faction[player_stats.faction] = [player_stats]

    win_stats: list[WinStats] = []

    for stats_list in player_stats_by_faction.values():
        positions = [stats.rank for stats in stats_list]
        scores = [stats.vp for stats in stats_list if stats.vp is not None]

        win_stats.append(
            WinStats(
                wins=positions.count(1),
                loses=sum([1 for p in stats_list if p.rank == p.player_count]),
                games=len(positions),
                average_position=sum(positions) / len(positions) if positions else -1,
                average_score=sum(scores) / len(scores) if scores else -1,
                faction=stats_list[0].faction,
            )
        )

    table = Table(
        "Faction", "Games", "Wins", "Loses", "Win rate", "Lose rate", "Average position", "Average score"
    )

    win_stats.sort(key=lambda s: s.win_rate, reverse=True)

    for stat in win_stats:
        table.add_row(
            stat.faction,
            f"{stat.games:_}",
            f"{stat.wins:_}",
            f"{stat.loses:_}",
            f"{stat.win_rate:.2%}",
            f"{stat.lose_rate:.2%}",
            f"{stat.average_position:.2f}",
            f"{stat.average_score:.2f}",
        )

    console.print(table)


if __name__ == "__main__":
    app()
