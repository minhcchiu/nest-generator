export type Message = {
	sender: {
		_id: string;
		fullName: string;
		avatar: string;
	};
	readBy: string[];
	chat: {
		_id: string;
		members: {
			user: {
				_id: string;
				fullName: string;
				avatar: string;
			};
			nickName: string;
		}[];
	};
	text: string;
	image: string[];
	audio: string;
	isDeleted: boolean;
};

// const data = {
// 	"sender": {
// 		"_id": "645548ee732c55aa88d2bed4",
// 		"fullName": "A",
// 		"avatar": "Avatar A"
// 	},
// 	"readBy": ["645548ee732c55aa88d2bed4"],
// 	"chat": {
// 		"_id": "64abbb45d4c399c2034888ee",
// 		"members": [
// 			{
// 				"user": {
// 					"_id": "645548ee732c55aa88d2bed4",
// 					"fullName": "A",
// 					"avatar": "Avatar A",
// 				},
// 				"nickName": "A"
// 			},
// 			{
// 				"user": {
// 					"_id": "64500a3c9a7f110a09cba257",
// 					"fullName": "B",
// 					"avatar": "Avatar B",
// 				},
// 				"nickName": "B"
// 			}
// 		],
// 		"text": " string",
// 		"image": ["image"],
// 		"audio": "audio",
// 		"isDeleted": false
// 	},
// };
