defmodule Memory.Game do

	def new do
		# cards: getRandomCards(),
  	#     currentMove: [],
  	#     score: 0,
  	#     isGameComplete: false,
		%{
			score: 0,
			cards: getRandomCards(),
		}
	end

	defp getRandomCards do
		String.split("ABCDEFGHABCDEFGH", "", trim: true) |> Enum.shuffle() |> Enum.map(fn(x) -> %{letter: x, state: "unmatched"} end)
	end

	def client_view(game) do
		score = game.score
		cards = game.cards
		%{
			score: score,
			cards: cards
		}
	end

	def inc_score(game) do
		score = game.score + 1
		Map.put(game, :score, score)
	end

	def move(game, card1, card2) do
		letter1 = game.cards |> Enum.at(card1) |> Map.fetch(:letter) |> elem(1)
		letter2 = game.cards |> Enum.at(card2) |> Map.fetch(:letter) |> elem(1)
		cards =
			case letter1 == letter2 do
				true -> game.cards 
						|> List.update_at(card1, &(&1 |> Map.put(:state, "matched")))
						|> List.update_at(card2, &(&1 |> Map.put(:state, "matched")))
				false -> game.cards
			end
		Map.put(game, :cards, cards)
	end

end