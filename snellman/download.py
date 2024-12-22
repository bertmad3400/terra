import code
import json
import os
from datetime import datetime
from time import sleep

import requests
from dateutil.parser import parse as datetime_parse
from dateutil.relativedelta import relativedelta
from pydantic import ValidationError

from models import GameStats

BASE_URL = "https://terra.snellman.net/app/results/v2"

try:
    os.mkdir("downloads")
except FileExistsError:
    pass


def download_game_stats(min_date: datetime, max_date: datetime) -> None:
    current_date: datetime = min_date

    games: dict[str, GameStats] = {}

    while current_date <= max_date:
        print(f"Getting games for {current_date.year}-{current_date.month}")

        url = f"{BASE_URL}/{current_date.year}/{current_date.month}"
        request = requests.get(url)

        if not request.ok:
            print("Request failed")
            code.interact(local=locals())
            sleep(2)

        json_response = request.json()

        for game_id, doc in json_response["games"].items():

            try:
                doc["game_id"] = game_id
                doc["last_update"] = datetime_parse(doc["last_update"])

                for player in doc["players"]:
                    player["player_count"] = doc["player_count"]

                game = GameStats.model_validate(doc)
                if game_id in games:
                    print("Game_id already present")
                    code.interact(local=locals())

                games[game_id] = game
            except (ValidationError, KeyError) as e:
                print("Failed to validate game")
                code.interact(local=locals())
                sleep(2)

        current_date = current_date + relativedelta(months=1)

    print(f"Found {len(games)} games. Exporting to downloads.json")

    with open(os.path.join("downloads", "game-stats.json"), "w") as f:
        json.dump({id: game.model_dump(mode="json") for id, game in games.items()}, f)


if __name__ == "__main__":
    download_game_stats(datetime.fromisoformat("2013-01-01T00:00:00"), datetime.now())
