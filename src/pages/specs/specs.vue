<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>

    <v-list @edit="edit"></v-list>

    <v-form :info="info" ref="form"></v-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import vList from "./components/list"
import vForm from "./components/form"
export default {
  components:{
    vList,
    vForm
  },
  data(){
    return {
      info:{
        isshow:false,
        title:"添加规格"
      }
    }
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    //点击添加的时候
    willAdd(){
      this.info={
        isshow:true,
        title:"添加规格"
      }
    },
    //编辑
    edit(id){
      this.info={
        isshow:true,
        title:"编辑规格"
      }
      this.$refs.form.getOne(id)
    }
  },
  mounted() {},
};
</script>
<style scoped>
</style>