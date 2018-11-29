import DialogComponent from './dialog.vue'

const Dialog = {};

// 注册Toast
Dialog.install = function (Vue) {
  // 生成一个Vue的子类
  // 同时这个子类也就是组件
  const DialogConstructor = Vue.extend(DialogComponent)
  // 生成一个该子类的实例
  const instance = new DialogConstructor();

  // 将这个实例挂载在我创建的div上
  // 并将此div加入全局挂载点内部
  instance.$mount(document.createElement('div'))
  document.body.appendChild(instance.$el)

  // 通过Vue的原型注册一个方法
  // 让所有实例共享这个方法
  Vue.prototype.$dialog = (params, success,cancel) => {
      if(params.constructor==Object){
        instance.title = params.title;
        instance.message = params.message;
        instance.yes = params.yes;
        instance.no = params.no;
        instance.visible = true;
        instance.success = success;
        cancel ? instance.cancel = cancel : null;
      }
    }
}

export default Dialog
