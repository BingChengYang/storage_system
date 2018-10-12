<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 目前庫存</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">刪除多筆資料</el-button>
                <el-select v-model="select_cate" placeholder="品牌篩選" class="handle-select mr10">
                    <el-option key="1" label="supreme" value="supreme"></el-option>
                    <el-option key="2" label="fearless" value="fearless"></el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="關鍵字查詢" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">查詢</el-button>
            </div>
            <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange" @sort-change='tableChange'>
                <el-table-column type="selection" min-width="55"></el-table-column>
              <!--   <el-table-column prop="date" label="日期" sortable width="150">
                </el-table-column>
                <el-table-column prop="name" label="姓名" width="120">
                </el-table-column>
                <el-table-column prop="address" label="地址" :formatter="formatter">
                </el-table-column> -->
                <el-table-column prop="pName" label="品名" min-width="50">
                </el-table-column>
                <el-table-column prop="pLocation" label="所在地" min-width="50">
                </el-table-column>
                <el-table-column prop="pSeason" label="季度" min-width="50">
                </el-table-column>
                <el-table-column prop="pType" label="種類" min-width="50">
                </el-table-column>
                <el-table-column prop="pCost" label="成本" sortable="custom" min-width="50">
                </el-table-column>                
                <el-table-column prop="pPrice" label="售價" sortable="custom" min-width="50">
                </el-table-column>
                <el-table-column prop="pQuantity" label="數量" sortable="custom" min-width="50">
                </el-table-column>
                <el-table-column prop="pSize" label="尺寸" min-width="50">
                </el-table-column>
                <el-table-column prop="pColor" label="顏色" min-width="50">
                </el-table-column>
                <el-table-column prop="pImg" label="產品圖片連結" min-width="80">
                </el-table-column>
                <el-table-column prop="pNote" label="產品介紹連結" min-width="80">
                </el-table-column>

                <el-table-column label="操作" min-width="180">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">編輯</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">刪除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="tableLength">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="50px">
                <el-form-item label="品名">
                    <el-input v-model="form.pName"></el-input>
                </el-form-item>
                <el-form-item label="所在地">
                    <el-input v-model="form.pLocation"></el-input>
                </el-form-item>
                <el-form-item label="季度">
                    <el-input v-model="form.pSeason"></el-input>
                </el-form-item>
                <el-form-item label="種類">
                    <el-input v-model="form.pType"></el-input>
                </el-form-item>
                <el-form-item label="成本">
                    <el-input v-model="form.pCost"></el-input>
                </el-form-item>
                <el-form-item label="售價">
                    <el-input v-model="form.pPrice"></el-input>
                </el-form-item>
                <el-form-item label="數量">
                    <el-input v-model="form.pQuantity"></el-input>
                </el-form-item>
                <el-form-item label="尺寸">
                    <el-input v-model="form.pSize"></el-input>
                </el-form-item>
                <el-form-item label="顏色">
                    <el-input v-model="form.pColor"></el-input>
                </el-form-item>
                <!-- <el-form-upload
                    class="avatar-uploader"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-form-upload> -->

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取消</el-button>
                <el-button type="primary" @click="saveEdit">確定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">刪除不可恢復,確定是否刪除</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取消</el-button>
                <el-button type="primary" @click="deleteRow">確定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'basetable',
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    pName: '',
                    pLocation: '',
                    pSeason: '',
                    pType: '',
                    pCost: '',
                    pPrice: '',
                    pQuantity: '',
                    pSize: '',
                    pColor: '',
                    pImg: '',
                    pNote:''
                },
                idx: -1,
                tableLength: -1,
                imageUrl: '',

                sortKey: '',
                sortOrder: '',
                isSort: false,

            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.pName === this.del_list[i].pName && d.pLocation === this.del_list[i].pLocation && d.pPrice === this.del_list[i].pPrice && d.pQuantity === this.del_list[i].pQuantity && d.pSize === this.del_list[i].pSize && d.pColor === this.del_list[i].pColor && d.pImg === this.del_list[i].pImg && d.pNote === this.del_list[i].pNote && d.pCost === this.del_list[i].pCost) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        // if (d.brand.indexOf(this.select_cate) > -1 &&
                        //     (d.name.indexOf(this.select_word) > -1 ||
                        //         d.brand.indexOf(this.select_word) > -1)
                        // ) {
                        return d;
                        // }
                    }
                })
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                if (process.env.NODE_ENV === 'development') {
                    this.url = '/server/getStorageList';
                };
                this.$axios.post(this.url, {
                    page: this.cur_page,
                    isSort: this.isSort,
                    sortKey: this.sortKey,
                    sortOrder: this.sortOrder
                }).then((res) => {
                    this.tableData = res.data.list;
                    this.tableLength=res.data.totalDataNum;
                    console.log(this.tableData);
                });
            },
            search() {
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    pName: item.pName,
                    pLocation: item.pLocation,
                    pSeason: item.pSeason,
                    pType: item.pType,
                    pCost: item.pCost,
                    pPrice: item.pPrice,
                    pQuantity: item.pQuantity,
                    pSize: item.pSize,
                    pColor: item.pColor,
                    pImg: item.pImg,
                    pNote: item.pNote
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            delAll() {// here is a bug , delete_list need to be object list;
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('刪除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },
            // 确定删除
            deleteRow(){
                this.tableData.splice(this.idx, 1);
                this.$message.success('刪除成功');
                this.delVisible = false;
            },

            tableChange:function(column,prop,order){
                this.isSort = true;
                this.sortOrder = column.order;
                this.sortKey = column.prop;
                console.log(column)
                console.log(column.prop)
                console.log(column.order)
                this.getData();
            },

            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },

            // upload product Img
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                  this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                  this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }

</style>
