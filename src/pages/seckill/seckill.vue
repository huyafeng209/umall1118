<template>
  <div>
    <el-button type="primary">添加</el-button>
    <v-list></v-list>

    <v-form :info="info"></v-form>
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
        title:'添加秒杀'
      }
    }
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
  },
  mounted() {},
};
</script>
<style scoped>
</style>