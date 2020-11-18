<template>
  <div>
    <v-form :info="info" ref="form" @init="init"></v-form>
    <v-list @edit="edit" :list="list" @init="init"></v-list>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import vForm from "./components/form";
import vList from "./components/list";
import { reqVipList } from "../../utils/http";
export default {
  data() {
    return {
      info: {
        isshow: false,
      },
      list: [],
    };
  },
  components: {
    vForm,
    vList,
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    edit(uid) {
      this.info = { isshow: true };
      this.$refs.form.getOne(uid);
    },
    init() {
      reqVipList().then((res) => {
        this.list = res.data.list;
        // console.log(this.userlist)
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style scoped>
</style>