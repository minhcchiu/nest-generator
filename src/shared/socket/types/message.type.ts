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
