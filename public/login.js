let player = {};
let players = [];
const list_rooms = [];
for(let i = 0; i < 5; i++) list_rooms[i] = [];
const change_color = [];

const button_log = document.getElementById('submit_log');
button_log.addEventListener('click', async event => {
	
	const login = document.getElementById('login').value;
	const password = document.getElementById('password').value;
	
	if(login == '') document.getElementById('login').placeholder = "Nie podano loginu";
	else if(password == '') document.getElementById('password').placeholder = "Nie podano hasła";
	else {
		console.log("send request login");
		const response_fetch_log = await fetch(`login/${login},${password}`);
		const response_log = await response_fetch_log.json();
		
		if(response_log.status != 'succcess'){
			
			document.getElementById('password').value = '';
			document.getElementById('password').placeholder = "Niepoprawne chało";
		}
		else {
			button_log.removeEventListener('click', event);
			player = response_log.player;
			
			start_lobby();
		}
	}
});
async function start_lobby() {
	document.getElementById('stylesource').href = 'lobby.css';
	
	console.log("send request lobby");
	const response_fetch_lobb = await fetch('lobby.csv');
	const response_lobby = await response_fetch_lobb.text();
	
	document.getElementById('game').innerHTML = response_lobby;
	document.getElementById('mylogin').textContent = player.login;
	document.getElementById('mycolor').style.color = player.color;
	await renderRooms();
	await getLobbyList();
	
	if(player.ingame || (player.room > 0 && await button_join(player.room))){
		console.log("game starts");
		for(let i = 0; i < 4; i++) change_color[i] = undefined;
		document.getElementById('game').innerHTML = '';
		document.getElementById('stylesource').href = 'game.css';
		players = list_rooms[player.room];
		
		start_game(player.room);
		return;
	}
	for(let i = 0; i < 4; i++){
		change_color[i] = document.getElementById('c'+(i+1));
		const color = change_color[i].style.color;
		change_color[i].addEventListener('click', async event => {
			console.log("send request change_color");
			const response_fetch_col = await fetch(`change_color/${player.login},${color}`);
			const response_col = await response_fetch_col.json();
			
			document.getElementById('mycolor').style.color = response_col.color;
			document.getElementById('my_room').innerHTML = `<u> ${player.login} </u><span style="color: ${response_col.color}" >&block;&block;</span>`;
			
			button_join(player.room);
		});
	}
	
	const login_interval = await setInterval(async () => {
		await getLobbyList();
		
		if(player.ingame){
			console.log("game starts");
			for(let i = 0; i < 4; i++) change_color[i] = undefined;
			document.getElementById('game').innerHTML = '';
			document.getElementById('stylesource').href = 'game.css';
			players = list_rooms[player.room];
			clearInterval(login_interval);
			
			start_game(player.room);
			return;
		}
	}, 1000);
}

async function button_join(room) {
	console.log("send request button_join");
	const response_fetch_join = await fetch(`button_join/${player.login},${room}`);
	const response_fetch = await response_fetch_join.json();
	console.log(response_fetch);
	if(response_fetch) return true;
	await getLobbyList();
	return false;
}

function renderRooms(){
	let rooms_html = `
	<li>
		<span style="display: inline-block; width: 570px">Nazwa</span>
		<span style="display: inline-block; width: 45px">Kolor</span>
		<span style="display: inline-block; width: 10px">Host</span>
	</li>`;
	for(let i = 0; i < 5; i++){
		rooms_html += 
		`<li> 
			<h2 id="r${i}"></h2> 
			<span id="players_num${i}" class="room_op"></span> <span id="join${i}" class="room_op"></span>
			<ol id="room${i}"> </ol>
		</li>`;
	}
	document.getElementById('rooms').innerHTML = rooms_html;
}

async function getLobbyList() {
	for(let i = 0; i < 5; i++) list_rooms[i] = [];
	
	const response = await fetch('/getLobbyList');
	const data = await response.json();
	for (item of data) if(item.login == player.login) player = item;
	
	const list_rooms_html = [];
	for(let i = 0; i < 5; i++) list_rooms_html[i] = '';
	
	
	let name = 'Poczeklania';
	for(let i = 0; i < 5; i++){
		if(i>0) name = 'Pokój 2-osobowy';
		if(i>2) name = 'Pokój 3-osobowy';
		if(player.room == i) document.getElementById('r'+i).innerHTML = `<u>${name}</u>`;
		else document.getElementById('r'+i).innerHTML = `${name}`;
		
		for (item of data) {
			if(item.online && item.room == i){
				list_rooms[i].push(item);
				if(item.login == player.login)list_rooms_html[i] +=`<li id="my_room"><u> ${item.login} </u>`
				else list_rooms_html[i] +=`<li>${item.login}`
				list_rooms_html[i] +=
					`<span style="width: 10px; font-size: 25px; margin: 0 10px;">${item.host}</span>
					<span style="margin: 7px 20px; color: ${item.color}" >&block;&block;</span>
				</li>`;
			}
		}
		document.getElementById('room'+i).innerHTML = list_rooms_html[i];
		let button_join = `<input type="submit" value="Dołącz"  class="button_join" onclick="button_join(${i})">`;
		let button_full = `pełny`;
		if(player.room == i) {
			button_join = '';
			if(player.ingame) button_full = 'W grze';
			else{
				if(name == 'Pokój 2-osobowy' && list_rooms[i].length > 1){
					if(list_rooms[i][0].color == list_rooms[i][1].color) button_full = 'Zmień kolor';
					if(list_rooms[i][0].host == list_rooms[i][1].host) button_full = 'Zmień host';
				}
				if(name == 'Pokój 3-osobowy' && list_rooms[i].length > 2){
					if(list_rooms[i][0].color == list_rooms[i][1].color || 
					list_rooms[i][1].color == list_rooms[i][2].color || 
					list_rooms[i][0].color == list_rooms[i][2].color) button_full = 'Zmień kolor';
					if(list_rooms[i][0].host == list_rooms[i][1].host || 
					list_rooms[i][1].host == list_rooms[i][2].host || 
					list_rooms[i][0].host == list_rooms[i][2].host) button_full = 'Zmień host';
				}
			}
		}
		
		if(name == 'Poczeklania') {
			document.getElementById('players_num'+i).innerHTML = list_rooms[i].length;
			document.getElementById('join'+i).innerHTML = button_join;
		}
		else if(name == 'Pokój 2-osobowy'){
			document.getElementById('players_num'+i).innerHTML = list_rooms[i].length + "/2";
			if(list_rooms[i].length > 1) button_join = button_full;
			document.getElementById('join'+i).innerHTML = button_join;
		}
		else if(name == 'Pokój 3-osobowy'){
			document.getElementById('players_num'+i).innerHTML = list_rooms[i].length + "/3";
			if(list_rooms[i].length > 2)button_join = button_full;
			document.getElementById('join'+i).innerHTML = button_join;
			
		}
	}
}		