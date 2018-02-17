    Vue.component('components-list', {
        props: ["component", "addfn", "openfn"],
        template: `<div class="constructor__item" move-class="flip-list-move">
                        <div class="constructor__margin">
                            <div class="constructor__name">
                                <span v-bind:data-name="component.name">{{component.name}}</span>
                                <div class="constructor__add" v-on:click="addfn(component)"><div>+</div></div>
                            </div>
                            <div class="constructor__img" v-on:click="openfn(component.img)">
                                <img v-bind:src="component.img" alt="" >
                            </div> 
                        </div>
                    </div>`
    });

    Vue.component('choosen-components-list', {
        props: ["component", "removefn", "addfn", "index", "openfn"],
        template: `<div class="constructor__item constructor__class">
                        <div class="constructor__margin">
                            <div class="constructor__name">
                                <span v-bind:data-name="component.name">{{component.name}}</span>
                                <div class="constructor__add" v-on:click="removefn(component, index)"><div>-</div></div>
                            </div>
                        </div>
                    </div>`
    });

    Vue.component('templates-list', {
        props: ["template", "addfn", "index", "openfn"],
        template: `<div class="constructor__item constructor__class">
                        <div class="constructor__margin">
                            <div class="constructor__name">
                                <span v-bind:data-name="index">{{index}}</span>
                                <div class="constructor__add" v-on:click="addfn(template.components)"><div>+</div></div>
                            </div>
                            <div class="constructor__img" v-on:click="openfn(template.screenshot)">
                                <img v-bind:src="template.screenshot" alt="" >
                            </div> 
                        </div>
                    </div>`
    });

    new Vue({
        el: "#app",
        data: {
            components: null,
            templates: null,
            choosen: [],
            sendSuccess: true,
            imgShow: {
                state: false,
                src: ''
            }
        },
        created: function () {
           fetch("constructor.json")
            .then(r => r.json())
            .then(json => {
                this.components = json;
                fetch("templates.json")
                    .then(re => re.json())
                    .then(json2 => {
                        this.templates = json2;
                        this.sendSuccess = false;
                });
        });

       },
        methods:{
            open: function(img){
                this.imgShow.state = true;
                this.imgShow.src = img;
                document.body.style.overflowY = "hidden";
            },
            close: function(img){
                this.imgShow.state = false;
                this.imgShow.src = '';
                document.body.style.overflowY = "scroll";
            },
            remove: function(component, index){
                this.choosen.filter(function(el) {
                    return el.name !== component.name;
                });
                this.choosen.splice(index, 1);
            },
            add: function(component){
                this.choosen.push(component);
            },
            addTemplate: function(component){
                for(var item in component){
                    this.choosen.push(component[item]);
                }
            },
            send: function(e){
                
                e.preventDefault();
                var formData = [];

                this.choosen.filter(function(el) {
                    formData.push(el.name);
                });

                if(formData.length){
                    fetch("/sendForm" + buildQS(formData))
                    .then(r => r.text())
                    .then(json => {
                        alert('Компиляция прошла успешно.')
                    })
                }else{
                    alert('Вы не выбрали ни одного компонента')
                }

            }
        }
    });

function buildQS(arr) {
    var string = '?';
    
    for (var i = 0; i < arr.length; i++) {
        var key = arr[i];
        
        string += 'components[]=' + key;
        
        if (i < arr.length - 1)
            string += '&';
    }
    
    return string;
}