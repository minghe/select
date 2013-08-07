/*
combined files : 

gallery/select/1.4/index

*/
/**
 * manage a list of single-select options
 * @author yiminghe@gmail.com
 */
KISSY.add('gallery/select/1.4/index',function (S, Node, MenuButton, Menu, undefined) {
    var $ = Node.all;
    var Select = MenuButton.Select;
    var PREFIX_CLS = 'bf-';
    function ButterflySelect(target,config){
        var self = this;
        var config = self._decorate(target,config);
        if(!config.prefixCls) S.mix(config,{prefixCls:PREFIX_CLS});
        //调用父类构造函数
        ButterflySelect.superclass.constructor.call(self, config);
        self.set('target',target);
    }
    S.extend(ButterflySelect,Select,{
        _decorate:function(element, cfg){
            element = S.one(element);
            cfg = cfg || {};
            cfg.elBefore = element;

            var allItems = [],
                selectedItem = null,
                curValue = element.val(),
                options = element.all("option");

            options.each(function (option) {
                var item = {
                    xclass: 'option',
                    content: option.text(),
                    elCls: option.attr("class"),
                    value: option.val()
                };
                if (curValue == option.val()) {
                    selectedItem = {
                        content: item.content,
                        value: item.value
                    };
                }
                allItems.push(item);
            });

            S.mix(cfg, {
                menu: S.mix({
                    children: allItems
                }, cfg.menuCfg)
            });

            S.mix(cfg, selectedItem);
            return cfg;
        },
        /**
         * 运行组件
         * @return {boolean}
         */
        render:function(){
            var self = this;
            ButterflySelect.superclass.render.call(self);
            var $target = self.get('target');
            if(!$target.length) return false;
            $target.hide();
            self.on("afterValueChange", function (e) {
                //TODO:IE6存在bug，无法选中，所以加个延迟
                S.later(function(){
                    $target.val(e.newVal || "");
                    $target.fire('change');
                    self.fire("change",{value:e.newVal,$select:$target});
                })
            })
        }
    },{ATTRS:{
        target:{
            value:'',
            getter:function(v){
                return $(v);
            }
        }
    }})
    return ButterflySelect;

}, {
    requires: ['node', 'menubutton', 'menu']
});

/**
 * TODO
 *  how to emulate multiple ?
 **/
