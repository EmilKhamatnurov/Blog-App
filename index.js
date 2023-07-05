// DELETE AND CHANGE BUTTONS
const DELETE_BUTTON_LABEL = 'Удалить пост';
const CLASSNAME_OF_DELETE_BUTTON = 'post-delete-button';
const CLASSNAME_OF_CHANGE_BUTTON = 'change-popup-btn';
const CHANGE_BUTTON_LABEL = 'Изменить';
const CHANGED_POST_LABEL = ' (Изменено)';
// Строки для счетчиков
const TITLE_MAX_COUNTER_LABEL = `100`;
const TEXT_MAX_COUNTER_LABEL = `200`;
// Ссылки на элементы страницы
const postTitleInputNode = document.querySelector('.js-post-title-input');
const postTextInputNode = document.querySelector('.js-post-text-input');
const newPostBtnNode = document.querySelector('.js-new-post-btn');
const postsNode = document.querySelector('.js-posts');
const errorOutputNode = document.querySelector('.js-error-output')
const titleSignInputCounter = document.querySelector('.js-title-input-counter');
const textSignInputCounter = document.querySelector('.js-text-input-counter');
const sortOptionInputNode = document.querySelector('.js-sort-select');

// Список постов
const posts = [];
// Переменная, которая хранит индекс изменяющегося поста
let changingPostId;

init()

// Функция инициализации приложения
function init() {
	changingPostId = -1;
	clearPostInputs();
	titleCounterLabel();
}

function titleCounterLabel() {
	titleSignInputCounter.innerText = `${postTitleInputNode.value.length} / ${TITLE_MAX_COUNTER_LABEL}`;
}
function textCounterLabel() {
	textSignInputCounter.innerText = `${postTextInputNode.value.length} / ${TEXT_MAX_COUNTER_LABEL}`;
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

// Функция получения текущей даты и времени
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
	const posts = getPost();
	let postsMarkup = '';
	// Создание разметки постов с данными из массива posts
	for (let index = 0; index < posts.length; index++) {
		postsMarkup += ` 
			<div class = "post" id = "${index}"> 
				<p class = "post__time">${posts[index].date}</p>
				<p class = "post__title">${posts[index].title}</p>
				<p class = "post__text">${posts[index].text}</p>
			</div>
		`;	
	
	}
	(posts.length == 0) ? 
		postsNode.innerHTML = 'Лента пуста...' : 
		postsNode.innerHTML = postsMarkup;
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

// Очистка полей ввода и установка начального значения счетчикам символов
function clearPostInputs() {
	postTitleInputNode.value = "";
	postTextInputNode.value = "";
	titleCounterLabel();
	textCounterLabel();
}

// _____ Функция удаление поста _____
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

// _____ Функция изменение поста _____
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

// Сортировка по дате и по заголовку
function byField(field) {
// Сортировка по дате: позже -- пост выше
	if (field === "date") {
		return (a, b) => a[field] < b[field] ? 1 : -1;
	}
// Сортировка по заголовку (по алфавиту)
if (field === "title") {
	return (a, b) => a[field].localeCompare(b[field]); // сортировка по алфавиту 
  }
}
  
// Проверка данных в полях ввода
function checkInputsData(postFromUser) {
	const postTitle = postFromUser.title.replace(/\s/g, '');
	const postText = postFromUser.text.replace(/\s/g, '');

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
postTitleInputNode.addEventListener('input',titleCounterLabel);

// Работа счетчика символов поля ввода описания поста
postTextInputNode.addEventListener('input',textCounterLabel);
