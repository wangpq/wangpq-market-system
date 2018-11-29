import ToastComponent from './toast.vue'

const Toast = {};

// 注册Toast
Toast.install = function (Vue) {
    // 生成一个Vue的子类
    // 同时这个子类也就是组件
    const ToastConstructor = Vue.extend(ToastComponent)
    // 生成一个该子类的实例
    const instance = new ToastConstructor();

    // 将这个实例挂载在我创建的div上
    // 并将此div加入全局挂载点内部
    instance.$mount(document.createElement('div'))
    document.body.appendChild(instance.$el)
    
    // 通过Vue的原型注册一个方法
    // 让所有实例共享这个方法 
    Vue.prototype.$toast = (config, duration = 2000) => {
        if(config.constructor==Object){
            instance.message = config.message;
            instance.showBtn = config.showBtn;
            instance.autoHide = config.autoHide;
            instance.visible = true;
            instance.onAfterToastHide = config.onAfterToastHide;
            if(instance.autoHide){
                let timer=setTimeout(() => {
                    instance.visible = false;
                    instance.onAfterToastHide && instance.onAfterToastHide();
                    window.clearTimeout(timer);
                }, duration);   
            }
        }
        if(config.constructor==String){
            instance.message = config;
            instance.visible = true;
            instance.onAfterToastHide = config.onAfterToastHide;
            let timer=setTimeout(() => {
                instance.visible = false;
                instance.onAfterToastHide && instance.onAfterToastHide();
                window.clearTimeout(timer);
            }, duration); 
        }
    }
}

export default Toast