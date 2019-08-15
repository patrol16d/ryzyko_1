const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("server start at:", port));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

const url = "mongodb+srv://dbUser:dbUserPassword@ryzyko-uu88c.mongodb.net/test?retryWrites=true&w=majority";

const client = new MongoClient(url, { useNewUrlParser: true });
let db_players, db_room;
client.connect().then(() => {
	db_players = client.db("test").collection("players");
	console.log("db ready");
});
//----------------login-----------------
app.get('/login/:data', async (request, response) => {
	console.log("------------------------");
	const web_host = 1;
	const data = request.params.data.split(',');
	const login = data[0];
	const password = data[1];
	const answer1 = {
		status: '',
		new_account: false,
		player: undefined
	};
	await db_players.find({login}).toArray(async (err, docs) => {
		if(docs.length == 0){
			answer1.new_account = true;
			console.log('login new account - "', login, '"');
			answer1.status = 'succcess';
			const player = {
				login,
				password,
				online: true,
				ingame: false,
				host: web_host,
				room: 0,
				color: 'yellow',
				stars: 0,
				army: 0
			}
			await db_players.insertOne(player);
			
			answer1.player = player;
			response.json(answer1);
		}else{
			docs = docs[0];
			console.log('login old account - "', login, '"');
			if(docs.ingame) db_room = await client.db("test").collection("rooms");
			if(docs.password == password){
				await db_players.updateOne({login},{ $set: { host : web_host } });
				
				answer1.status = 'succcess';
				console.log(answer1.status); 
				answer1.player = docs;
				answer1.player.host = web_host;
				response.json(answer1);
			}
			else{
				answer1.status = 'password not valid';
				console.log(answer1.status);
				response.json(answer1);
			}
		}
	});
});

//----------------lobby-----------------
app.get('/getLobbyList', async (request, response) => {
	// console.log("------------------------");
	// console.log("getLobbyList");
	
	await db_players.find({}).toArray(async (err, docs) => {response.json(docs);});
});

app.get('/change_color/:data', async (request, response) => {
	console.log("------------------------");
	const data = request.params.data.split(',');
	const login = data[0];
	const color = data[1];
	console.log("color change", login, "-", color);

	
	await db_players.updateOne({login},{$set:{color}});
	
	response.json({color});
});

app.get('/button_join/:data', async (request, response) => {
	console.log("------------------------");
	const data = request.params.data.split(',');
	const login = data[0];
	const room = Number(data[1]);
	console.log("room change", login, "-", room);
	
	
	
	await db_players.updateOne({login}, {$set:{room}});
	if(room == 0) await db_players.updateOne({login}, {$set:{ingame: false}});
	else{
		let ingame = false;
		await db_players.find({room}).toArray(async (err, docs) => {
			
			console.log(docs[0].login, docs[0].room, docs[0].color);
			if(docs.length > 1) console.log(docs[1].login, docs[1].room, docs[1].color);
			if(docs.length > 2) console.log(docs[2].login, docs[2].room, docs[2].color);
			if(room < 3 && docs.length == 2 && docs[0].color != docs[1].color && docs[0].host != docs[1].host) ingame = true;
			else if(room > 2 && docs.length == 3 && 
			docs[0].color != docs[1].color && 
			docs[1].color != docs[2].color && 
			docs[0].color != docs[2].color	&& 
			docs[0].host != docs[1].host && 
			docs[1].host != docs[2].host && 
			docs[0].host != docs[2].host) ingame = true;
			console.log("verification join_ready", room, "-", docs.length, "people -", ingame);
			if(ingame){
				const countries = [];
				for(let h = 0; h < 42; h ++) countries[h] = {player: 0, army: 1};
				for(let h = 0; h < 42; h += 2) countries[h].player = 1;
				if(docs.length == 3)for(let h = 0; h < 42; h+=3) countries[h].player = 2;
				const stars2 = [4,15,16,17,18,20,22,23,24,25,27,35];
				for(let h = 0; h < stars2.length; h ++)countries[stars2[h]].army = 2;
				
				const deck = [];
				for(let h = 0; h < 42; h ++) deck[h] = 1;
				for(let h = 0; h < stars2.length; h ++) deck[stars2[h]] = 2;
				
				for(let h = 0; h < 300; h++) {
					const i = Math.floor(Math.random()*42);
					const j = Math.floor(Math.random()*42);
					[countries[i].player, countries[j].player] = 
					[countries[j].player, countries[i].player];
					
					const i1 = Math.floor(Math.random()*42);
					const j1 = Math.floor(Math.random()*42);
					[deck[i1], deck[j1]] = [deck[j1], deck[i1]];
				}
				
				let round = Math.floor(Math.random()*3);
				if(docs.length == 2) round = Math.floor(Math.random()*2);
				
				const dice = {
					attack: [],
					defense: []
				}
				const battle = {
					attack: false,
					defense: false
				}
				
				const chat = [];
				db_room = await client.db("test").collection("rooms");
				
				await db_room.find({room}).toArray(async (err, docsl) => {
					if(docsl.length == 0) db_room.insertOne({room,countries,round,dice,battle,deck,chat});
					else db_room.updateOne({room}, {$set:{room,countries,round,dice,battle,deck,chat}});
				});
				await db_players.updateMany({room}, {$set:{ingame, stars: 0, army: 0}});
				await db_players.find({room}).toArray( async (err, data) => {
					
					await db_players.updateMany({room, login: data[round].login}, {$set:{army: 3}});
					
				});
			}
			response.json(ingame);
		});
	}
});

//----------------game------------------
app.get('/end_game/:data', async (request, response) => {
	const room = Number(request.params.data);
	
	await db_players.updateMany({room}, {$set:{ingame: false, stars: 0, army: 0, room: 0}});
});

app.get('/game/:data', async (request, response) => {
	const room = Number(request.params.data);
	await db_room.find({room}).toArray( async (err, docs) => {
		await db_players.find({room}).toArray( (err, data1) => {
			docs[0].players = data1;
			response.json(docs[0]);
		});
	});
});

app.get('/end_round/:data', async (request, response) => {
	console.log("------------------------");
	const data = request.params.data.split(',');
	console.log(data);
	const room = Number(data[0]);
	let take_card = data[1];
	if(take_card === 'true') take_card = true;
	else take_card = false;
	const login = data[2];
	const login1 = data[3];
	const army = Number(data[4]) + 3;
	const round = Number(data[5]);
	let card = 0;
	if(take_card){
		await db_room.find({room}).toArray( async (err, data1) => {
			
			const deck = data1[0].deck;
			if(deck.length > 0){
				const new_star = deck.pop();
				await db_players.find({room, login}).toArray( async (err, data2) => {
					const stars = data2[0].stars + new_star;
					card = new_star;
					await db_players.updateMany({room, login}, {$set:{stars}});
					await response.json({status: 'succcess', card});
				});
			}
		});
	}
	
	await db_room.updateMany({room}, {$set:{round}});
	await db_players.updateMany({room, login: login1}, {$set:{army}});
	if(!take_card) await response.json({status: 'succcess', card});
	
});

app.get('/game_change/:data', async (request, response) => {
	console.log("------------------------");
	const data = request.params.data.split(',');
	const room = Number(data[0]);
	let change = data[1];
	const name = data[2];
	if(change === 'false') change = false;
	else change = Number(change);
	console.log("game_change",change, name);
	if(name == 'battle.defense') await db_room.update({room}, {$set:{'battle.defense': change}}, {multi: true});
	if(name == 'battle.attack') await db_room.update({room}, {$set:{'battle.attack': change}}, {multi: true});
	if(name == 'throw_a_dice'){
		const dice = []
		for(let h = 0; h < change; h++) dice[h] = Math.floor(Math.random()*6) + 1;
		await db_room.update({room}, {$set:{'dice.attack': dice}}, {multi: true});
		
		if(change > 0){
			const player = Number(data[3]);
			let value = "Atak: ";
			if(change == 1) value += dice[0];
			if(change == 2) value += dice[0] + " i " + dice[1];
			if(change == 3) value += dice[0] + ", " + dice[1] + " i " + dice[2];
			await db_room.update({room}, {$push:{chat: {fun: 'throw_a_dice', player, value} }}, {multi: true});
		}
		await response.json({dice, status: 'succcess'});
	}
	if(name == 'throw_a_dice1'){
		const dice1 = [];
		for(let h = 0; h < change; h++) dice1[h] = Math.floor(Math.random()*6) + 1;
		await db_room.update({room}, {$set:{'dice.defense': dice1}}, {multi: true});
		
		if(change > 0){
			const player = Number(data[3]);
			let value = "Obrona: ";
			if(change == 1) value += dice1[0];
			if(change == 2) value += dice1[0] + " i " + dice1[1];
			await db_room.update({room}, {$push:{chat: {fun: 'throw_a_dice', player, value} }}, {multi: true});
			
			await db_room.findOne({room}, async (err, data1) => {
				const dice = data1.dice;
				const countries = data1.countries;
				const battle = data1.battle;
				dice.attack.sort();
				dice.defense.sort();
				if(dice.defense.length == 1 || dice.attack.length == 1){
					if(dice.attack[dice.attack.length - 1] <= dice.defense[dice.defense.length - 1]) countries[battle.attack].army --;
					else countries[battle.defense].army --;
				}
				else{
					if(dice.attack[dice.attack.length - 1] <= dice.defense[dice.defense.length - 1]) countries[battle.attack].army --;
					else countries[battle.defense].army --;
					if(dice.attack[dice.attack.length - 2] <= dice.defense[dice.defense.length - 2]) countries[battle.attack].army --;
					else countries[battle.defense].army --;
				}
				
				if(countries[battle.attack].army == 1) 
					await db_room.update({room}, {$set:{countries, 'battle.attack': false, 'battle.defense': false}}, {multi: true});
				if(countries[battle.defense].army == 0){
					countries[battle.defense].army = dice.attack.length;
					countries[battle.defense].player = countries[battle.attack].player;
					countries[battle.attack].army -= dice.attack.length;
					[battle.attack, battle.defense] = [battle.defense, battle.attack];
					dice.defense = [];
					dice.attack = [];
					if(countries[battle.attack].army == 1){
						battle.attack = false;
						battle.defense = false;
					}
					await db_room.update({room}, {$set:{countries, 'battle.attack': battle.attack, 'battle.defense': battle.defense, dice}}, {multi: true});
				}
				
				await db_room.update({room}, {$set:{countries}}, {multi: true});
				
			});
			
			
		}
		await response.json({dice1, status: 'succcess'});
	}
	if(name == 'back_army'){
		await db_room.findOne({room}, async (err, data1) => {
			const countries = data1.countries;
			const battle = data1.battle;
			countries[battle.attack].army -= change;
			countries[battle.defense].army += change;
			battle.attack = battle.defense;
			battle.defense = false;
			if(data[3] && data[3] === 'end_attack') battle.attack = false;
			await db_room.update({room}, {$set:{countries, battle}}, {multi: true});
			
			await response.json({countries, battle, status: 'succcess'});
		});
	}
	if(name == 'add_army'){
		const login = data[3];
		db_players.update({room, login}, {$set:{army: change}}, {multi: true});
		db_room.update({room}, {$set:{'battle.attack': false, 'battle.defense': false}}, {multi: true});
		
	}
	
	if(name != 'throw_a_dice' && name != 'throw_a_dice1' && name != 'back_army') await response.json({status: 'succcess'});
});

app.get('/send_message/:data', async (request, response) => {
	console.log("------------------------");
	const data = request.params.data.split(',');
	const room = Number(data[0]);
	const player = Number(data[1]);
	const value = data[2];
	console.log("send_message", player, value);
	await db_room.updateMany({room}, {$push:{chat: {fun: '', player, value} }}, (err, count) => {
		console.log(count);
	});
	
	await response.json({status: 'succcess'});
});

app.get('/army_place/:data', async (request, response) => {
	console.log("------------------------");
	const data = request.params.data.split(',');
	const room = Number(data[0]);
	const hover = Number(data[1]);
	const login = data[2];
	const coun_army = Number(data[3]);
	const pl_army = Number(data[4]);
	let countries = [];
	
	await db_room.find({room}).toArray( async (err, docs) => {
		countries = docs[0].countries
		countries[hover].army = coun_army;
		await db_room.updateMany({room}, {$set:{countries}});
	});
	
	console.log("army_place", data);
	
	await db_players.updateMany({room, login}, {$set:{army: pl_army}});
	await response.json({status: 'succcess'});
});





