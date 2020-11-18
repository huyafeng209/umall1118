<template>
  <div>
      

  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {
  reqcateList,
  reqseckAdd,
  reqseckDetail,
  reqseckUpdate,
  reqspecsDel
} from "../../../utils/http";
export default {
    props:["info"],
    data(){
        return {
            user:{
                id:"",
                title:"",
                begintime:"",
                endtime:"",
                first_cateid:"",
                second_cateid:"",
                goodsid:"",
                status:""
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