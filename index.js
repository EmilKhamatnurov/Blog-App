// DELETE AND CHANGE BUTTONS
const DELETE_BUTTON_LABEL = 'Удалить пост';
const CLASSNAME_OF_DELETE_BUTTON = 'post-delete-button';
const CLASSNAME_OF_CHANGE_BUTTON = 'change-popup-btn';
const CHANGE_BUTTON_LABEL = 'Изменить';
const CHANGED_POST_LABEL = ' (Изменено)';
// Строки для счетчиков
const TITLE_COUNTER_LABEL = `0/100`;
const TEXT_COUNTER_LABEL = `0/200`;
// Ссылки на элементы страницы
const postTitleInputNode = document.querySelector('.js-post-title-input');
const postTextInputNode = document.querySelector('.js-post-text-input');
const newPostBtnNode = document.querySelector('.js-new-post-btn');
const postsNode = document.querySelector('.js-posts');
const errorOutputNode = document.querySelector('.js-error-output')
const titleSignInputCounter = document.querySelector('.js-title-input-counter');
const textSignInputCounter = document.querySelector('.js-text-input-counter');
const sortOptionInputNode = document.querySelector('#sort-select');

// Список постов
const posts = [];
// Переменная, которая хранит индекс изменяющегося поста
let changingPostId;
init()

// Функция инициализации приложения
function init() {
	changingPostId = -1;
	clearPostInputs();
}
// Отработка кнопки "Опубликовать"
newPostBtnNode.addEventListener('click', function () {
	const postFromUser = getPostFromUser(); 
	// Проверили содержимое полей ввода
	if (!checkInputsData(postFromUser)) {
		return
	} 
	addPost(postFromUser);
	renderError();
	clearPostInputs();
	sortPostsByField(sortOptionInputNode.value);
});
// Отработчик кнопки изменить пост
changePostButton.addEventListener('click', function () {
	const changedPost = getChangedPost(changingPostId);
	if (!checkInputsData(changedPost)) {
		return
	} 
	insertNewPost(changingPostId, changedPost);
	renderError();
	togglePopup();
	resetChangingPostIndex();
	sortPostsByField(sortOptionInputNode.value);
});

sortOptionInputNode.addEventListener('change', function () {
	sortPostsByField(sortOptionInputNode.value);
	renderPosts();
});

postTitleInputNode.addEventListener('input', (event) => {
	titleSignInputCounter.innerText = `${event.target.value.length}/100`; // счетчик символов поля ввода
})
postTextInputNode.addEventListener('input', (event) => {
	textSignInputCounter.innerText = `${event.target.value.length}/200`; // счетчик символов поля ввода
})


// _____ FUNCTIONS _____
// Получение данных из полей ввода
function isEmptyInput() {
	const movieFromUser = getMovieFromUser();
	const movieLengthWithoutSpaces = movieFromUser['movieName'].trim().length;
	if (movieLengthWithoutSpaces === 0) {
		return true;
	}
}
function getPostFromUser() {
	const title = postTitleInputNode.value;
	const text = postTextInputNode.value;
	const date = setPostDate()
	return {
		date: date,
		title: title,
		text: text
	};
}

function getChangedPostFromUser() {
	const title = changePostTitleInput.value;
	const text = changePostTextInput.value;
	const date = setPostDate() + CHANGED_POST_LABEL;
	return {
		date: date,
		title: title,
		text: text
	};
}
// Генерации даты поста  1000 и 1 способ :(
function setPostDate() {
	const dateFormat = new Date();

	const dd = fixDateFormat(dateFormat.getDate()); // день
	const mm = fixDateFormat(dateFormat.getMonth()); // месяц
	const yyyy = fixDateFormat(dateFormat.getFullYear()); // год
	const hours = fixDateFormat(dateFormat.getHours()); //часы
	const minutes = fixDateFormat(dateFormat.getMinutes()); // минуты
	const seconds = fixDateFormat(dateFormat.getSeconds()); // секунды

	//Подставляем значения дня, недели и месяца и возвращаем дату в нужном формате
	const date = `${dd}.${mm}.${yyyy} ${hours}:${minutes}:${seconds}`;
	return date;
}

function fixDateFormat(date) {
	const stringDate = date.toString();
	if (stringDate.length == 1) {
		return `0${date}`
 	} 
	else {
		return `${date}`
	}
}
// Добавления поста в список объектов постов
function addPost({date, title, text}) {
	posts.push({
		date,
		title,
		text
	});
}
// Функция получения содержимого поста
function getPost() {
	return posts;
}
// Отображение постов на странице
function renderPosts() {
	// Генерация поста
	const posts = getPost();
	// const lastPostIndex = posts.length -1;
	let postsHTML = '';
	// Добавление постов
	for (let index = 0; index < posts.length; index++) {
		postsHTML += ` 
			<div class = "post" id = "${index}"> 
				<p class = "post__time">${posts[index].date.slice(0, 16)}</p>
				<p class = "post__title">${posts[index].title}</p>
				<p class = "post__text">${posts[index].text}</p>
			</div>
		`;	
	
	}
	(posts.length == 0) ? postsNode.innerHTML = 'Лента пуста...' : postsNode.innerHTML = postsHTML;
	//Добавление кнопок для постов
	renderPostButtons(posts);
		
}
function renderPostButtons(posts) {
	for (let index = 0; index < posts.length; index++) {
		post_container = document.getElementById(`${index}`);
		const deleteBtn = createDeleteBtn();
		const changeBtn = createChangeBtn(index);

		deleteBtn.addEventListener('click', function () {
			deletePost(index);
		});

		changeBtn.addEventListener('click', function () {
			togglePopup();
			changingPostId = this.dataset.post;
			insertPostContent(this.dataset.post);
		});

		post_container.appendChild(deleteBtn);
		post_container.appendChild(changeBtn);
	}
}

function clearPostInputs() {
	postTitleInputNode.value = "";
	postTextInputNode.value = "";
	titleSignInputCounter.innerText = TITLE_COUNTER_LABEL;
	textSignInputCounter.innerText = TEXT_COUNTER_LABEL;
}
// ФУНКЦИЯ УДАЛЕНИЯ ПОСТОВ
// Создание кнопки удаления
function createDeleteBtn() {
	const deleteBtn = document.createElement('button');
	deleteBtn.classList.add(CLASSNAME_OF_DELETE_BUTTON)
	deleteBtn.innerText = DELETE_BUTTON_LABEL;
	return deleteBtn;
}
// Удаление поста по id
function deletePost(id) {
	posts.splice(id,1);
	sortPostsByField(sortOptionInputNode.value);
}

// ФУНКЦИЯ ИЗМЕНЕНИЯ СОДЕРЖИМОГО ПОСТОВ
function createChangeBtn(post_id) {
	const changeBtn = document.createElement('button');
	changeBtn.classList.add(CLASSNAME_OF_CHANGE_BUTTON)
	changeBtn.innerText = CHANGE_BUTTON_LABEL;
	changeBtn.dataset.post = post_id;
	return changeBtn;
}
// Сброс индекса поста, который изменяют
function resetChangingPostIndex() {
	changingPostId = -1;
}

function insertPostContent(post_id) {
	const posts = getPost();
	changePostTitleInput.value = posts[post_id].title;
	changePostTextInput.value = posts[post_id].text;
}
function getChangedPost() {
	const newPostFromUser = getChangedPostFromUser();
	return newPostFromUser;
}
function insertNewPost(post_id, changerPost) {
	const posts = getPost();
	posts[post_id].title = changerPost.title;
	posts[post_id].text = changerPost.text;
	posts[post_id].date = changerPost.date;
}
// Сортировка списка
function sortPostsByField(field) {
	const posts = getPost();
	posts.sort(byField(field));
	renderPosts();
}
// Сортировка по дате или по заголовку
function byField(field) {
// Сортировка по дате: позже -- пост выше
// Сортировка по заголовку (по алфавиту), учитывается код символа
	if (field === "date") {
		return (a, b) => a[field] < b[field] ? 1 : -1;
	}
	if (field == "title") {
		return (a, b) => a[field] > b[field] ? 1 : -1;
	}
}
  
// ПРОВЕРКИ
// Проверка данных в полях ввода
function checkInputsData(postFromUser) {
	const postTitle = postFromUser.title.replace(/^\s+|\s+$/g, '');
	const postText = postFromUser.text.replace(/^\s+|\s+$/g, '');

	if(!postTitle || !postText) {
		renderError("emptyInputError", 0);
		return false
	}
	if (postTitle.length > 100) {
		renderError("titleLenghtError", postTitle.length);
		return false
	}
	if (postText.length > 200) {
		renderError("textLenghtError", postText.length);
		return false
	}
	return true;
}

// Рендер ошибок 
function renderError(typeError, inputLength) {
	switch (typeError) {
		case "emptyInputError":
			errorOutputNode.innerText = "Пустое поле";
			break;
		case "titleLenghtError":
			errorOutputNode.innerText =  `Заголовок больше на ${inputLength - 100} симв.`;
			break;
		case "textLenghtError":
			errorOutputNode.innerText =  `Пост больше на ${inputLength - 200} симв.`;
			break;
		default:
			errorOutputNode.innerText = '';
	}
}
