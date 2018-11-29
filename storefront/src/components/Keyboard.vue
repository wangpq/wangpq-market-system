<template>
    <div>
      <div>
        <div class="row">
          <el-button class="number number-size" type="primary" plain @click="onClick">7</el-button>
          <el-button class="number number-size" type="primary" plain @click="onClick">8</el-button>
          <el-button class="number number-size" type="primary" plain @click="onClick">9</el-button>
          <el-button class="number" type="primary" plain @click="onPoint">
            <slot><img src="../assets/images/point.png"/></slot>
          </el-button>
        </div>
        <div class="row">
          <el-button class="number number-size" type="primary" plain @click="onClick">4</el-button>
          <el-button class="number number-size" type="primary" plain @click="onClick">5</el-button>
          <el-button class="number number-size" type="primary" plain @click="onClick">6</el-button>
          <el-button class="number"  type="primary" plain @click="onClear">
            <slot><img src="../assets/images/clear.png"/></slot>
          </el-button>
        </div>
        <div class="row">
          <el-button class="number number-size" type="primary" plain @click="onClick">1</el-button>
          <el-button class="number number-size" type="primary" plain @click="onClick">2</el-button>
          <el-button class="number number-size" type="primary" plain @click="onClick">3</el-button>
          <el-button class="number" type="primary" plain @click="onDelete">
            <slot><img src="../assets/images/delete.png"/></slot>
          </el-button>
        </div>
        <div class="row">
          <el-button :class="confirm?'number-zero-confirm':'number-zero'" type="primary" plain @click="onClick">0</el-button>
          <el-button v-if="confirm" class="number" type="danger" @click="onEnter">确定</el-button>
          </div>
      </div>

    </div>
</template>

<script>
    export default {
      name: "Keyboard",
      props:{
        confirm:true
      },
      data(){
        return{
          value:""
        }
      },
      methods:{
        onClick(e){
          let num=e.target.innerText;
          if(this.value.indexOf(".")>-1){
            let a = this.value.split(".")[1];
            if(a.length<2){
              this.value += num;
            }
          }else{
            this.value += num;
          }
          this.notify();
        },
        onPoint(){
          if(this.value.indexOf(".") <= -1){
            this.value = (this.value.length > 0)?this.value+".":"0.";
          }
          this.notify();
        },
        onClear(){
          this.value = "";
          this.notify();
        },
        onDelete(){
          this.value = this.value.slice(0,-1);
          this.notify();
        },
        onEnter(){
          this.$emit('enter', this.value);
        },
        notify(){
          this.$emit('number', this.value);
        }
      }
    }
</script>

<style scoped>
  .row{
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 0.2rem 0 0 0;
  }
  .number{
    width: 1.6rem;
    height: 1.5rem;
  }
  .number-size{
    font-size: 0.8rem;
  }

  .number-zero-confirm{
    width: 5.2rem;
    height: 1.5rem;
    font-size: 1rem;
  }

  .number-zero{
    width: 7rem;
    height: 1.5rem;
    font-size: 1rem;
  }


</style>
