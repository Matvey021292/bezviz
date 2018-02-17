var Form = new function () {

    /**
     * Метод инициализации Form
     * 
     * @returns {Form}
     */
    this.init = function () { 

        this.submit_count = 0;
        this.form_container = $('.form-container');
        this.country_input_val = ''; 
        this.messages = {
            "firstname": "- required field<br>- name length - at least 2 characters<br>- field must contain only letters",
            "lastname": "- required field<br>- name length - at least 2 characters<br>- field must contain only letters",
            "email": "- field must contain a valid email address",
            "phone": "- number entered incorrectly",
            "conditions": "Please confirm your agreement with conditions",
            "success": "Everything was successful, we congratulate you!",
            "error": "Unfortunately, the sending was not successful",
            "limit": "Unfortunately, sending limit has expired"
        };
       
        this.initFormData();

        return this;
    };

    /**
     * Метод инициализации елементов
     * 
     * @returns {void}
     */
    this.initElem = function () {

        this.main_modal = $(".main-modal");
        this.post_modal = $('#postModal');
        this.call_back_modal = $("#call_back_form");
        this.alert = $('#postModal .alert');
        this.closer = $('.close-form');
        this.affID = $('input[data-validation-type="affid"]');
        this.subID = $('input[data-validation-type="subid"]');
        this.offerID = $('input[data-validation-type="offerid"]');
        this.transID = $('input[data-validation-type="transactionid"]'); 

    }

    /**
     * Метод инициализации динамики
     * 
     * @returns {void}
     */
    this.initFormData = function () {

        this.getConfig();
        this.createForms();
        this.initElem();
        this.hideInputs();
        this.addUrlData();

    }

	/**
     * Метод инициализации call back окна
     * 
     * @returns {void}
     */
    this.initCallBack = function () {
        this.call_back_modal.find(".button--inner").html("Call Back"), idleTimer = null, idleState = !1, idleWait = 6e4,
                
        $("*").bind("mousemove keydown scroll", function() {
            clearTimeout(idleTimer), idleState = !1, idleTimer = setTimeout(function() {
                $("body").ready(function() {
                    $(".main-modal").is(":visible") && $(".main-modal").modal('hide'), $("#call_back_popup").modal('show')
                }), idleState = !0
            }, idleWait)
        }), $("body").trigger("mousemove")        
            
    }

    /**
     * Метод обработки даный с config.json
     * 
     * @returns {void}
     */
    this.getConfig = function () {

        this.request = new XMLHttpRequest();
        this.request.open("GET", "config.json", false);
        this.request.send(null);
        this.config = JSON.parse(Form.request.response);

        this.forms = this.config['forms'];
        this.style = this.config['style'];
        this.template = this.config['main-template'];
        this.inputs = this.config['inputs-template'];
        this.modal = this.config['modal-template'];
        this.source_id = this.config['source-id'];
		this.registration = this.config['registration']; 

    }

    /**
     * Метод создания html разметки
     * 
     * @returns {void}
     */
    this.createForms = function () {

        for( var input in this.inputs ){
            this.form_container.append(this.inputs[input]);
        }
        this.form_container.append('<style>' + this.style + '</style>', this.template);
        $('body').append(this.modal);

    }

    /**
     * Метод скрытия ненужных полей
     * 
     * @returns {void}
     */
     this.hideInputs = function () {

        !this.config['modal'] ? this.closer.hide() : this.closer.show();

        for( var form in this.forms ){

            for( var param in this.forms[form].hidden ){
                $("#" + form).find('input[name=' + param +']').attr({
                    'type':'hidden',
                    'value': param !== 'country' ? this.forms[form].hidden[param] : ''
                }).siblings('label:not(#code-label)').hide();
                if(param === 'age'){
                    $("#" + form).find('input[name=age]').parent().hide()
                }else if(param === 'conditions'){
                    $("#" + form).find('input[name=conditions]').parent().hide()
                }
                
            }

            if(this.forms[form].hidden.hasOwnProperty('country')){ 
                    this.country_input_val = this.forms[form].hidden['country']; 
                } 

        }

    }

    /**
     * Метод парсинга URL
     *
     * @param {string} name
     * @returns {result}
     */
     this.urlParam = function (name) {

        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results !== null) {
            return results[1] || 0;
        } else {
            return false;
        }

    }

    /**
     * Метод парсинга URL и заполенения полей
     * 
     * @returns {void}
     */
     this.addUrlData = function () {

        this.affID.val(this.urlParam('affiliate_id'));
        this.subID.val(this.urlParam('aff_sub'));
        this.offerID.val(this.urlParam('offer_id'));
        this.transID.val(this.urlParam('transaction_id'));
    }

    /**
     * Метод инициализации загрузки страници
     * 
     * @returns {void}
     */
     this.DOMReady = function () {

        this.validationOnBlur();
        this.submitForm(); 
        this.initCountrySelect();
        if(this.call_back_modal)
            this.initCallBack();

    }


    this.check_validation = function(target) {
        var $target = target;
            var validType = $target.data('validation-type');
            var val = $target.val();

            switch(validType)
            {
                case 'firstname':
                var rv_name = /^[a-zA-Zа-яА-Я]+$/;


                if(val.length > 2 && val != '' && rv_name.test(val))
                {
                    $target.addClass('valid');
                    $target.removeClass('invalid');
                    $target.next('.error').text('')
                }

                else
                {
                    $target.removeClass('valid').addClass('invalid');
                    $target.next('.error').html(Form.messages.firstname)
                }
                break;
                case 'lastname':
                var rv_name = /^[a-zA-Zа-яА-Я]+$/;


                if(val.length > 2 && val != '' && rv_name.test(val))
                {
                    $target.addClass('valid');
                    $target.removeClass('invalid');
                    $target.next('.error').text('')
                }

                else
                {
                    $target.removeClass('valid').addClass('invalid');
                    $target.next('.error').html(Form.messages.lastname)
                }
                break;


                case 'email':
                var rv_email = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
                if(val != '' && rv_email.test(val))
                {
                    $target.addClass('valid');
                    $target.removeClass('invalid');
                    $target.next('.error').text('')
                }
                else
                {
                    $target.removeClass('valid').addClass('invalid');
                    $target.next('.error').html(Form.messages.email)

                }
                break;

                case 'phone':
                var rv_name = /^([- _():=+]?\d[- _():=+]?){2,14}(\s*)?$/;
                
                    if ($target.intlTelInput("isValidNumber") && $.trim(val) && rv_name.test(val)) {
                        $target.addClass('valid');
                        $target.removeClass('invalid');
                        $target.parents('.form_input--group').find('.error').text('');
                    } else {
                        $target.removeClass('valid').addClass('invalid');
                        $target.parents('.form_input--group').find('.error').html(Form.messages.phone);
                    }

                break;

                case 'age':
                if( !$target.prop("checked") ){
                    $target.parent().siblings('.error').html(Form.messages.conditions);
                    $target.removeClass('valid').addClass('invalid');
                }else{
                    $target.parent().siblings('.error').text('');
                    $target.removeClass('invalid').addClass('valid');
                }
                break;

                case 'conditions':
                if( !$target.prop("checked") ){
                    $target.parent().siblings('.error').html(Form.messages.conditions);
                    $target.removeClass('valid').addClass('invalid');
                }else{
                    $target.parent().siblings('.error').text('');
                    $target.removeClass('invalid').addClass('valid');
                }
                break;

            }
    }

    /**
     * Метод инициализации валидации
     * 
     * @returns {void}
     */
    this.validationOnBlur = function () {

        this.form_container.find('input').blur( function(event){
            Form.check_validation($(event.target));
        });
    }

    /**
     * Метод инициализации отпарвки формы
     * 
     * @returns {void}
     */
    this.submitForm = function () {

        this.form_container.submit(function(e){
            e.preventDefault();

            Form.check_validation($(this).find('input').not(".valid").not(":hidden"));

            var countryData = $("input[name=phone]").intlTelInput("getSelectedCountryData");
            var json = {
                first_name: $(this).find('input[data-validation-type="firstname"]').val(),
                last_name: $(this).find('input[data-validation-type="lastname"]').val(),
                email_address: $(this).find('input[data-validation-type="email"]').val(),
                phone:  '+' + countryData.dialCode + $(this).find('input[data-validation-type="phone"]').val(),
                countryISO: countryData.iso2,
                affiliate_id: $(this).find('input[data-validation-type="affid"]').val(),
                aff_sub: $(this).find('input[data-validation-type="subid"]').val(),
                offer_id: $(this).find('input[data-validation-type="offerid"]').val(),
                transaction_id: $(this).find('input[data-validation-type="transactionid"]').val(),
                source_id: Form.source_id,
				registration: Form.registration
            };

            if(Form.submit_count < 3){
                if(!$(this).find('.invalid').length && ($(this).find('.valid').length == $(this).find('input:not(:hidden)').length)){

                    $.post('https://www.moneymake.me/sendForm', JSON.stringify(json), function (response) {

                        var r = JSON.parse(response);
                        Form.alert.removeClass('alert-success alert-danger');

                        if (response.success || r.success) {
                            Form.alert.addClass('alert-success').text(Form.messages.success);

                            if (Form.registration === 'true')
                                setTimeout(function () {
                                    window.location.assign(r.message);
                                }, 5000)
                        } else {
                            Form.alert.addClass('alert-danger').text(Form.messages.error);
                        }

                        Form.main_modal ? Form.main_modal.modal('hide') : "";
                        setTimeout(function () {
                            Form.post_modal.modal('show');
                        }, 500);

                        Form.submit_count++;

                    }).fail(function() {

                        Form.alert.addClass('alert-danger').text(Form.messages.error);
                        Form.main_modal ? Form.main_modal.modal('hide') : "";
                        setTimeout(function () {
                            Form.post_modal.modal('show');
                        }, 500)

                    });
                }else{                    
                    return false;
                }
            }else{

                Form.alert.addClass('alert-danger').text(Form.messages.limit);
                Form.main_modal ? Form.main_modal.modal('hide') : "";
                setTimeout(function () {
                    Form.post_modal.modal('show');
                }, 500)
            }

        });
    }

    /**
     * Метод инициализации country select
     * 
     * @returns {Form}
     */
    this.initCountrySelect = function () {

        var telInput = $("input[name=phone]");
        telInput.intlTelInput({
            initialCountry: "ru",
            autoHideDialCode: "false",
            separateDialCode: "false",
            utilsScript: "js/utils/utils.js"
        });

        if(this.country_input_val === ''){
            $.post('https://moneymake.me/geoip/',  function (response) {
                this.country_input_val = response.toLowerCase();
                telInput.intlTelInput("setCountry", this.country_input_val);
            })
            .fail(function (r) {
                console.log(r);
            });
        }else{
            telInput.intlTelInput("setCountry", this.country_input_val);
        }

    }

}

Form.init();
$(document).ready(function(){
    Form.DOMReady();
});
