<template>
  <div>
    <el-dialog title="会员编辑" :visible.sync="info.isshow">
      <el-form :model="user">
        <el-form-item label="手机号" label-width="120px">
          <el-input v-model="user.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" label-width="120px">
          <el-input v-model="user.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px">
          <el-input v-model="user.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert } from "../../../utils/alert";
import { reqVipDetail, reqVipList, reqVipUpdate } from "../../../utils/http";
export default {
  props: ["info"],
  data() {
    return {
      user: {
        uid: "",
        nickname: "",
        phone: "",
        password: "",
        status: 1,
      },
      list: [],
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    empty() {
      this.user = {
        uid: "",
        nickname: "",
        phone: "",
        password: "",
        status: 1,
      };
    },
    cancel() {
      this.info.isshow = false;
    },
    getOne(uid) {
      reqVipDetail(uid).then((res) => {
        // console.log(res);
        this.user = res.data.list;
        this.user.password = ""
        // console.log(this.user);
      });
    },
    update() {
      reqVipUpdate(this.user).then((res) => {
        if (res.data.code == 200) {
          successAlert("修改成功");
          this.cancel();
          this.empty();
          this.$emit("init")
        }
      });
    },
  },
  mounted() {
    reqVipList(this.user).then((res) => {
      // console.log(res);
      this.list = res.data.list;
    });
  },
};
</script>
<style scoped>
</style>