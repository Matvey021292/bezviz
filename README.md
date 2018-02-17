Стартовый шаблон v 1.0.1

Установка: 
    необходимые компоненты {
        node.js,
        gulp
    }

    Установить node.js последней версии (если есть, не нужно)

    Установить Gulp глобально (если есть, не нужно) {
        npm install -g gulp
    }

    Установить Gulp локально {
        Открить терминал в папке проекта и выполнить команду:
            npm install gulp 
    }

    Установка компонентов {
        Открить терминал в папке проекта и выполнить команду
            npm install
    }

Использование:
    - Основа шаблона компонентная методология разработки, каждый section , footer, header. виджет есть независимым компонентом.
    - Вся разроботка происходит в src/... директории, на выходе получаем готовый проект в директории build/...
    - Готовые компоненты находятся в корне, папка all-components (при надобности переносим нужный компонент в src/components/)
    - Все компоненты создаются в src/components/component-name/...
    - Нужные файли:
        1. component-name.html;
        2. component-name.sass;
        3. component-name.js(по необходимости);
        4. component-name_items.html(по необходимости);
    -HTML:
        - подключение компонентов в index.html
        - синтаксис подклюения компонента (пример): ```@@include('components/component-name/component-name.html)```;
        - метод ```@@loop``` (используем если есть несколько идентичных по html структуре блоков ):
            1.Синтаксис (пример):
                - в в component-name.html:
                    ```<ul>
                        @@loop('component-name_items.html', [
                        {
                            "title": "hello"
                        },
                        {
                            "title": "Hi"
                        },
                        {
                            "title": "Loop"
                        }
                        ])
                    </ul>```
                - в component-name_items.html: 
                   ``` <li class="list-item">
                        @@title
                    </li>```
    

    -CSS (препроцесор SASS):
        - общие стили src/sass/style.sass;
        - _var.sass для общих переменных;
        - стили компонентов подключаем в src/sass/_component.sass;
        - подключение (пример): @import '../components/component-name/component-name';
        - подключение стилей библиотек в src/sass/_libs.sass

    -JS:
        - общие скрипты src/js/common.js;
        - скрипты компонентов подключаем в src/js/component.js;
        - подключение (пример): @import './src/components/component-name/component-name.js'
        - подключение скриптов библиотек в src/js/libs/libs.min.js)

Naming:
    - компоненты называем по БЭМу block__element--modifier. Например, есть секция комментариев, которая будет называться section__comments. Если есть отдельная секция комментариев на русском языке, то называем section__comments--rus.

Screenshots:
    - в папке каждого компонента создаем его скриншот, чтобы можно было видеть конечный результат работы.

Минификация:
    минификация скриптов и стилей после завершение проекта осуществляется командой 'gulp min'