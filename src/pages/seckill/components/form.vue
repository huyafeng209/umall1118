<template>
  <div class="add">
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="list" :rules="rules">
        <el-form-item label="活动名称" label-width="120px" prop="title">
          <el-input v-model="list.title" autocomplete="off"></el-input>
        </el-form-item>

        <div class="block">
          <!-- <span class="demonstration">起始日期时刻为 12:00:00，结束日期时刻为 08:00:00</span> -->
          <el-form-item label="活动期限" label-width="120px">
            <el-card class="box-card">
              <el-date-picker
                v-model="dateTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="medium"
              ></el-date-picker>
            </el-card>
          </el-form-item>
        </div>

        <el-form-item label="一级分类" label-width="120px">
          <el-select
            v-model="list.first_cateid"
            placeholder="请选择分类"
            @change="changeFirst"
          >
            <el-option :value="0" label="顶级分类"></el-option>
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="二级分类" label-width="120px" >
          <el-select
            v-model="list.second_cateid"
            placeholder="请选择分类"
            @change="changeSecond"
          >
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :value="item.id"
              :label="item.catename"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品" label-width="120px">
          <el-select
            v-model="list.goodsid"
            placeholder="请选择商品"
            @change="getGoods"
          >
            <el-option
              v-for="item in list1"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态" label-width="120px">
          <el-switch
            v-model="list.status"
            :active-value="1"
            :inactive-value="2"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title == '活动添加'" @click="add"
          >添 加</el-button
        >
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { errorAlert, successAlert } from "../../../utils/alert";
import path from "path";
import { mapGetters, mapActions } from "vuex";
import {
  reqcateList,
  reqgoodsList,
  reqseckList,
  reqseckAdd,
  reqseckDetail,
  reqseckUpdata,
} from "../../../utils/http";
export default {
  props: ["info"],
  data() {
    return {
      rules: {
        title: [{ required: true, message: "请填写标题", tirgger: "blur" }],

        first_cateid: [
          { required: true, message: "请选择一级分类", tirgger: "change" },
        ],

        second_cateid: [
          { required: true, message: "请选择二级分类", tirgger: "change" },
        ],
        goodsid: [{ required: true, message: "请选择商品", tirgger: "change" }],
      },
      list: {
        title: "",
        begintime: null,
        endtime: null,
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      },
      //存储时间
      dateTime: [],
      //商品的列表
      list1: [],
      //二级的列表
      secondCateList: [],
    };
  },
  computed: {
    ...mapGetters({
      //一级的列表
      cateList: "cate/list",
      //商品的列表
      goodlist: "goods/list",
    }),
  },
  methods: {
    //弹框消失
    cancel() {
      this.info.isshow = false;
    },
    //清空数据
    empty() {
      this.list = {
        title: "",
        begintime: null,
        endtime: null,
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      };
      (this.dateTime = []), (this.list1 = []), (this.secondCateList = []);
    },
    //验证
    check() {
      return new Promise((resolve, reject) => {
        //验证title
        if (this.list.title === "") {
          errorAlert("请填写标题");
          return;
        }
        if (this.list.first_cateid === "") {
          errorAlert("一级分类不能为空");
          return;
        }
        if (this.list.second_cateid === "") {
          errorAlert("二级分类不能为空");
          return;
        }
        if (this.list.goodsid === "") {
          errorAlert("商品不能为空");
          return;
        }
        resolve();
      });
    },
    //添加数据
    add() {
      this.check().then(() => {
        //开始的时间赋值
        this.list.begintime = this.dateTime[0].getTime();
        //结束的时间赋值
        this.list.endtime = this.dateTime[1].getTime();
        //请求添加的接口
        reqseckAdd(this.list).then((res) => {
          if (res.data.code == 200) {
            successAlert("添加成功"), this.cancel();
            this.empty();
            this.reqSeckList();
            this.list1 = res.data.list;
          }
        });
      });
    },
    ...mapActions({
      reqSeckList: "seck/reqList",
      reqCateList: "cate/reqList",
      reqGoodsList: "goods/reqList",
    }),
    changeFirst() {
      //二级分类的id重置
      this.list.second_cateid = "";
      //商品的id重置
      this.list.goodsid = "";
      //根据二级的数据来找到goods的数据
      this.getSecondList();
    },
    //goods的数据
    getSecondList() {
      //获取二级分类list
      reqcateList({ pid: this.list.first_cateid }).then((res) => {
        this.secondCateList = res.data.list;
      });
    },
    //输入框改变的时候调用
    changeSecond() {
      this.list.goodsid = "";
      this.getGoods();
    },
    //得到goods的数据
    getGoods() {
      reqgoodsList({
        fid: this.list.first_cateid,
        sid: this.list.second_cateid,
      }).then((res) => {
        this.list1 = res.data.list;
      });
    },
    //得到一条数据
    getOne(id) {
      reqseckDetail(id).then((res) => {
        this.list = res.data.list;
        this.list.id = id;
        (this.begintime = res.data.list.begintime),
          (this.endtime = res.data.list.endtime);
        //给datTime赋值，现在是字符串，先转成数字再用时间戳来得到相应的值
        this.dateTime = [
          new Date(parseInt(this.list.begintime)),
          new Date(parseInt(this.list.endtime)),
        ];
        this.getSecondList();
        this.getGoods();
      });
    },

    //更新
    update() {
      this.check().then(() => {
        reqseckUpdata(this.list).then((res) => {
          if (res.data.code == 200) {
            successAlert("更新成功"), this.cancel();
            this.empty();
            this.getGoods();
          }
        });
      });
    },
    closed() {
      if (this.info.title === "活动编辑") {
        this.empty();
      }
    },
  },
  mounted() {
    //一进来就请求数据。让上面值有值
    this.reqCateList();
    this.getSecondList();
    this.getGoods();
  },
};
</script>

<style scoped lang="stylus">
.myupload {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  border: 1px dashed #ccc;
  position: relative;
}

.myupload h3 {
  width: 100%;
  height: 100px;
  font-size: 30px;
  text-align: center;
  line-height: 100px;
  color: #666;
  font-weight: 100;
}

.myupload .ipt {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}

.myupload .img {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 0;
  top: 0;
}

.add >>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>