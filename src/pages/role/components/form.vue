<template>
  <div>
    <!-- 4.绑定数据到模板 -->
    <!-- 40 绑定closed -->
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user" :rules="rules">
        <el-form-item label="角色名称" label-width="120px" prop="rolename">
          <!-- 9.通过v-model将user绑定到表单上 -->
          <el-input v-model="user.rolename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色权限" label-width="120px" >
          <!-- 树形控件
            data:数据
            :props="{children:'哪个字段是代表有下一个子节点',label:'展示在页面的字段'}"
            node-key:选中节点后，得到什么字段
            this.$refs.tree.getCheckedNodes() 可以取到选中的节点对应的整条数据，拼成的数组
            this.$refs.tree.getCheckedKeys() 可以取到选中节点的key拼成的数组
            this.$refs.tree.setCheckedKeys([10,11,12]); 给树设置值
          -->
          <!-- 14.将menuList 绑定到tree,配置props -->
          <el-tree
            :data="menuList"
            show-checkbox
            node-key="id"
            ref="tree"
            :props="{ children: 'children', label: 'title' }"
          ></el-tree>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch
            v-model="user.status"
            :active-value="1"
            :inactive-value="2"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title == '添加角色'" @click="add"
          >添 加</el-button
        >
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {
  reqMenuList,
  reqRoleAdd,
  reqRoleDetail,
  reqRoleUpdate,
} from "../../../utils/http";
import { successAlert, errorAlert } from "../../../utils/alert";
export default {
  // 3.接收info
  props: ["info"],
  data() {
    return {
      rules: {
        rolename: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
      //7.初始化user
      user: {
        rolename: "",
        menus: "",
        status: 1,
      },
      //  11.初始化树形控件
      menuList: [],
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    //6.点了取消
    cancel() {
      this.info.isshow = false;
    },
    //17.清空数据
    empty() {
      this.user = {
        rolename: "",
        menus: "",
        status: 1,
      };
      //把树清空
      this.$refs.tree.setCheckedKeys([]);
    },
    check() {
      return new Promise((resolve, reject) => {
        if (this.user.rolename === "") {
          errorAlert("请输入角色名称");
          return;
        }
        resolve();
      });
    },
    //10.点了添加按钮
    add() {
      this.check().then(() => {
        // 15.将树形控件的数据取出，变成字符串数组，赋值给user.menus
        this.user.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
        //16.ajax
        reqRoleAdd(this.user).then((res) => {
          if (res.data.code == 200) {
            //弹成功
            successAlert("添加成功");
            //弹框消失
            this.cancel();
            //数据清空
            this.empty();
            //24 刷新list
            this.$emit("init");
          }
        });
      });
    },
    //37 获取详情
    getOne(id) {
      reqRoleDetail(id).then((res) => {
        //此刻user没有id
        this.user = res.data.list;

        //处理树形控件的数据
        this.$refs.tree.setCheckedKeys(JSON.parse(this.user.menus));

        // 补id
        this.user.id = id;
      });
    },
    //39 修改
    update() {
      this.check().then(() => {
        this.user.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
        reqRoleUpdate(this.user).then((res) => {
          if (res.data.code == 200) {
            //弹成功
            successAlert("修改成功");
            //弹框消失
            this.cancel();
            //数据清空
            this.empty();
            //刷新list
            this.$emit("init");
          }
        });
      });
    },
    //41.处理消失
    closed() {
      if (this.info.title === "编辑角色") {
        this.empty();
      }
    },
  },
  mounted() {
    //   12.一进来，先获取菜单列表数据
    reqMenuList().then((res) => {
      if (res.data.code == 200) {
        this.menuList = res.data.list;
      }
    });
  },
};
</script>
<style scoped>
</style>