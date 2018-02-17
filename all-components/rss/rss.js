var $pagination = $('#pagination'),
    $feeds = $("#rss-feeds"),
    $new = $("#one-new"),//подвязать под контейнер
    defaultSize = 10,
    count = 1,
    first = 1,
    last = 10;

$.getJSON('http://moneymaker.tools:8080/newscount', function (data) {
    var html = "";
    var pageCount = Math.ceil(data.newscount / defaultSize);

    for (var i = 1; i <= pageCount; i++) {
        if(i < 11){ 
            html += '<li class="num"><a href="" data-num="' + i + '">' + i + '</a></li>'; 
        }
    }

    if(pageCount >= 11){
        $pagination.html('<ul><li class="prev hidden"><a href="" id="prev"><<</a></li>' + html + '<li class="next"><a href="" id="next">>></a></li></ul>');
    }

    $pagination.find('li.num').first().addClass('active first');
    $pagination.find('li.num').last().addClass('last');


    $pagination.find('li.num a').on('click', function () {
        
        count = Number($(this).data('num'));
        $pagination.find('li').removeClass('active');
        $(this).parent().addClass('active');
        getNews($(this).data('num'), defaultSize, $feeds);
        
        return false;
    });

    $pagination.find('a#prev').on('click', function () {

        count--;
        if(count <= first && first > 1){
            first--;
            last--;
            $pagination.find('li.num').each(function (e) {
                $(this).find('a').html(Number($(this).find('a').html()) - 1);
                $(this).find('a').data('num', Number($(this).find('a').data('num') - 1));
            });
            getNews($pagination.find('li.active a').data('num'), defaultSize, $feeds);
        }else{
            if(!$pagination.find('li').eq(1).hasClass('active')){
                $pagination.find('li.active').removeClass('active').prev().addClass('active');
                getNews($pagination.find('li.active a').data('num'), defaultSize, $feeds);
            }
        }
        checkNavs(pageCount);
        
        
        return false;
    });

    $pagination.find('a#next').on('click', function () {

        count++;
        if(count > last && pageCount > count){
            first++;
            last++;
            $pagination.find('li.num').each(function (e) {
                $(this).find('a').html(Number($(this).find('a').html()) + 1);
                $(this).find('a').data('num', Number($(this).find('a').data('num') + 1));
            });
            getNews($pagination.find('li.active a').data('num'), defaultSize, $feeds);
        }else{
            if(!$pagination.find('li').eq($pagination.find('li').length - 2).hasClass('active')){
                $pagination.find('li.active').removeClass('active').next().addClass('active');
            }
            getNews($pagination.find('li.active a').data('num'), defaultSize, $feeds);
        }
        checkNavs(pageCount);
        
        return false;
    });

});

var checkNavs = function (num) {

    if(Number($pagination.find('li.num').eq(0).find('a').data('num')) === 1){
        $pagination.find('li').eq(0).addClass('hidden');
    }else{
        $pagination.find('li').eq(0).removeClass('hidden');
    }


    if(Number($pagination.find('li.num').eq($pagination.find('li.num').length - 1).find('a').data('num')) === num){
        $pagination.find('li').eq($pagination.find('li').length - 1).addClass('hidden');
    }else{
        $pagination.find('li').eq($pagination.find('li').length - 1).removeClass('hidden');
    }

}

var getNews = function (pageNum, pageSize, domContainer) {
    $.getJSON('http://moneymaker.tools:8080/getnews?pageNumber=' + pageNum + '&pageSize=' + pageSize + '', function (data) {
        var htmlTemplate = '';
        for (var i = 0; i < data.length; i++) {
            var json = data[i];
            var picture = json.picture ? '<div class="rss__enclosure"><img src="' + (json.picture) + '" alt="' + (json.pictureType) + '"></div>' : '';
            var date = moment.parseZone(json.isoDate).locale("ru").format('MMM D').split(" ");
            if (json.description) {
                htmlTemplate += '' +
                    '<div class="container">' +
                        '<div class="rss">' +
                            '<div class="rss__container">' +
                                '<div class="rss__date">' +
                                    '<div class="rss__l">' + date[0] + '<span>' + date[1] + '</span></div>' +
                                '</div>' +
                                '<div class="rss__cont">' +
                                    '<div class="rss__wrap">' +
                                        '<div class="rss__title">' +
                                            '<h1>' + (json.title) + '</h1>' +
                                        '</div>' +
                                        '<div class="rss__isoDate">' + moment.parseZone(json.isoDate).locale("ru").format('h:mm MMMM D YYYY') + '</div>' +
                                        picture +
                                        '<div class="rss__content">' +
                                            '<p>' + (json.description) + '</p>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
            }
        }
        domContainer.html(htmlTemplate);

        $('.rss__wrap').readmore({
            speed: 250,
            collapsedHeight: 305,
            moreLink: '<a href="#">Читать далее</a>',
            lessLink: '<a href="#">Скрыть</a>'
        });
    });
};

var socket = io('http://moneymaker.tools:8080');

socket.on('news', function(data) {
    if (data.description) {
    var picture = data.picture ? '<div class="rss__enclosure"><img src="' + (data.picture) + '" alt="' + (data.pictureType) + '"></div>' : '';
    var date = moment.parseZone(data.isoDate).locale("ru").format('MMM D').split(" ");
    var htmlTemplate = '' +
        '<div class="container">' +
        '<div class="rss">' +
        '<div class="rss__container">' +
        '<div class="rss__date">' +
        '<div class="rss__l">' + date[0] + '<span>' + date[1] + '</span></div>' +
        '</div>' +
        '<div class="rss__cont">' +
        '<div class="rss__wrap">' +
        '<div class="rss__title">' +
        '<h1>' + (data.title) + '</h1>' +
        '</div>' +
        '<div class="rss__isoDate">' + moment.parseZone(data.isoDate).locale("ru").format('h:mm MMMM D YYYY') + '</div>' +
        picture +
        '<div class="rss__content">' +
        '<p>' + (data.description) + '</p>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    }
    

    $new.animate({
        opacity: 0
    }, 300, function() {
        $new.html(htmlTemplate);
        $new.find('.rss__wrap').readmore({
            speed: 250,
            collapsedHeight: 305,
            moreLink: '<a href="#">Читать далее</a>',
            lessLink: '<a href="#">Скрыть</a>'
        });
        $new.animate({
            opacity: 1
        }, 300);
    });


});

getNews(1, defaultSize, $feeds);
getNews(1, 1, $new);