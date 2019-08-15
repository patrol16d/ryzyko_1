async function start_game() {
	console.log("send request lobby");
	const response_fetch_lobb = await fetch('game.csv');
	const response_lobby = await response_fetch_lobb.text();
	
	document.getElementById('game').innerHTML = response_lobby;
	
	let players_html = '';
	
	for(let i = 0; i < players.length; i++){
		if(players[i].login == player.login) player.num = i;
		
		players_html += `<li><span id="round${i}" ></span>`
		if(player.num == i) players_html += `<u>${players[i].login}</u> `;
		else players_html += `${players[i].login} `;
		players_html += `<span style="color: ${players[i].color}; font-size: 20px;" > ██ </span></li>`;
	}
	document.getElementById('players').innerHTML = players_html;
	
	if(players.length == 2) document.getElementById('chat').style.height = (553 -  104)+"px";
	if(players.length == 3) document.getElementById('chat').style.height = (553 -  156)+"px";
	
	function p(x, y) { return {x, y};}
	
	let wait = false;
	const army_stars = [0, 0, 2, 4, 7, 10, 13, 17, 21, 25, 30];
	
	let hover = false;
	let stage = 0;
	let att_count = 0;
	let back_army = false;
	let end_attack = false;
	let move_army = 0;
	let move_all_army = false;
	let chat_end = false;
	let chat_new = 0;
	let valid = [];
	
	let board_stars = false;
	let board_countries = false;
	let board_countries_count = 0;
	let take_card = false;
	let take_board_countries = false;
	
	let dice = {
		attack: [],
		defense: []
	}
	let round = 100;
	
	let mouse = p(0, 0);
	
	let battle = {
		attack: false,
		defense: false
	}
	let chat = [0];
	
	
	const points = {
0:p(54,77),1:p(66,50),2:p(40,116),3:p(86,127),4:p(100,53),5:p(236,59),6:p(244,113),7:p(173,113),8:p(94,92),9:p(169,185),
10:p(94,178),11:p(106,271),12:p(157,272),13:p(158,256),14:p(175,257),15:p(183,187),16:p(236,187),17:p(278,188),18:p(230,287),19:p(155,288),
20:p(158,337),21:p(132,338),22:p(116,338),23:p(150,393),24:p(205,393),25:p(205,336),26:p(302,332),27:p(335,382),28:p(328,486),29:p(238,486),
30:p(237,396),31:p(320,582),32:p(260,580),33:p(214,485),34:p(197,455),35:p(157,439),36:p(284,6),37:p(385,10),38:p(384,106),39:p(352,113),
40:p(350,81),41:p(277,80),42:p(404,97),43:p(446,96),44:p(445,136),45:p(400,139),46:p(401,161),47:p(436,158),48:p(435,201),49:p(403,208),
50:p(534,116),51:p(508,122),52:p(498,171),53:p(459,182),54:p(470,106),55:p(529,88),56:p(680,77),57:p(682,178),58:p(647,188),59:p(644,250),
60:p(550,251),61:p(546,230),62:p(533,186),63:p(456,218),64:p(411,243),65:p(431,336),66:p(457,332),67:p(461,304),68:p(480,295),69:p(467,255),
70:p(487,327),71:p(562,280),72:p(564,312),73:p(574,335),74:p(489,359),75:p(548,363),76:p(553,446),77:p(548,510),78:p(586,509),79:p(611,424),
80:p(573,564),81:p(495,568),82:p(493,506),83:p(489,451),84:p(424,442),85:p(425,338),86:p(633,401),87:p(674,392),88:p(667,316),89:p(661,250),
90:p(737,259),91:p(773,265),92:p(770,310),93:p(737,380),94:p(817,354),95:p(866,364),96:p(877,278),97:p(889,259),98:p(894,223),99:p(880,196),
100:p(783,182),101:p(778,161),102:p(735,159),103:p(736,180),104:p(734,63),105:p(802,35),106:p(878,20),107:p(976,15),108:p(972,66),109:p(910,85),
110:p(890,134),111:p(864,129),112:p(872,76),113:p(794,81),114:p(785,127),115:p(930,112),116:p(962,114),117:p(939,209),118:p(912,203),119:p(812,405),
120:p(862,404),121:p(855,459),122:p(812,460),123:p(889,404),124:p(939,402),125:p(938,436),126:p(889,438),127:p(868,481),128:p(808,493),129:p(824,576),
130:p(881,548),131:p(935,566),132:p(933,465),133:p(265,114),134:p(313,117),135:p(547,277),136:p(584,359),137:p(622,491),138:p(651,494),139:p(646,555),
140:p(619,553),141:p(278,56),142:p(292,80),143:p(324,80),144:p(294,115),145:p(255,113),146:p(240,85),147:p(370,109),148:p(401,115),149:p(447,112),
150:p(466,123),151:p(422,137),152:p(419,158),153:p(435,177),154:p(420,205),155:p(478,176),156:p(474,209),157:p(497,291),158:p(518,286),159:p(526,318),
160:p(472,329),161:p(424,388),162:p(610,376),163:p(841,359),164:p(835,403),165:p(859,429),166:p(835,458),167:p(837,486),168:p(909,471),169:p(915,438),
170:p(888,419),171:p(884,169),172:p(921,157),173:p(461,158),174:p(432,230),175:p(600,395),176:p(598,468),177:p(620,520),178:p(580,534),179:p(898,112),
180:p(975,38),181:p(1010,38),182:p(1010,-10),183:p(-10,-10),184:p(-10,77)
	};
	const colors = {
	'amN':"rgb(255, 201, 14)",
	'amS':"rgb(237, 28, 36)",
	'eu':"rgb(0, 0, 160)",
	'as':"rgb(34, 177, 76)",
	'af':"rgb(136, 0, 21)",
	'au':"rgb(163, 71, 164)"
	};
	const countries = [
	
{name:{value:"Alaska",place:p(55,84), size:12},continent: "amN",border:[1,2,3,8,4],
connections:{1:[4,8],3:[8,3],19:[180,181,182,183,184,0]},center:p(73,88),radius:25, player: 0, army: 1},
{name:{value:"Terytoria Północno-Zachodnie",place:p(118,78), size:12},continent: "amN",border:[4,5,6,7,8],
connections:{0:[4,8],3:[8,7],4:[6,7],2:[141,146]},center:p(169,84),radius:30, player: 0, army: 1},
{name:{value:"Grenlandia",place:p(295,27), size:16},continent: "amN",border:[36,37,38,39,40,41],
connections:{1:[141,146],4:[142,145],5:[143,144],13:[147,148]},center:p(332,46),radius:33, player: 0, army: 1},
{name:{value:"Alberta",place:p(100,126), size:18},continent: "amN",border:[3,8,7,9,10],
connections:{0:[3,8],1:[7,8],4:[7,9],6:[9,10]},center:p(131,146),radius:32, player: 0, army: 1},
{name:{value:"Ontario",place:p(183,136), size:17},continent: "amN",border:[7,9,15,16,133,6],
connections:{1:[6,7],2:[142,145],3:[7,9],5:[133,16],6:[9,15],7:[15,16]},center:p(212,150),radius:32, player: 0, army: 1},
{name:{value:"Kanada Wschod.",place:p(259,136), size:10},continent: "amN",border:[16,17,134,133],
connections:{2:[143,144],4:[133,16],7:[16,17]},center:p(273,152),radius:20, player: 0, army: 1},
{name:{value:"USA Zachodnie",place:p(104,208), size:15},continent: "amN",border:[9,10,11,12,13,14,15],
connections:{3:[9,10],4:[16,17],7:[12,13,14,15],8:[11,12]},center:p(135,229),radius:31, player: 0, army: 1},
{name:{value:"USA Wschodnie",place:p(188,217), size:13},continent: "amN",border:[12,13,14,15,16,17,18,19],
connections:{4:[15,16],5:[16,17],6:[12,13,14,15],8:[12,19]},center:p(213,240),radius:32, player: 0, army: 1},
{name:{value:"Ameryka Środkowa",place:p(110,291), size:10},continent: "amN",border:[11,12,19,20,21,22],
connections:{6:[11,12],7:[12,19],9:[20,21]},center:p(130,307),radius:20, player: 0, army: 1},
{name:{value:"Wenezuela",place:p(140,354), size:12},continent: "amS",border:[20,21,23,24,25],
connections:{8:[20,21],10:[24,25],11:[23,24]},center:p(170,366),radius:27, player: 0, army: 1},
{name:{value:"Brazylia",place:p(234,369), size:20},continent: "amS",border:[24,25,26,27,28,29,30],
connections:{9:[24,25],11:[29,30,24],12:[28,29],29:[27,161]},center:p(285,416),radius:38, player: 0, army: 1},
{name:{value:"Peru",place:p(175,417), size:16},continent: "amS",border:[23,24,30,29,33,34,35],
connections:{9:[23,24],10:[29,30,24],12:[29,33]},center:p(200,430),radius:30, player: 0, army: 1},
{name:{value:"Argentyna",place:p(243,510), size:16},continent: "amS",border:[29,28,31,32,33],
connections:{10:[28,29],11:[29,33]},center:p(283,540),radius:33, player: 0, army: 1},
{name:{value:"Islandia",place:p(406,110), size:11},continent: "eu",border:[42,43,44,45],
connections:{2:[147,148],14:[149,150],21:[151,152]},center:p(424,117),radius:20, player: 0, army: 1},
{name:{value:"Skandynawia",place:p(470,114), size:10},continent: "eu",border:[50,51,52,53,54,55],
connections:{13:[149,150],15:[50,55],21:[173,153],23:[155,156]},center:p(483,140),radius:20, player: 0, army: 1},
{name:{value:"Rosja",place:p(573,144), size:26},continent: "as",border:[50,55,56,57,58,59,60,61,62],
connections:{14:[50,55],16:[56,57],23:[61,62],24:[60,61],25:[57,58,59],32:[59,60]},center:p(594,178),radius:50, player: 0, army: 1},
{name:{value:"Ural",place:p(689,114), size:18},continent: "as",border:[56,57,103,102,104],
connections:{15:[56,57],17:[102,104],25:[57,103],26:[102,103]},center:p(706,136),radius:26, player: 0, army: 1},
{name:{value:"Syberia",place:p(739,95), size:14},continent: "as",border:[101,102,104,105,113,114],
connections:{16:[102,104],18:[105,113],20:[113,114],26:[101,102],27:[101,114]},center:p(760,117),radius:26, player: 0, army: 1},
{name:{value:"Jakuck",place:p(810,48), size:16},continent: "as",border:[105,106,112,113],
connections:{17:[105,113],19:[106,112],20:[112,113]},center:p(835,58),radius:20, player: 0, army: 1},
{name:{value:"Kamczatka",place:p(888,44), size:16},continent: "as",border:[106,107,108,109,110,111,112],
connections:{0:[180,181,182,183,184,0],18:[106,112],20:[111,112],27:[110,111],28:[172,179]},center:p(916,54),radius:28, player: 0, army: 1},
{name:{value:"Irkuck",place:p(809,100), size:17},continent: "as",border:[111,112,113,114],
connections:{17:[113,114],18:[112,113],19:[111,112],27:[111,114]},center:p(829,108),radius:24, player: 0, army: 1},
{name:{value:"Wielka Brytania",place:p(403,169), size:9},continent: "eu",border:[46,47,48,49],
connections:{13:[151,152],14:[153,173],22:[154,174],23:[153,156]},center:p(419,182),radius:18, player: 0, army: 1},
{name:{value:"Europa Zachodnia",place:p(419,254), size:10},continent: "eu",border:[63,64,65,66,67,68,69],
connections:{21:[154,174],23:[63,69],24:[68,69],29:[65,66]},center:p(446,281),radius:26, player: 0, army: 1},
{name:{value:"Europa Północna",place:p(473,220), size:10},continent: "eu",border:[61,62,63,69],
connections:{14:[155,156],15:[61,62],21:[153,156],22:[63,69],24:[61,69]},center:p(501,222),radius:20, player: 0, army: 1},
{name:{value:"Europa Południowa",place:p(480,260), size:10},continent: "eu",border:[60,61,69,68,135],
connections:{15:[60,61],22:[68,69],23:[61,69],29:[157,160],30:[158,159],32:[60,135]},center:p(510,264),radius:20, player: 0, army: 1},
{name:{value:"Afganistan",place:p(658,205), size:15},continent: "as",border:[57,58,59,89,90,103],
connections:{15:[57,58,59],16:[57,103],26:[90,103],32:[59,89],33:[89,90]},center:p(691,222),radius:31, player: 0, army: 1},
{name:{value:"Chiny",place:p(780,211), size:20},continent: "as",border:[90,91,96,97,98,99,100,101,102,103],
connections:{16:[102,103,],17:[101,102],25:[90,103],27:[99,100,101],33:[90,91],34:[91,96]},center:p(801,227),radius:35, player: 0, army: 1},
{name:{value:"Mongolia",place:p(800,148), size:15},continent: "as",border:[99,100,101,101,114,111,110],
connections:{17:[101,114],19:[110,111],20:[111,114],26:[99,100,101],28:[171,172]},center:p(831,161),radius:28, player: 0, army: 1},
{name:{value:"Japonia",place:p(926,135), size:9},continent: "as",border:[115,116,117,118],
connections:{19:[172,179],27:[171,172]},center:p(936,160),radius:16, player: 0, army: 1},
{name:{value:"Afryka Północna",place:p(458,383), size:17},continent: "af",border:[65,66,70,74,75,76,83,84,85],
connections:{10:[27,161],22:[65,66],24:[157,160],30:[70,74,75],31:[75,76],35:[76,83]},center:p(487,404),radius:40, player: 0, army: 1},
{name:{value:"Egipt",place:p(514,342), size:16},continent: "af",border:[70,74,75,136,73,72],
connections:{24:[158,159],29:[70,74,75],31:[75,136],32:[72,73]},center:p(541,342),radius:20, player: 0, army: 1},
{name:{value:"Afryka Wschodnia",place:p(552,414), size:11},continent: "af",border:[75,76,77,78,79,136],
connections:{29:[75,76],30:[75,136],32:[175,162],35:[76,77],36:[77,78],37:[176,177]},center:p(579,445),radius:24, player: 0, army: 1},
{name:{value:"Środkowy Wschód",place:p(588,281), size:15},continent: "as",border:[59,60,135,71,72,73,86,87,88,89],
connections:{15:[59,60],24:[60,135],25:[59,89],30:[72,73],31:[175,162],33:[88,89]},center:p(618,319),radius:36, player: 0, army: 1},
{name:{value:"Indie",place:p(700,285), size:16},continent: "as",border:[88,89,90,91,92,93],
connections:{25:[89,90],26:[90,91],32:[88,89],34:[91,92]},center:p(717,304),radius:34, player: 0, army: 1},
{name:{value:"Azja Południowo- Wschodnia",place:p(799,296), size:12},continent: "as",border:[91,92,94,95,96,],
connections:{26:[91,96],33:[91,92],38:[163,164]},center:p(829,313),radius:30, player: 0, army: 1},
{name:{value:"Afryka Środkowa",place:p(494,467), size:12},continent: "af",border:[76,77,82,83],
connections:{29:[76,83],31:[76,77],36:[77,82]},center:p(521,478),radius:26, player: 0, army: 1},
{name:{value:"Afryka Południowa",place:p(501,528), size:14},continent: "af",border:[77,78,80,81,82],
connections:{31:[77,78],35:[77,82],37:[177,178]},center:p(539,537),radius:24, player: 0, army: 1},
{name:{value:"Mada- gaskar",place:p(622,507), size:9},continent: "af",border:[137,138,139,140],
connections:{31:[176,177],36:[177,178]},center:p(635,523),radius:18, player: 0, army: 1},
{name:{value:"Indonezja",place:p(814,419), size:10},continent: "au",border:[119,120,121,122],
connections:{34:[163,164],39:[165,170],40:[166,167]},center:p(835,432),radius:21, player: 0, army: 1},
{name:{value:"Nowa Gwinea",place:p(897,416), size:11},continent: "au",border:[123,124,125,126],
connections:{38:[165,170],41:[168,169]},center:p(914,420),radius:16, player: 0, army: 1},
{name:{value:"Australia Zachodnia",place:p(819,513), size:11},continent: "au",border:[127,128,129,130],
connections:{38:[166,167],41:[126,130]},center:p(845,525),radius:27, player: 0, army: 1},
{name:{value:"Australia Wschodnia",place:p(877,500), size:11},continent: "au",border:[127,130,131,132],
connections:{39:[168,169],40:[126,130]},center:p(904,515),radius:26, player: 0, army: 1}

];
	const bridges = [
		[141,146],
		[142,145],
		[143,144],
		[147,148],
		[149,150],
		[151,152],
		[173,153,156,155],
		[154,174],
		[27, 161],
		[162,175],
		[176,177,178],
		[157,160],
		[158,159],
		[163,164],
		[165,170],
		[166,167],
		[168,169],
		[171,172,179],
		[180,181,182,183,184,0]
	];
	
	let timer = 0;
	let timer_end = 1;
	let timer_step = 0.01;
	
	
	await setInterval(async () => {
		timer = 0;
		//console.log("setInterval");
		try{
			const response_fetch_game = await fetch(`game/${player.room}`);
			const r_game = await response_fetch_game.json();
			dice = await r_game.dice;
			battle = await r_game.battle;
			players = await r_game.players;
			const num = player.num;
			player = players[player.num];
			player.num = num;
			
			if(round == player.num && battle.attack !== false && countries[battle.attack].player != r_game.countries[battle.attack].player && r_game.countries[battle.attack].army > 1) back_army = true;
			
			for(let h = 0; h < 42; h++){
				if(round == player.num && countries[h].player != r_game.countries[h].player) take_card = true;
				
				countries[h].player = await r_game.countries[h].player;
				countries[h].army = await r_game.countries[h].army;
				
			}
			if(round != await r_game.round || round == 100){
				round = await r_game.round;
				for(let i = 0; i < players.length; i++) document.getElementById('round'+i).innerHTML = '';
				document.getElementById('round'+round).innerHTML = '->';
			}
			if(chat.length != r_game.chat.length){
				chat = r_game.chat;
				let chat_html = `<span style="color: #000; font-size: 26;">---------Gra się rozpoczęła-------</span>`;
				for(message of chat){
					
					if(message.fun == 'throw_a_dice') chat_html += `<li style="background: rgba(50,50,50,0.3)">`;
					else chat_html += `<li>`;
					chat_html += `<span class="h7">
						${players[message.player].login}
						<span style="color: ${players[message.player].color}; font-size: 14px;" > ██ </span>
					</span><br>`;
					chat_html += `${message.value}`;
					chat_html += `</li>`;
				}
				let test = true;
				const chat_el = document.getElementById('chat');
			//	chat_el.style.scroll-behavior = 'auto';
				const test1 = chat_el.scrollTop;
				chat_el.scroll(0, chat_el.scrollHeight);
				if(test1 != chat_el.scrollTop){
				//	chat_new++;
					test = false;
					chat_el.scroll(0, test1);
				}
				chat_el.innerHTML = chat_html;
				if(test) chat_el.scroll(0, chat_el.scrollHeight);
			//	chat_el.style.scroll-behavior = 'smooth';
			}
			
		}catch(er){ console.log("setInterval error",er) }
	},timer_end*1000);
	setInterval(() => {timer++;},timer_step*1000);
	
	let can = document.getElementById('game_board');
	let ctx = can.getContext('2d');
	can.width = 1000;
	can.height = 600;
	
	function mousemove() {
		can.style.cursor = "default";
		hover = false;
		move_all_army = false;
		stage = 0;
		att_count = 0;
		board_stars = false;
		board_countries = false;
		
		for(let h = 0; h < countries.length; h++) if(Math.sqrt(Math.pow(countries[h].center.x - mouse.x, 2) + Math.pow(countries[h].center.y - mouse.y, 2)) < countries[h].radius) hover = h;
		
		if(round == player.num){
			if(dice.attack.length > 0 && dice.defense.length == 0){
				// if(mouse.x > 578 && mouse.x < 678 && mouse.y > 13 && mouse.y < 38){
					// can.style.cursor = "pointer";
					// stage = 8;
				// }
			}
			else if(player.army > 0){
				if(hover !== false && countries[hover].player == player.num){
					can.style.cursor = "pointer";
					stage = 1;
				}
			}
			else if(hover !== false){
				if(countries[hover].player == player.num){
					//&& countries[hover].army > 1
					if(battle.attack === false && countries[hover].army > 1 || battle.attack === hover){
						can.style.cursor = "pointer";
						stage = 2;
					}
					else if(battle.attack !== false){
						
						get_valid();
						for(con of valid){
							if(hover === con){
								can.style.cursor = "pointer";
								stage = 3;
							}
						}
						
					}
				}
				else if(battle.attack !== false && countries[battle.attack].connections[hover]){
					
					if(!end_attack){
						can.style.cursor = "pointer";
						stage = 3;
					}
				}
			}
			else if(battle.attack !== false && battle.defense !== false){
				
				if(countries[battle.defense].player != player.num){
					if(mouse.y > 30 && mouse.y < 50){
						if(mouse.x > 720 && mouse.x < 740) att_count = 1;
						else if(countries[battle.attack].army > 2 && mouse.x > 750 && mouse.x < 770) att_count = 2;
						else if(countries[battle.attack].army > 3 && mouse.x > 780 && mouse.x < 800) att_count = 3;
						if(att_count !== 0){
							can.style.cursor = "pointer";
							stage = 4;
						}
					}
				}
				else{
					if(mouse.y > 20 && mouse.y < 50 && mouse.x > 715 && mouse.x < 805){
						can.style.cursor = "pointer";
						stage = 5;
						if(mouse.x > 750) move_all_army = true;
					}
				}
			}
			if(battle.attack === false && battle.defense === false && player.army == 0 &&
			mouse.x > 435 && mouse.x < 635 && mouse.y < 50){
				can.style.cursor = "pointer";
				if(!take_board_countries && board_countries_count > 11) stage = 6
				else stage = 7;
				
			}
		}
		else{
			if(battle.defense !== false && dice.attack.length > 0){
				if(countries[battle.defense].player == player.num){
					if(mouse.x > 578 && mouse.x < 678 && mouse.y > 13 && mouse.y < 38){
						can.style.cursor = "pointer";
						stage = 8;
					}
				}
			}
		}
		if(mouse.x < 40 && mouse.y > 570) board_stars = true;
		else if(mouse.x < 40 && mouse.y > 540) board_countries = true;
		
	}
	
	can.addEventListener("mousemove", (event) => {
		mouse = {x: event.layerX, y: event.layerY};
		
		mousemove();
		
	});
	
	can.addEventListener("click", async (event) => {
		if(!wait){
			wait = true;
			if(stage == 1){
				const coun_army = Number(countries[hover].army) + 1;
				const pl_army = Number(players[round].army) - 1;
				const game_change_fetch = await fetch(`/army_place/${player.room},${hover},${players[round].login},${coun_army},${pl_army}`);
				const game_change = await game_change_fetch.json();
				if(game_change.status == 'succcess'){
					player.army--; 
					countries[hover].army++;
					wait = false;
				}
			}
			else if(stage > 1 && stage < 8){
				if(dice.defense.length != 0){
					const game_change_fetch = await fetch(`/game_change/${player.room},${att_count},throw_a_dice,${round}`);
					const game_change = await game_change_fetch.json();
					if(game_change.status == 'succcess'){
						dice.attack = [];
						const game_change_fetch1 = await fetch(`/game_change/${player.room},0,throw_a_dice1,${round}`);
						const game_change1 = await game_change_fetch1.json();
						if(game_change1.status == 'succcess'){
							dice.defense = [];
						}
					}
				}
				if(stage == 2){
					if(battle.attack === hover) hover = false;
					const game_change_fetch = await fetch(`/game_change/${player.room},${hover},battle.attack`);
					const game_change = await game_change_fetch.json();
					if(game_change.status == 'succcess'){
						battle.attack = hover;
						
						if(hover === false && battle.defense !== false){
							const game_change_fetch1 = await fetch(`/game_change/${player.room},false,battle.defense`);
							const game_change1 = await game_change_fetch1.json();
							if(game_change1.status == 'succcess'){
								battle.defense = false;
								wait = false;
							}
						}
						else wait = false;
					}
				}
				else if(stage == 3){
					if(battle.defense === hover) hover = false;
					const game_change_fetch = await fetch(`/game_change/${player.room},${hover},battle.defense`);
					const game_change = await game_change_fetch.json();
					if(game_change.status == 'succcess'){
						battle.defense = hover;
						wait = false;
					}
				}
				else if(stage == 4){
					const game_change_fetch = await fetch(`/game_change/${player.room},${att_count},throw_a_dice,${round}`);
					const game_change = await game_change_fetch.json();
					if(game_change.status == 'succcess'){
						dice.attack = game_change.dice;
						wait = false;
					}
				}
				else if(stage == 5){
					if(back_army) move_army = countries[battle.attack].army - 1;
					else{
						if(move_all_army) move_army = countries[battle.attack].army - 1;
						else{
							move_army = Number(prompt("Ile wojaska przenieść?",''));
							if(move_army > countries[battle.attack].army - 1) move_army = 0;
						}
					}
					if(move_army > 0){
						if(!back_army) end_attack = true;
						const game_change_fetch = await fetch(`/game_change/${player.room},${move_army},back_army`);
						const game_change = await game_change_fetch.json();
						if(game_change.status == 'succcess'){
							countries[battle.attack].army = game_change.countries[battle.attack].army;
							countries[battle.defense].army = game_change.countries[battle.defense].army;
							battle = game_change.battle;
							wait = false;
						}
					}
					else wait = false;
				}
				else if(stage == 6){
					let army_add = 0;
					if(board_countries_count < 15) army_add = 1;
					else if(board_countries_count < 18) army_add = 2;
					else if(board_countries_count < 21) army_add = 3;
					else if(board_countries_count < 24) army_add = 4;
					else if(board_countries_count < 27) army_add = 5;
					else if(board_countries_count < 30) army_add = 6;
					else if(board_countries_count < 33) army_add = 7;
					else if(board_countries_count < 36) army_add = 8;
					else if(board_countries_count < 40) army_add = 9;
					else army_add = 10;
					const game_change_fetch = await fetch(`/game_change/${player.room},${army_add},add_army,${player.login}`);
					const game_change = await game_change_fetch.json();
					if(game_change.status == 'succcess'){
						take_board_countries = true;
						end_attack = true;
						wait = false;
					}
					
				}
				else if(stage == 7){
					let round1 = round;
					round1++;
					if(player.room < 3) if(round1 > 1) round1 = 0;
					else if(round1 > 2) round1 = 0;
					let next_player = players[round1];
					let next_player_army = army_stars[next_player.stars];
					const game_change_fetch = await fetch(`/end_round/${player.room},${take_card},${player.login},${next_player.login},${next_player_army},${round1}`);
					const game_change = await game_change_fetch.json();
					if(game_change.status == 'succcess'){
						round = round1;
						for(let i = 0; i < players.length; i++) document.getElementById('round'+i).innerHTML = '';
						document.getElementById('round'+round).innerHTML = '->';
						att_count = 0;
						end_attack = false;
						move_army = 0;
						move_all_army = false;
						valid = [];
						take_card = false;
						take_board_countries = false;
						wait = false;
					}
					
				}
				back_army = false;
			}
			else if(stage == 8){
				let def_count = countries[battle.defense].army;
				if(def_count > 2) def_count = 0;
				const game_change_fetch = await fetch(`/game_change/${player.room},${def_count},throw_a_dice1,${player.num}`);
				const game_change = await game_change_fetch.json();
				if(game_change.status == 'succcess'){
					dice.defense = game_change.dice1;
					wait = false;
				}
			}
			else wait = false;
			mousemove();
		}
		else{ console.log("wait - lag error"); }
	});
	
	const send_message = document.getElementById('send_message');
	send_message.addEventListener("click", async (event) => {
		
		const text_message = document.getElementById('text_message');
		if(text_message.value != ''){
			const game_change_fetch = await fetch(`/send_message/${player.room},${player.num},${text_message.value}`);
			const game_change = await game_change_fetch.json();
			
		}
	});
	
	function get_valid() {
		if(battle.attack !== false){
			valid = [];
			for(let h = 0; h < 42; h++){
				if(countries[battle.attack].connections[h] && countries[h].player == player.num){
					let test_valid = true;
					for(let i = 0; i < valid.length; i++) if(valid[i] == h) test_valid = false;
					if(test_valid) valid.push(h);
				}
			}
			for(let g = 0; g < valid.length; g++){
				for(let h = 0; h < 42; h++){
					if(countries[valid[g]].connections[h] && countries[h].player == player.num){
						let test_valid = true;
						for(let i = 0; i < valid.length; i++) if(valid[i] == h) test_valid = false;
						if(test_valid)valid.push(h);
					}
				}
			}
		}
	}
	
	function draw_a(shape,country, radius1, x, y) {
		const radius2 = country.radius*radius1;
		const coun_c = country.center;
		switch (shape){
			case 1:
				ctx.beginPath()
				ctx.globalAlpha = 0.5;
				ctx.arc(coun_c.x+radius2*x, coun_c.y+radius2*y, radius2, 0, 2*Math.PI);
				ctx.fill();
				ctx.beginPath();
				ctx.globalAlpha = 1;
				ctx.arc(coun_c.x+radius2*x, coun_c.y+radius2*y, radius2*0.5, 0, 2*Math.PI);
				ctx.fill();
			break;
			case 5:
				ctx.beginPath()
				ctx.globalAlpha = 0.5;
				ctx.rect(coun_c.x+radius2*(x-1), coun_c.y+radius2*(y-1), radius2*2, radius2*2);
				ctx.fill();
				ctx.beginPath();
				ctx.globalAlpha = 1;
				ctx.rect(coun_c.x+radius2*(x-0.5), coun_c.y+radius2*(y-0.5), radius2, radius2);
				ctx.fill();
			break;
			case 10:
				ctx.beginPath()
				ctx.globalAlpha = 0.5;
				ctx.moveTo(coun_c.x+radius2*x, coun_c.y+radius2*(y-1));
				ctx.lineTo(coun_c.x+radius2*(x-0.866), coun_c.y+radius2*(y+0.5));
				ctx.lineTo(coun_c.x+radius2*(x+0.866), coun_c.y+radius2*(y+0.5));
				ctx.fill();
				ctx.beginPath()
				ctx.globalAlpha = 1;
				ctx.moveTo(coun_c.x+radius2*x, coun_c.y+radius2*(y-0.5));
				ctx.lineTo(coun_c.x+radius2*(x-0.433), coun_c.y+radius2*(y+0.25));
				ctx.lineTo(coun_c.x+radius2*(x+0.433), coun_c.y+radius2*(y+0.25));
				ctx.fill();
			break;
			case 50:
				ctx.beginPath()
				ctx.globalAlpha = 0.5;
				ctx.moveTo(coun_c.x+radius2*x, coun_c.y+radius2*(y+1));
				ctx.lineTo(coun_c.x+radius2*(x-0.866), coun_c.y+radius2*(y-0.5));
				ctx.lineTo(coun_c.x+radius2*(x+0.866), coun_c.y+radius2*(y-0.5));
				ctx.fill();
				ctx.beginPath()
				ctx.globalAlpha = 1;
				ctx.moveTo(coun_c.x+radius2*x, coun_c.y+radius2*(y+0.5));
				ctx.lineTo(coun_c.x+radius2*(x-0.433), coun_c.y+radius2*(y-0.25));
				ctx.lineTo(coun_c.x+radius2*(x+0.433), coun_c.y+radius2*(y-0.25));
				ctx.fill();
			break;
		}
	}
	
	function draw_cube(num, size, color, x, y) {
		const r = size*0.08;
		const r_curve = size*0.2;
		ctx.beginPath()
		ctx.arc(x-(size*0.5-r_curve),y+(size*0.5-r_curve),r_curve, 2*Math.PI*0.25, 2*Math.PI*0.5);
		ctx.arc(x-(size*0.5-r_curve),y-(size*0.5-r_curve),r_curve, 2*Math.PI*0.5, 2*Math.PI*0.75);
		ctx.arc(x+(size*0.5-r_curve),y-(size*0.5-r_curve),r_curve, 2*Math.PI*0.75, 2*Math.PI*0);
		ctx.arc(x+(size*0.5-r_curve),y+(size*0.5-r_curve),r_curve, 2*Math.PI*0, 2*Math.PI*0.25);
		ctx.fillStyle = color;
		ctx.fill();
		
		ctx.beginPath();
		ctx.fillStyle = "#fff";
		switch (num){
			case 1:
				ctx.arc(x, y, r, 0, 2*Math.PI);
				ctx.fill();
			break;
			case 2:
				ctx.beginPath();
				ctx.arc(x+size*0.25, y+size*0.25, r, 0, 2*Math.PI);
				ctx.fill();
				ctx.arc(x-size*0.25, y-size*0.25, r, 0, 2*Math.PI);
				ctx.fill();
			break;
			case 3:
				ctx.arc(x, y, r, 0, 2*Math.PI);
				ctx.fill();
				ctx.arc(x+size*0.25, y+size*0.25, r, 0, 2*Math.PI);
				ctx.fill();
				ctx.arc(x-size*0.25, y-size*0.25, r, 0, 2*Math.PI);
				ctx.fill();
			break;
			case 4:
				ctx.beginPath();
				ctx.fill();
				ctx.arc(x+size*0.25, y+size*0.25, r, 0, 2*Math.PI);
				ctx.fill();
				ctx.beginPath();
				ctx.arc(x-size*0.25, y+size*0.25, r, 0, 2*Math.PI);
				ctx.fill();
				ctx.beginPath();
				ctx.arc(x+size*0.25, y-size*0.25, r, 0, 2*Math.PI);
				ctx.fill();
				ctx.beginPath();
				ctx.arc(x-size*0.25, y-size*0.25, r, 0, 2*Math.PI);
				ctx.fill();
			break;
			case 5:
				ctx.beginPath();
				ctx.arc(x+size*0.25, y+size*0.25, r, 0, 2*Math.PI);
				ctx.fill();
				ctx.beginPath();
				ctx.arc(x-size*0.25, y+size*0.25, r, 0, 2*Math.PI);
				ctx.fill();
				ctx.beginPath();
				ctx.arc(x, y, r, 0, 2*Math.PI);
				ctx.fill();
				ctx.beginPath();
				ctx.arc(x+size*0.25, y-size*0.25, r, 0, 2*Math.PI);
				ctx.fill();
				ctx.beginPath();
				ctx.arc(x-size*0.25, y-size*0.25, r, 0, 2*Math.PI);
				ctx.fill();
			break;
			case 6:
				ctx.beginPath();
				ctx.arc(x+size*0.25, y+size*0.25, r, 0, 2*Math.PI);
				ctx.fill();
				ctx.beginPath();
				ctx.arc(x-size*0.25, y+size*0.25, r, 0, 2*Math.PI);
				ctx.fill();
				ctx.beginPath();
				ctx.arc(x+size*0.25, y, r, 0, 2*Math.PI);
				ctx.fill();
				ctx.beginPath();
				ctx.arc(x-size*0.25, y, r, 0, 2*Math.PI);
				ctx.fill();
				ctx.beginPath();
				ctx.arc(x+size*0.25, y-size*0.25, r, 0, 2*Math.PI);
				ctx.fill();
				ctx.beginPath();
				ctx.arc(x-size*0.25, y-size*0.25, r, 0, 2*Math.PI);
				ctx.fill();
			break;
		}
	}
	
	function draw_star(size, color, x, y) {
		const r = size*0.43;
		
		ctx.beginPath();
		ctx.arc(x, y, size, -Math.PI*2*0.05, -Math.PI*2*0.05);
		ctx.arc(x, y, r, -Math.PI*2*0.15, -Math.PI*2*0.15);
		ctx.arc(x, y, size, -Math.PI*2*0.25, -Math.PI*2*0.25);
		ctx.arc(x, y, r, -Math.PI*2*0.35, -Math.PI*2*0.35);
		ctx.arc(x, y, size, -Math.PI*2*0.45, -Math.PI*2*0.45);
		ctx.arc(x, y, r, -Math.PI*2*0.55, -Math.PI*2*0.55);
		ctx.arc(x, y, size, -Math.PI*2*0.65, -Math.PI*2*0.65);
		ctx.arc(x, y, r, -Math.PI*2*0.75, -Math.PI*2*0.75);
		ctx.arc(x, y, size, -Math.PI*2*0.85, -Math.PI*2*0.85);
		ctx.arc(x, y, r, -Math.PI*2*0.95, -Math.PI*2*0.95);
		ctx.fillStyle = color;
		ctx.fill();
		
	}
	
	function animate(){
		requestAnimationFrame(animate);
		ctx.clearRect(0, 0, can.width, can.height);
		if(round != 100){
			board_countries_count = 0;
			ctx.font = "normal 10px Arial";
			ctx.fillStyle = "#FFF";
			ctx.fillText("██",40*timer*timer_step/timer_end, 10);
			ctx.fillText("|",54, 10);
			
			ctx.fillText("X: " + mouse.x, 2, 30);
			ctx.fillText("Y: " + mouse.y, 2, 40);
			ctx.fillText("wait: " + wait, 2, 60);
			ctx.fillText("round: " + round, 2, 70);
			
			ctx.fillText("take_card: " + take_card, 2, 210);
			ctx.fillText("e_a: " + end_attack, 2, 220);
			ctx.fillText("back_army: " + back_army, 2, 230);
			ctx.fillText("stage: " + stage, 2, 250);
			ctx.fillText("hover: " + hover, 2, 260);
			
			ctx.fillText("b.attack: " + battle.attack, 2, 280);
			ctx.fillText("b.defense: " + battle.defense, 2, 290);
			ctx.fillText("stars: " + player.stars, 2, 300);
			
			
			
			
			for(bridge of bridges){
				try{
					ctx.beginPath();
					ctx.moveTo(points[bridge[0]].x, points[bridge[0]].y);
					for(point of bridge) ctx.lineTo(points[point].x, points[point].y);
					ctx.strokeStyle = '#000';
					ctx.lineWidth = 2;
					ctx.stroke();
					ctx.closePath();
				}catch(er){
					console.log(bridge);
				}
			}
			
			for(country of countries){
				if(country.player == player.num) board_countries_count++;
				try{
					const name = country.name.value.split(' ');
					
					ctx.beginPath();
					ctx.moveTo(points[country.border[country.border.length-1]].x, 
					points[country.border[country.border.length-1]].y);
					for(point of country.border) ctx.lineTo(points[point].x, points[point].y);
					ctx.fillStyle = colors[country.continent];
					ctx.fill();
					ctx.font = "normal "+country.name.size+"px Arial";
					ctx.fillStyle = "#FFF";
					for(let h = 0; h < name.length; h++) 
						ctx.fillText(name[h], country.name.place.x, country.name.place.y + country.name.size*h);
					ctx.strokeStyle = '#000';
					ctx.lineWidth = 2;
					ctx.stroke();
					ctx.closePath();
					
					for(let h = 0; h < players.length; h++){
						ctx.fillStyle = players[h].color;
						if(country.player == h){
							let radius1 = 0;
							switch (country.army){
								case 1:
									draw_a(1, country, 0.3, 0, 0);
								break;
								case 2:
									draw_a(1, country, 0.3, 1.1, 0);
									draw_a(1, country, 0.3, -1.1, 0);
								break;
								case 3:
									draw_a(1, country, 0.28, 1.1, 0.635);
									draw_a(1, country, 0.28, -1.1, 0.635);
									draw_a(1, country, 0.28, 0, -1.27);
								break;
								case 4:
									draw_a(1, country, 0.25, 1.1, 1.1);
									draw_a(1, country, 0.25, -1.1, 1.1);
									draw_a(1, country, 0.25, 1.1, -1.1);
									draw_a(1, country, 0.25, -1.1, -1.1);
								break;
								case 5:
									draw_a(5, country, 0.4, 0, 0);
								break;
								case 6:
									draw_a(5, country, 0.3, -1, 0);
									draw_a(1, country, 0.28, 1.1, 0);
									
								break;
								case 7:
									draw_a(5, country, 0.3, -1, 0);
									draw_a(1, country, 0.25, 1.1, 1.1);
									draw_a(1, country, 0.25, 1.1, -1.1);
								break;
								case 8:
									draw_a(5, country, 0.3, 0, -0.7);
									draw_a(1, country, 0.25, 1.9, 0.6);
									draw_a(1, country, 0.25, 0, 1.4);
									draw_a(1, country, 0.25, -1.9, 0.6);
								break;
								case 9:
									draw_a(5, country, 0.3, 0, -0.7);
									draw_a(1, country, 0.25, 2.3, -0.2);
									draw_a(1, country, 0.25, 1.1, 1.4);
									draw_a(1, country, 0.25, -1.1, 1.4);
									draw_a(1, country, 0.25, -2.3, -0.2);
								break;
								case 10:
									draw_a(10, country, 0.5, 0, 0);
								break;
								case 11:
									draw_a(10, country, 0.45, -0.8, 0.1);
									draw_a(1, country, 0.2, 1.3, 0);
								break;
								case 12:
									draw_a(10, country, 0.45, -0.8, 0.1);
									draw_a(1, country, 0.2, 1.3, 1.1);
									draw_a(1, country, 0.2, 1.3, -1.1);
								break;
								case 13:
									draw_a(10, country, 0.45, 0, -0.5);
									draw_a(1, country, 0.2, 1.9, 0.8);
									draw_a(1, country, 0.2, 0, 1.6);
									draw_a(1, country, 0.2, -1.9, 0.8);
								break;
								case 14:
									draw_a(10, country, 0.45, 0, -0.5);
									draw_a(1, country, 0.2, 2.3, 0);
									draw_a(1, country, 0.2, 1.1, 1.6);
									draw_a(1, country, 0.2, -1.1, 1.6);
									draw_a(1, country, 0.2, -2.3, 0);
								break;
								case 15:
									draw_a(10, country, 0.4, -1, 0.1);
									draw_a(5, country, 0.3, 1.1, 0);
								break;
								case 16:
									draw_a(10, country, 0.35, -1, -0.5);
									draw_a(5, country, 0.25, 1.1, -1);
									draw_a(1, country, 0.15, 0, 1.5);
								break;
								case 17:
									draw_a(10, country, 0.35, -1, -0.5);
									draw_a(5, country, 0.25, 1.1, -1);
									draw_a(1, country, 0.15, -1.1, 1.5);
									draw_a(1, country, 0.15, 1.1, 1.5);
								break;
								case 18:
									draw_a(10, country, 0.35, -1, -0.5);
									draw_a(5, country, 0.25, 1.1, -1);
									draw_a(1, country, 0.15, 2.2, 1.5);
									draw_a(1, country, 0.15, 0, 1.5);
									draw_a(1, country, 0.15, -2.2, 1.5);
								break;
								case 19:
									draw_a(10, country, 0.35, -1, -0.5);
									draw_a(5, country, 0.25, 1.1, -1);
									draw_a(1, country, 0.15, 3.3, 1.5);
									draw_a(1, country, 0.15, -1.1, 1.5);
									draw_a(1, country, 0.15, 1.1, 1.5);
									draw_a(1, country, 0.15, -3.3, 1.5);
								break;
								case 20:
									draw_a(10, country, 0.4, 1, 0.1);
									draw_a(10, country, 0.4, -1, 0.1);
								break;
								case 21:
									draw_a(10, country, 0.35, -1, -0.5);
									draw_a(10, country, 0.35, 1, -0.5);
									draw_a(1, country, 0.15, 0, 1.5);
								break;
								case 22:
									draw_a(10, country, 0.35, -1, -0.5);
									draw_a(10, country, 0.35, 1, -0.5);
									draw_a(1, country, 0.15, -1.1, 1.5);
									draw_a(1, country, 0.15, 1.1, 1.5);
								break;
								case 23:
									draw_a(10, country, 0.35, -1, -0.5);
									draw_a(10, country, 0.35, 1, -0.5);
									draw_a(1, country, 0.15, 2.2, 1.5);
									draw_a(1, country, 0.15, 0, 1.5);
									draw_a(1, country, 0.15, -2.2, 1.5);
								break;
								case 24:
									draw_a(10, country, 0.35, -1, -0.5);
									draw_a(10, country, 0.35, 1, -0.5);
									draw_a(1, country, 0.15, 3.3, 1.5);
									draw_a(1, country, 0.15, -1.1, 1.5);
									draw_a(1, country, 0.15, 1.1, 1.5);
									draw_a(1, country, 0.15, -3.3, 1.5);
								break;
								case 25:
									draw_a(10, country, 0.42, 1, -0.1);
									draw_a(10, country, 0.42, -1, -0.1);
									draw_a(5, country, 0.3, 0, 1.8);
								break;
								case 26:
									draw_a(10, country, 0.4, 1, -0.4);
									draw_a(10, country, 0.4, -1, -0.4);
									draw_a(5, country, 0.25, -1.6, 1.6);
									draw_a(1, country, 0.15, 1.1, 1.7);
								break;
								case 27:
									draw_a(10, country, 0.4, 1, -0.4);
									draw_a(10, country, 0.4, -1, -0.4);
									draw_a(5, country, 0.25, -1.6, 1.6);
									draw_a(1, country, 0.15, 1.1, 1.7);
									draw_a(1, country, 0.15, 3.3, 1.7);
								break;
								case 28:
									draw_a(10, country, 0.4, 1, -0.4);
									draw_a(10, country, 0.4, -1, -0.4);
									draw_a(5, country, 0.25, -1.6, 1.6);
									draw_a(1, country, 0.15, 1.1, 1.7);
									draw_a(1, country, 0.15, 3.3, 1.7);
									draw_a(1, country, 0.15, 1.1, 3.9);
								break;
								case 29:
									draw_a(10, country, 0.4, 1, -0.4);
									draw_a(10, country, 0.4, -1, -0.4);
									draw_a(5, country, 0.25, -1.6, 1.6);
									draw_a(1, country, 0.15, 1.1, 1.7);
									draw_a(1, country, 0.15, 3.3, 1.7);
									draw_a(1, country, 0.15, 1.1, 3.9);
									draw_a(1, country, 0.15, 3.3, 3.9);
								break;
								case 30:
									draw_a(10, country, 0.35, -1, -0.5);
									draw_a(10, country, 0.35, 1, -0.5);
									draw_a(10, country, 0.35, 0, 1);
								break;
								case 40:
									draw_a(10, country, 0.45, -1, -0.5);
									draw_a(10, country, 0.45, 1, -0.5);
									draw_a(10, country, 0.45, 0, 1);
									draw_a(10, country, 0.5, 0, 0);
								break;
								case 50:
									draw_a(50, country, 0.7, 0, 0);
								break;
								default:
									if(country.army < 40){
										draw_a(10, country, 0.4, -1, -0.5);
										draw_a(10, country, 0.4, 1, -0.5);
										draw_a(10, country, 0.4, 0, 1);
										draw_a(1, country, 0.15, 0, -2.2);
										draw_a(1, country, 0.15, -2.4, 1.5);
										draw_a(1, country, 0.15, 2.4, 1.5);
									}
									else if(country.army < 50){
										draw_a(10, country, 0.45, -1, -0.5);
										draw_a(10, country, 0.45, 1, -0.5);
										draw_a(10, country, 0.45, 0, 1);
										draw_a(10, country, 0.5, 0, 0);
										draw_a(1, country, 0.15, 0, -4.4);
										draw_a(1, country, 0.15, -3.8, 2.7);
										draw_a(1, country, 0.15, 3.8, 2.7);
									}
									else if(country.army < 60){
										draw_a(50, country, 0.65, 0, 0);
										draw_a(1, country, 0.15, 0, -4.4);
										draw_a(1, country, 0.15, -3.8, 2.7);
										draw_a(1, country, 0.15, 3.8, 2.7);
									}
									else if(country.army < 70){
										draw_a(50, country, 0.7, 0, 0);
										draw_a(10, country, 0.3, 0, -1.9);
									}
									else if(country.army < 80){
										draw_a(50, country, 0.7, 0, 0);
										draw_a(10, country, 0.3, 1.5, 1.2);
										draw_a(10, country, 0.3, -1.5, 1.2);
									}
									else if(country.army < 90){
										draw_a(50, country, 0.7, 0, 0);
										draw_a(10, country, 0.3, 0, -1.9);
										draw_a(10, country, 0.3, 1.5, 1.2);
										draw_a(10, country, 0.3, -1.5, 1.2);
									}
									else if(country.army < 100){
										draw_a(50, country, 0.7, 0, 0);
										draw_a(10, country, 0.3, 0, -1.9);
										draw_a(10, country, 0.3, 1.5, 1.2);
										draw_a(10, country, 0.3, -1.5, 1.2);
										draw_a(10, country, 0.4, 0, 0);
									}
									else{
										draw_a(50, country, 0.7, 0, 0);
										draw_a(10, country, 0.7, 0, 0);
									}
								break;
							}
							ctx.beginPath();
							ctx.arc(country.center.x, country.center.y, country.radius, 0, 2 * Math.PI);
							ctx.strokeStyle = '#000';
							ctx.lineWidth = 1;
							ctx.stroke();
						}
					}
				}catch(er){
					console.log(country);
					console.log(er);
				}
			}
			
			if(hover || hover === 0){
				ctx.beginPath();
				ctx.moveTo(points[countries[hover].border[countries[hover].border.length-1]].x, 
				points[countries[hover].border[countries[hover].border.length-1]].y);
				for(point of countries[hover].border) ctx.lineTo(points[point].x, points[point].y);
				
				ctx.strokeStyle = '#000';
				ctx.lineWidth = 4;
				ctx.stroke();
				ctx.closePath();
			}
			
			if(players[round].army > 0){
				ctx.beginPath();
				ctx.rect(450, 0, 190, 40);
				ctx.fillStyle = '#66a';
				ctx.fill();
				ctx.strokeStyle = players[round].color;
				ctx.lineWidth = 3;
				ctx.stroke();
				
				ctx.font = "normal 16px Arial";
				ctx.fillStyle = "#FFF";
				if(round != player.num) ctx.fillText(players[round].login+" rozkłada wojsko", 455, 18);
				else ctx.fillText("Rozłóż wojsko", 455, 18);
				ctx.fillText("Zostało: "+players[round].army, 455, 35);
				
				ctx.closePath();
			}
			
			if(battle.attack || battle.attack === 0){
			//	console.log(battle.attack);
				ctx.beginPath();
				ctx.moveTo(points[countries[battle.attack].border[countries[battle.attack].border.length-1]].x, 
				points[countries[battle.attack].border[countries[battle.attack].border.length-1]].y);
				for(point of countries[battle.attack].border) ctx.lineTo(points[point].x, points[point].y);
				
				ctx.strokeStyle = '#000';
				ctx.lineWidth = 5;
				ctx.stroke();
				ctx.closePath();
				//info
				ctx.beginPath();
				ctx.rect(395, 0, 150, 60);
				ctx.fillStyle = '#66a';
				ctx.fill();
				ctx.strokeStyle = players[countries[battle.attack].player].color;
				ctx.lineWidth = 3;
				ctx.stroke();
				
				if(dice.attack.length > 0){
					if(dice.attack.length == 1) draw_cube(dice.attack[0], 25,'#000', 470, 22);
					else if(dice.attack.length == 2){
						draw_cube(dice.attack[0], 25,'#000', 440, 22);
						draw_cube(dice.attack[1], 25,'#000', 500, 22);
						
					}
					else if(dice.attack.length == 3){
						draw_cube(dice.attack[0], 25,'#000', 430, 22);
						draw_cube(dice.attack[1], 25,'#000', 470, 22);
						draw_cube(dice.attack[2], 25,'#000', 510, 22);
					}
				}
				else{
					ctx.fillStyle = "#FFF";
					
					const name = countries[battle.attack].name.value.split(' ');
					
					if(name.length == 1){
						ctx.font = "normal 18px Arial";
						ctx.fillText(name[0], 400, 22);
					}
					else if(name[0] == "Mada-"){
						ctx.font = "normal 18px Arial";
						ctx.fillText("Madagaskar", 400, 22);
					}
					else if(name.length == 2){
						ctx.font = "normal 16px Arial";
						ctx.fillText(name[0], 400, 18);
						ctx.fillText(name[1], 400, 36);
					}
					else if(name.length == 3){
						ctx.font = "normal 12px Arial";
						ctx.fillText(name[0], 400, 14);
						ctx.fillText(name[1], 400, 28);
						ctx.fillText(name[2], 400, 40);
					}
					
				}
				
				ctx.font = "normal 14px Arial";
				ctx.fillText(players[countries[battle.attack].player].login, 400, 55);
				ctx.fillText("Wojsko: "+countries[battle.attack].army, 465, 55);
				
				ctx.closePath();
				
				if(battle.defense || battle.defense === 0){
				//	console.log(battle.defense);
					ctx.beginPath();
					
					const connections = countries[battle.attack].connections[battle.defense];
					
					if(connections){
						ctx.moveTo(points[connections[0]].x, points[connections[0]].y);
						for(point of connections) ctx.lineTo(points[point].x, points[point].y);
					}
					else{
						for(con of valid){
							for(con1 of valid){
								const connections1 = countries[con].connections[con1];
								if(connections1){
									
									ctx.moveTo(points[connections1[0]].x, points[connections1[0]].y);
									for(point of connections1) ctx.lineTo(points[point].x, points[point].y);
									
								}
							}
						}
					}
					ctx.globalAlpha = 0.5;
					if(countries[battle.attack].player != countries[battle.defense].player)ctx.strokeStyle = '#f00';
					else ctx.strokeStyle = '#0f0';
					ctx.lineWidth = 10;
					ctx.stroke();
					ctx.globalAlpha = 1;
					ctx.lineWidth = 3;
					ctx.stroke();
					ctx.closePath();
					
					ctx.beginPath();
					ctx.rect(553, 0, 150, 60);
					ctx.fillStyle = '#66a';
					ctx.fill();
					ctx.strokeStyle = players[countries[battle.defense].player].color;
					ctx.lineWidth = 3;
					ctx.stroke();
					
					ctx.font = "normal 16px Arial";
					ctx.fillStyle = "#FFF";
					
					if(dice.attack.length > 0){
						if(dice.defense.length == 0) {
							if(countries[battle.defense].player == player.num){
								ctx.beginPath();
								ctx.fillStyle = '#333';
								ctx.lineWidth = 2;
								ctx.strokeStyle = '#000';
								ctx.rect(578, 13, 100, 25);
								ctx.fill();
								ctx.stroke();
								ctx.fillStyle = "#FFF";
								ctx.font = "normal 16px Arial";
								ctx.fillText("Rzuć", 605, 32);
							}
							else{
								
								ctx.font = "normal 16px Arial";
								ctx.fillText("rzut kośćmi", 590, 25);
							}
							
						}
						else{
							if(dice.defense.length == 1) draw_cube(dice.defense[0], 25,'#f00', 627, 22);
							else if(dice.defense.length == 2){
								draw_cube(dice.defense[0], 25,'#f00', 606, 22);
								draw_cube(dice.defense[1], 25,'#f00', 652, 22);
							}
						}
						
					}
					else{
					
						const name = countries[battle.defense].name.value.split(' ');
						if(name.length == 1){
							ctx.font = "normal 18px Arial";
							ctx.fillText(name[0], 560, 22);
						}
						else if(name[0] == "Mada-"){
							ctx.font = "normal 18px Arial";
							ctx.fillText("Madagaskar", 560, 22);
						}
						else if(name.length == 2){
							ctx.font = "normal 16px Arial";
							ctx.fillText(name[0], 560, 18);
							ctx.fillText(name[1], 560, 36);
						}
						else if(name.length == 3){
							ctx.font = "normal 12px Arial";
							ctx.fillText(name[0], 560, 14);
							ctx.fillText(name[1], 560, 28);
							ctx.fillText(name[2], 560, 40);
						}
					}
						
					ctx.font = "normal 14px Arial";
					ctx.fillText(players[countries[battle.defense].player].login, 557, 55);
					ctx.fillText("Wojsko: "+countries[battle.defense].army, 620, 55);
					
					
					//button
					if(round == player.num && countries[battle.attack].army > 1 && (dice.attack.length == 0 || dice.defense.length != 0)){
						
						if(countries[battle.attack].player != countries[battle.defense].player){
							ctx.beginPath();
							ctx.rect(710, 0, 100, 60);
							ctx.fillStyle = '#a66';
							ctx.fill();
							ctx.lineWidth = 3;
							ctx.strokeStyle = '#f00';
							ctx.stroke();
							ctx.font = "normal 16px Arial";
							ctx.fillStyle = "#FFF";
							ctx.fillText("Atak", 716, 18);
							
							ctx.beginPath();
							if(att_count == 1) ctx.rect(715, 25, 30, 30);
							if(att_count == 2) ctx.rect(715, 25, 60, 30);
							if(att_count == 3) ctx.rect(715, 25, 90, 30);
							ctx.fillStyle = '#333';
							ctx.fill();
							ctx.lineWidth = 2;
							ctx.strokeStyle = '#000';
							ctx.stroke();
							
							
							draw_cube(1, 20,'#f00', 730, 40);
							if(countries[battle.attack].army > 2) draw_cube(2, 20,'#f00', 760, 40);
							if(countries[battle.attack].army > 3) draw_cube(3, 20,'#f00', 790, 40);
							
							
							
						}
						else{
							ctx.beginPath();
							ctx.rect(710, 0, 100, 60);
							ctx.fillStyle = '#6a6';
							ctx.fill();
							ctx.lineWidth = 3;
							ctx.strokeStyle = '#0f0';
							ctx.stroke();
							
							
							
							
							if(back_army){
								if(stage == 5){
									ctx.beginPath();
									ctx.rect(715, 20, 90, 30);
									ctx.fillStyle = '#333';
									ctx.fill();
									ctx.lineWidth = 2;
									ctx.strokeStyle = '#000';
									ctx.stroke();
								}
								
								ctx.fillStyle = "#FFF";
								ctx.font = "normal 14px Arial";
								ctx.fillText("Wróć wojska", 720, 40);
							}
							else{
								
								if(stage == 5){
									ctx.beginPath();
									if(move_all_army) ctx.rect(715, 25, 90, 30);
									else ctx.rect(715, 25, 35, 30);
									ctx.fillStyle = '#333';
									ctx.fill();
									ctx.lineWidth = 2;
									ctx.strokeStyle = '#000';
									ctx.stroke();
								}
								
								ctx.fillStyle = "#FFF";
								ctx.font = "normal 13px Arial";
								ctx.fillText("Przenieś wojska", 712, 18);
								
								ctx.font = "normal 15px Arial";
								ctx.fillText("Ile?", 720, 45);
								ctx.font = "normal 10px Arial";
								ctx.fillText("Wszyskie", 759, 43);
							}
						}
					}
					
				}
			}
			
			if(round == player.num && battle.attack === false && battle.defense === false && player.army == 0){
				ctx.beginPath();
				ctx.rect(435, 0, 200, 50);
				if(stage == 6 || stage == 7) ctx.fillStyle = '#88c';
				else ctx.fillStyle = '#66a';
				ctx.fill();
				ctx.strokeStyle = '#222';
				ctx.lineWidth = 3;
				ctx.stroke();
				
				ctx.fillStyle = "#FFF";
				ctx.font = "normal 16px Arial";
				if(!take_board_countries && board_countries_count > 11){
					
					let army_add = 0;
					if(board_countries_count < 15) army_add = 1;
					else if(board_countries_count < 18) army_add = 2;
					else if(board_countries_count < 21) army_add = 3;
					else if(board_countries_count < 24) army_add = 4;
					else if(board_countries_count < 27) army_add = 5;
					else if(board_countries_count < 30) army_add = 6;
					else if(board_countries_count < 33) army_add = 7;
					else if(board_countries_count < 36) army_add = 8;
					else if(board_countries_count < 40) army_add = 9;
					else army_add = 10;
					
					ctx.fillText("Dobierz wojsko za pola: " + army_add, 446, 30);
				}
				else{
					if(take_card) ctx.fillText("Weź karte", 455, 30);
					else ctx.fillText("Następna kolejka", 455, 30);
				}
			}
			
			if(hover || hover === 0){
				
				//info
				ctx.beginPath();
				ctx.rect(mouse.x, mouse.y-70, 140, 70);
				ctx.fillStyle = '#034C8C';
				ctx.fill();
				ctx.strokeStyle = players[countries[hover].player].color;
				ctx.lineWidth = 3;
				ctx.stroke();
				
				ctx.font = "normal 16px Arial";
				ctx.fillStyle = "#FFF";
				
				const name = countries[hover].name.value.split(' ');
				for(let h = 0; h < name.length; h++) 
					ctx.fillText(name[h], mouse.x+5, mouse.y-55 + 18*h);
				
				ctx.font = "normal 14px Arial";
				ctx.fillText(players[countries[hover].player].login, mouse.x+5, mouse.y-5);
				ctx.fillText("Wojsko:"+countries[hover].army, mouse.x+70, mouse.y-5);
				
				ctx.closePath();
				
			}
			
			let c1 = '#333';
			let c2 = '#aaa';
			let c3 = '#333';
			let c4 = '#aaa';
			
			ctx.font = "normal 16px Arial";
			ctx.strokeStyle = '#222';
			ctx.lineWidth = 2;
			if(board_countries){
				c1 = '#555';
				c2 = "yellow";
				
				ctx.beginPath();
				ctx.rect(40, 540, 300, 25);
				ctx.fillStyle = '#555';
				ctx.fill();
				ctx.stroke();
				
				const army_countries = ['12-14', '15-17', '18-20', '21-23', '24-26', '27-29', '30-32','33-35', '36-39', '40-42'];
				for(let i = 0; i < 10; i++){
					ctx.beginPath();
					for(let h = 0; h < 2; h++){
						ctx.rect(40+30*i, 560+20*h, 30, 20);
					}
					if((i%2) == 0) ctx.fillStyle = '#333';
					else ctx.fillStyle = '#555';
					ctx.fill();
					ctx.stroke();
				}
				ctx.font = "normal 13px Arial";
				ctx.fillStyle = '#fff';
				for(let h = 0; h < 10; h++){
					if(h < 9) ctx.fillText(h+1, 51+30*h, 595, 30, 20);
					else ctx.fillText(h+1, 47+30*h, 595, 30, 20);
					
					ctx.font = "normal 10px Arial";
					ctx.fillText(army_countries[h], 42+30*h, 573, 30, 20);
					ctx.font = "normal 16px Arial";
				}
				
				ctx.font = "normal 15px Arial";
				ctx.fillText("Zajęte pola: " + board_countries_count, 43, 556);
			}
			else if(board_stars){
				c3 = '#555';
				c4 = "yellow";
				
				for(let i = 0; i < 6; i++){
					ctx.beginPath();
					ctx.rect(40+60*(i%3), 515, 60, 25);
					ctx.fillStyle = '#555';
					ctx.fill();
					ctx.stroke();
					
					ctx.beginPath();
					for(let h = 0; h < 3; h++)
						ctx.rect(40+30*i, 540+20*h, 30, 20);
					
					if((i%2) == 0) ctx.fillStyle = '#333';
					else ctx.fillStyle = '#555';
					ctx.fill();
					ctx.stroke();
				}
				
				for(let h = 0; h < 3; h++)draw_star(10, '#aaa', 55+60*h, 528);
				ctx.font = "normal 13px Arial";
				ctx.fillStyle = "#FFF";
				for(let h = 0; h < 3; h++) ctx.fillText("Woj", 74+60*h, 533);
				let count = 2;
				for(let h = 0; h < 3; h++){
					for(let i = 0; i < 3; i++){
						if(count <= player.stars) ctx.fillStyle = "yellow";
						if(count < 10) ctx.fillText(count, 51+60*h, 555+20*i, 30, 20);
						else ctx.fillText(10, 47+60*2, 555+20*2, 30, 20);
						if(count <= player.stars) ctx.fillStyle = "#FFF";
						
						if(count < 5) ctx.fillText(army_stars[count], 80+60*h, 555+20*i, 30, 20);
						else ctx.fillText(army_stars[count], 75+60*h, 555+20*i, 30, 20);
						count++;
					}
				}
				
			}
			ctx.beginPath();
			ctx.rect(0, 540, 40, 30);
			ctx.fillStyle = c1;
			ctx.fill();
			ctx.stroke();
			ctx.beginPath()
			ctx.fillStyle = c2;
			ctx.moveTo(20, 544);
			ctx.lineTo(8, 547);
			ctx.lineTo(10, 561);
			ctx.lineTo(27, 565);
			ctx.lineTo(31, 547);
			ctx.lineTo(18, 547);
			ctx.fill();
			
			ctx.beginPath();
			ctx.rect(0, 570, 40, 30);
			ctx.fillStyle = c3;
			ctx.fill();
			ctx.stroke();
			draw_star(13, c4, 20, 586);
		}else{
			ctx.beginPath();
			ctx.arc(can.width*0.1, can.height*0.7, can.width*0.02, 0.5*Math.PI, 1.5*Math.PI);
			ctx.arc(can.width*0.1 + can.width*0.8*timer*timer_step/timer_end, can.height*0.7, can.width*0.02, 1.5*Math.PI, 0.5*Math.PI);
			ctx.fillStyle = '#0f0';
			ctx.fill();
		}
	}
	animate();
}