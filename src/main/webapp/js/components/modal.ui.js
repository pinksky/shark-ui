/**
 * @author sweetyx
 * @description 弹窗插件
 */
var UI = require('../common/core');
var BaseComponent = require('../common/base');
var Templates = require('../common/templates');
(function($) {
    var template = Templates.modal;
    var templateFun = Templates.templateAoT(template);

    var templateConfirm = Templates.confirm;
    var templateConfirmFun = Templates.templateAoT(templateConfirm);

    //初始化modal的dom
    function initDom(sharkComponent, config) {
        var templateData = {
            animate: config.animate,
            size: config.size,
            content: config.content
        };
        sharkComponent.component = $(templateFun.apply(templateData));
        return sharkComponent;
    }

    // 初始化事件
    function initEvents(sharkComponent, config) {
        var modal = sharkComponent.component;
        modal.on('click.modal', '.js-ok,.js-cancel', BaseComponent.filterComponentAction(sharkComponent, function(evt) {
            var curEle = $(this);
            if (curEle.hasClass('js-ok')) {
                config.deffer && config.deffer.resolve();
            }
            if (curEle.hasClass('js-cancel')) {
                config.deffer && config.deffer.reject();
            }
            sharkComponent.hide();
        }));
    }

    $.fn.extend({
        sharkModal: function(options) {
            /*********默认参数配置*************/
            var config = {
                animate: 'fade',
                size: 'lg',
                backdrop: '',
                content: '',
                onShow: function() {},
                onHide: function() {}
            };
            UI.extend(config, options);
            /*********初始化组件*************/
            var body = $(document.body);
            var sharkComponent = {};
            initDom.call(this, sharkComponent, config);
            var backdropEle;
            body.append(sharkComponent.component);
            BaseComponent.addComponentBaseFn(sharkComponent, config);
            if (config.backdrop !== 'static') {
                sharkComponent.component.on('click', function(evt) {
                    if (evt.target === evt.currentTarget) {
                        sharkComponent.hide();
                    }
                });
            }
            initEvents(sharkComponent, config);
            sharkComponent.show = function() {
                backdropEle = $('<div class="modal-backdrop ' + config.animate + ' in"></div>');
                body.append(backdropEle);
                body.addClass('modal-open');
                sharkComponent.component.show();
                sharkComponent.component.scrollTop(0); //触发重绘
                sharkComponent.component.addClass('in');
                if (typeof config.onShow === 'function') {
                    config.onShow.call(sharkComponent);
                }
            };
            sharkComponent.hide = function() {
                backdropEle.remove();
                body.removeClass('modal-open');
                sharkComponent.component.hide();
                sharkComponent.component.removeClass('in');
                if (typeof config.onHide === 'function') {
                    config.onHide.call(sharkComponent);
                }
            };
            sharkComponent.destroy = function() {
                if (backdropEle) {
                    backdropEle.remove();
                }
                sharkComponent.component.remove();
                sharkComponent = null;
            };
            return sharkComponent;
        },
        sharkConfirm: function(options) {
            var deffer = $.Deferred();
            /*********默认参数配置*************/
            var config = {
                animate: 'fade',
                size: '',
                title: '提示',
                content: '',
                okText: '确定',
                cancelText: '取消',
                onShow: function() {},
                onHide: function() {}
            };
            UI.extend(config, options);
            /*********初始化组件*************/
            config.backdrop = 'static';
            config.deffer = deffer;
            var templateData = {
                title: config.title,
                content: config.content,
                okText: config.okText,
                cancelText: config.cancelText
            };
            config.content = templateConfirmFun.apply(templateData);
            var sharkComponent = $.fn.sharkModal(config);
            sharkComponent.show();
            return deffer.promise();
        },
        sharkAlert: function(options) {
            var deffer = $.Deferred();
            /*********默认参数配置*************/
            var config = {
                animate: 'fade',
                size: '',
                title: '提示',
                content: '',
                okText: '确定',
                onShow: function() {},
                onHide: function() {}
            };
            UI.extend(config, options);
            /*********初始化组件*************/
            config.backdrop = 'static';
            config.deffer = deffer;
            var templateData = {
                title: config.title,
                content: config.content,
                okText: config.okText
            };
            config.content = templateConfirmFun.apply(templateData);
            var sharkComponent = $.fn.sharkModal(config);
            sharkComponent.show();
            return deffer.promise();
        }
    });
})(jQuery || $);
