/**
 * manage a list of single-select options
 * @author yiminghe@gmail.com
 */
KISSY.add(function (S, Node, MenuButton, Menu, undefined) {
    var $ = Node.all;
    var Select = MenuButton.Select;
    var PREFIX_CLS = 'bf-';
    var Item = Menu.Item;
    function ButterflySelect(target,config){
        var self = this;
        var config = self._decorate(target,config);
        if(!config.prefixCls) S.mix(config,{prefixCls:PREFIX_CLS});
        //调用父类构造函数
        ButterflySelect.superclass.constructor.call(self, config);
        self.set('target',target);
    }
    S.extend(ButterflySelect,Select,{
        /**
         * 处理menu的配置
         * @param cfg
         * @return {*}
         * @private
         */
        _decorate:function(element,cfg){
            var self = this;
            element = $(element);
            if(!element.length) return false;
            cfg = cfg || {};
            cfg.elBefore = element;

            var menuData = self.menuData(element);
            S.mix(cfg, {
                menu: S.mix(menuData.menu, cfg.menuCfg)
            });

            S.mix(cfg, menuData.selectedItem);
            return cfg;
        },
        /**
         * 从select中拉取数据，生成menu可用的data
         * @return {Object} { selectedItem:{}, allItems : [] }
         */
        menuData:function(element){
            var self = this;
            var element = element || self.get('target');
            var curValue = element.val();
            var options = element.all("option");
            var data = {
                //当前选中的选项
                selectedItem:{},
                //所有的菜单项
                menu:{
                    children: []
                }
            };

            options.each(function (option) {
                var item = {
                    xclass: 'option',
                    content: option.text(),
                    elCls: option.attr("class"),
                    value: option.val(),
                    prefixCls:PREFIX_CLS
                };
                if (curValue == option.val()) {
                    data.selectedItem = {
                        content: item.content,
                        value: item.value
                    };
                }
                data.menu.children.push(item);
            });
            return data;
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
        },
        /**
         * 模拟选择框同步原生select的数据
         * @return {*}
         */
        sync:function(){
            var self = this;
            var menu = self.get("menu");
            if(!menu) return self;
            //删除所有的下拉项
            self.removeItems(true);
            var menuData = self.menuData();
            var selectedItem = menuData.selectedItem;
            var items = menuData.menu.children;
            S.each(items,function(itemConfig){
                var item = new Item(itemConfig);
                self.addItem(item);
                if(itemConfig.value == selectedItem.value){
                    self.set('value',itemConfig.value);
                    self.set('content',itemConfig.content);
                }
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