import { TokenPayload } from "~modules/pre-built/5-tokens/interface";
import { DocumentType } from "~types/document.type";
import { User } from "../schemas/user.schema";

export const authSelect = {
	_id: 1,
	roles: 1,
	userGroupIds: 1,
	accountType: 1,
	fullName: 1,
	username: 1,
	email: 1,
	phone: 1,
	socialID: 1,
};

export const getTokenPayloadFromUser = (
	user: DocumentType<User>,
): TokenPayload => {
	return {
		_id: user._id.toString(),
		roles: user.roles,
		userGroupIds: user.userGroupIds.map((id) => id.toString()),
		fullName: user.fullName,
		username: user.username,
		email: user.email,
		phone: user.phone,
		socialID: user.socialID,
		accountType: user.accountType,
	};
};

export const getUserAuth = (user: DocumentType<User>) => {
	return {
		_id: user._id.toString(),
		roles: user.roles,
		userGroupIds: user.userGroupIds.map((id) => id.toString()),
		fullName: user.fullName,
		username: user.username,
		email: user.email,
		phone: user.phone,
		socialID: user.socialID,
		accountType: user.accountType,
	};
};
