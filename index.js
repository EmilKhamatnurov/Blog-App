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

// Функция добавления поста
function addPost() {
	const postFromUser = getPostFromUser(); 
	// Проверили содержимое полей ввода
	if (!checkInputsData(postFromUser)) {
		return
	} 
	addPostToMassive(postFromUser);
	renderError();
	clearPostInputs();
	sortPostsByField(sortOptionInputNode.value);
};

// Функция изменения поста
function changePost() {
	const changedPost = getChangedPost(changingPostId);
	if (!checkInputsData(changedPost)) {
		return
	} 
	insertChangedPost(changingPostId, changedPost);
	renderError();
	togglePopup();
	resetChangingPostIndex();
	sortPostsByField(sortOptionInputNode.value);
}

// Получение данных из полей ввода
function isEmptyInput() {
	const movieFromUser = getMovieFromUser();
	const movieLengthWithoutSpaces = movieFromUser['movieName'].trim().length;
	if (movieLengthWithoutSpaces === 0) {
		return true;
	}
}

// Получение поста из полей ввода
function getPostFromUser() {
	const title = postTitleInputNode.value;
	const text = postTextInputNode.value;
	const date = setPostDate()
	return {
		date: date,
		title: title,
		text: text
	};
};

// Получение измененного поста из полей ввода
function getChangedPostFromUser() {
	const changedTitle = changePostTitleInput.value;
	const changedText = changePostTextInput.value;
	const changedDate = setPostDate() + CHANGED_POST_LABEL;
	return {
		date: changedDate,
		title: changedTitle,
		text: changedText
	};
}

//функция получения текущей даты и времени
function setPostDate() {
	const date = new Date();
	
	return date.toLocaleString('ru-RU', {
		day: 'numeric', 
		month: 'numeric', 
		year: 'numeric'}) + 
		' ' + 
		date.toLocaleString('ru-RU', {
		hour: 'numeric', 
		minute: 'numeric', 
		second: 'numeric'});
}

// Добавления поста в список объектов постов
function addPostToMassive({date, title, text}) {
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
	let postsMarkup = '';
	// Добавление постов
	for (let index = 0; index < posts.length; index++) {
		postsMarkup += ` 
			<div class = "post" id = "${index}"> 
				<p class = "post__time">${posts[index].date}</p>
				<p class = "post__title">${posts[index].title}</p>
				<p class = "post__text">${posts[index].text}</p>
			</div>
		`;	
	
	}
	(posts.length == 0) ? postsNode.innerHTML = 'Лента пуста...' : postsNode.innerHTML = postsMarkup;
	//Добавление кнопок для постов
	renderPostButtons(posts);
}
// Функция создания и добавления кнопок удаления и изменения
function renderPostButtons(posts) {
	//Для всех постов создаются и добавляются кнопки с отработчиками событий 
	for (let index = 0; index < posts.length; index++) {
		post_container = document.getElementById(`${index}`);
		const deleteBtn = createDeleteBtn();
		const changeBtn = createChangeBtn(index);

		// Добавления отработчиков событий для кнопок
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
// Очистка полей ввода
function clearPostInputs() {
	postTitleInputNode.value = "";
	postTextInputNode.value = "";
	titleSignInputCounter.innerText = TITLE_COUNTER_LABEL;
	textSignInputCounter.innerText = TEXT_COUNTER_LABEL;
}

// _____ Удаление поста _____
// Создание кнопки удаления
function createDeleteBtn() {
	const newDeleteBtn = document.createElement('button');
	newDeleteBtn.classList.add(CLASSNAME_OF_DELETE_BUTTON)
	newDeleteBtn.innerText = DELETE_BUTTON_LABEL;
	return newDeleteBtn;
}

// Удаление поста по id
function deletePost(id) {
	posts.splice(id,1);
	sortPostsByField(sortOptionInputNode.value);
}

// _____ Изменение поста _____
//  Функция создания кнопки изменения поста
function createChangeBtn(post_id) {
	const newChangeBtn = document.createElement('button');
	newChangeBtn.classList.add(CLASSNAME_OF_CHANGE_BUTTON)
	newChangeBtn.innerText = CHANGE_BUTTON_LABEL;
	newChangeBtn.dataset.post = post_id;
	return newChangeBtn;
}

// Сброс индекса поста, который изменяют
function resetChangingPostIndex() {
	changingPostId = -1;
}

// Функция вставки содержимого поста в поля ввода PopUp-окна 
function insertPostContent(post_id) {
	const posts = getPost();
	changePostTitleInput.value = posts[post_id].title;
	changePostTextInput.value = posts[post_id].text;
}

// Функция получения измененого проста из полей ввода в PopUp-окне
function getChangedPost() {
	const newPostFromUser = getChangedPostFromUser();
	return newPostFromUser;
}

// Функция вставки измененного поста в список постов
function insertChangedPost(post_id, changedPost) {
	const posts = getPost();
	posts[post_id].title = changedPost.title;
	posts[post_id].text = changedPost.text;
	posts[post_id].date = posts[post_id].date + CHANGED_POST_LABEL;
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
	if (field === "date") {
		return (a, b) => a[field] < b[field] ? 1 : -1;
	}
// Сортировка по заголовку (по алфавиту), учитывается код символа
	if (field == "title") {
		return (a, b) => a[field] > b[field] ? 1 : -1;
	}
}
  
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

// _____ Отработчики событий _____
/* Отпработчики событий для кнопок удаления и 
изменения поста находятся в функции "renderPostButtons"*/

// Отработка кнопки "Опубликовать"
newPostBtnNode.addEventListener('click', addPost);

// Отработчик кнопки "Изменить" в окне PopUp
changePostButton.addEventListener('click', changePost);

// Отработка функции сортировки списка постов
sortOptionInputNode.addEventListener('change', function () {
	sortPostsByField(sortOptionInputNode.value);
	renderPosts();
});

// Работа счетчика символов поля ввода заголовка поста
postTitleInputNode.addEventListener('input', (event) => {
	titleSignInputCounter.innerText = `${event.target.value.length}/100`; // счетчик символов поля ввода
});

// Работа счетчика символов поля ввода описания поста
postTextInputNode.addEventListener('input', (event) => {
	textSignInputCounter.innerText = `${event.target.value.length}/200`; // счетчик символов поля ввода
});
