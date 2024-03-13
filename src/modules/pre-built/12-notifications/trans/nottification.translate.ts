export const notificationTranslate = {
	post: {
		content: {
			vi: "Đã đăng bài viết",
			en: "Post has been created",
		},
	},
	comment: {
		content: (sentName: string) => ({
			vi: `${sentName} đã bình luận bài viết`,
			en: `${sentName} has not commented on the post`,
		}),
	},
};
