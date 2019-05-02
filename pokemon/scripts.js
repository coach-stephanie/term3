$(document).ready(function(){
	let poke1, poke2, container; 
	let offset= Math.floor(Math.random()*800);
	
	let playAgain = localStorage.getItem("playAgain");
	if(playAgain) {
		enterGame();
	}

	$('#enter').click(enterGame);

	$('#getPoke1').click(function () {
		getPokemon('#first');
	});

	$('#getPoke2').click(function () {
		getPokemon('#second');
	});

	$('#battle').click(function () {
		if(poke1 && poke2) {
			battle();
		}
		else {
			alert('Please load Pokemon before continuing!');
		}
		
	});

	$('#play-again').click(function() {
		localStorage.setItem("playAgain", true);
		location.reload();
	});

	function enterGame() {
		$('#welcome').hide();
		$('#start').css('display', 'flex');
	}

	function getPokemon(div) {
		//let pokemon;
		container = div; 
		console.log("In function");
		$.get( `https://pokeapi.co/api/v2/pokemon/?limit=1&offset=${offset}`, function( data ) {
		  offset = Math.floor(Math.random()*800);
		  setPokemon(data);
		});
	}

	function setPokemon(data) {
		let pokemon = {
			name: '',
			frontImg: '',
			backImg: '',
			speed: 0,
			defense: 0,
			attack: 0,
			hp: 0
		};
		$.get( `https://pokeapi.co/api/v2/pokemon/${data.results[0].name}`, function( pokeData ) {
		  console.log(pokeData);
		  pokemon.name = capitalize(pokeData.species.name);
		  pokemon.frontImg = pokeData.sprites.front_default;
		  pokemon.backImg = pokeData.sprites.back_default;
		  pokemon.speed = pokeData.stats[0].base_stat;
		  pokemon.defense = pokeData.stats[3].base_stat;
		  pokemon.attack = pokeData.stats[4].base_stat;
		  pokemon.hp = pokeData.stats[5].base_stat;
		  if(container == '#first') {
		    poke1 = pokemon;
		    $('#getPoke1').hide();
		  }
		  else {
		    poke2 = pokemon;
		    $('#getPoke2').hide();
		  }
		  displayPokemon(pokemon);
		});		
	}

	function displayPokemon(pokemon) {
		$(`${container}q`).hide();
		$(container).prepend(`<h1>${pokemon.name}</h1>
			<img class="poke-img" src="${pokemon.frontImg}" alt="${pokemon.name} image">
			<h3>Stats</h3>
			<ul>
				<li>Speed: ${pokemon.speed}</li>
				<li>Attack: ${pokemon.attack}</li>
				<li>Defense: ${pokemon.defense}</li>
			</ul>`
		);
	}

	function battle() {
		console.log("battle!");
		$('#start').hide();
		$('#result').css('display', 'flex');
		let winner = calculateWinner();
		$('#result').prepend(`<h1>Winner!</h1><h1>${winner.name}</h1>
			<img class="poke-img" src="${winner.frontImg}" alt="${winner.name} image">
		`);
	}

	function calculateWinner() {
		let winner;
		if(poke1.attack > poke2.attack) {
			winner = poke1;
		}
		else {
			winner = poke2;
		}
		return winner;
	}

	function capitalize(string) {
	    return string.charAt(0).toUpperCase() + string.slice(1);
	}
})