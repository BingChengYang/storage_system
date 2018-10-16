<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 目前庫存</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" class="handle-del mr10" @click="delAll">多筆商品轉倉</el-button>
                <el-button type="primary" class="handle-del mr10" @click="newProduct">新增商品</el-button>
                <el-select v-model="selectLocation" placeholder="倉庫選擇" class="handle-select mr10">
                    <el-option key="1" label="全部倉庫" value=""></el-option>
                    <el-option key="2" label="美國" value="美國"></el-option>
                    <el-option key="3" label="台灣" value="台灣"></el-option>
                </el-select>
                <el-select v-model="selectSeason" placeholder="季節選擇" class="handle-select mr10">
                    <el-option key="1" label="全年" value=""></el-option>
                    <el-option key="2" label="春夏" value="春夏"></el-option>
                    <el-option key="3" label="秋冬" value="秋冬"></el-option>
                </el-select>
            </div>
            <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange" @sort-change='sortChange'>
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
        <el-dialog title="編輯" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="50px">
                <el-form-item label="品名">
                    <el-input v-model="form.pName"></el-input>
                </el-form-item>
                <el-form-item label="所在地">
                    <el-select v-model="form.pLocation">
                            <el-option key="1" label="美國" value="美國"></el-option>
                            <el-option key="2" label="台灣" value="台灣"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="季度">
                    <el-select v-model="form.pSeason">
                            <el-option key="1" label="春夏" value="春夏"></el-option>
                            <el-option key="2" label="秋冬" value="秋冬"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="種類">
                    <el-select v-model="form.pType">
                            <el-option key="1" label="長袖" value="長袖"></el-option>
                            <el-option key="2" label="短袖" value="短袖"></el-option>
                    </el-select>
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
                    <el-select v-model="form.pSize">
                            <el-option key="1" label="XL" value="XL"></el-option>
                            <el-option key="2" label="L" value="L"></el-option>
                            <el-option key="3" label="M" value="M"></el-option>
                            <el-option key="4" label="S" value="S"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="顏色">
                    <el-select v-model="form.pColor">
                            <el-option key="1" label="黑" value="黑"></el-option>
                            <el-option key="2" label="白" value="白"></el-option>
                            <el-option key="3" label="藍" value="藍"></el-option>
                            <el-option key="4" label="紅" value="紅"></el-option>
                            <el-option key="5" label="黃" value="黃"></el-option>
                            <el-option key="6" label="綠" value="綠"></el-option>
                    </el-select>
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

        <el-dialog title="建立新商品" :visible.sync="newVisible" width="30%">
            <el-form ref="form" :model="form" label-width="50px">
                <el-form-item label="品名">
                    <el-input v-model="form.pName"></el-input>
                </el-form-item>
                <el-form-item label="所在地">
                    <el-select v-model="form.pLocation">
                            <el-option key="1" label="美國" value="美國"></el-option>
                            <el-option key="2" label="台灣" value="台灣"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="季度">
                    <el-select v-model="form.pSeason">
                            <el-option key="1" label="春夏" value="春夏"></el-option>
                            <el-option key="2" label="秋冬" value="秋冬"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="種類">
                    <el-select v-model="form.pType">
                            <el-option key="1" label="長袖" value="長袖"></el-option>
                            <el-option key="2" label="短袖" value="短袖"></el-option>
                    </el-select>
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
                    <el-select v-model="form.pSize">
                            <el-option key="1" label="XL" value="XL"></el-option>
                            <el-option key="2" label="L" value="L"></el-option>
                            <el-option key="3" label="M" value="M"></el-option>
                            <el-option key="4" label="S" value="S"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="顏色">
                    <el-select v-model="form.pColor">
                            <el-option key="1" label="黑" value="黑"></el-option>
                            <el-option key="2" label="白" value="白"></el-option>
                            <el-option key="3" label="藍" value="藍"></el-option>
                            <el-option key="4" label="紅" value="紅"></el-option>
                            <el-option key="5" label="黃" value="黃"></el-option>
                            <el-option key="6" label="綠" value="綠"></el-option>
                    </el-select>
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
                <el-button @click="newVisible = false">取消</el-button>
                <el-button type="primary" @click="saveNewProduct">確定</el-button>
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
                storageList: [],
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                selectLocation: '',
                selectSeason: '',
                del_list: [],
                editVisible: false,
                delVisible: false,
                newVisible: false,
                form: {
                    pid: '',
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
                pageSize: 10,

            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {

                this.tableData = this.storageList.filter((d) => {
                    if(this.selectLocation != ''){
                        if(this.selectSeason == ''){
                            if(this.selectLocation == d.pLocation) return d;
                        }else{
                            if((this.selectLocation == d.pLocation) && (this.selectSeason==d.pSeason)) return d;
                        }
                    }else{
                        if(this.selectSeason == ''){
                            return d;
                        }else{
                            if(this.selectSeason==d.pSeason) return d;
                        }
                    }
                });
                this.tableLength = this.tableData.length;
                return this.tableData.slice(this.pageSize*(this.cur_page-1), (this.pageSize*this.cur_page)-1);
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
               
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                if (process.env.NODE_ENV === 'development') {
                    this.url = '/server/getStorageList';
                };
                this.$axios.post(this.url, {
                    isSort: this.isSort,
                    sortKey: this.sortKey,
                    sortOrder: this.sortOrder
                }).then((res) => {
                    this.storageList = res.data.list;
                });
            },
            // update value to DB
            editData(item){
                //console.log(item);
                if (process.env.NODE_ENV === 'development') {
                    this.url = '/server/updateStorageList';
                };
                this.$axios.post(this.url, item).then((res) => {
                });
            },
            delData(pid){
                if (process.env.NODE_ENV === 'development') {
                    this.url = '/server/delStorageList';
                };
                this.$axios.post(this.url, {
                   pid:pid
                }).then((res) => {});
            },
            insertData(item){
                if (process.env.NODE_ENV === 'development') {
                    this.url = '/server/insertStorageList';
                };
                this.$axios.post(item).then((res) => {
                });
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = this.storageList.findIndex(x=>x.pid==row.pid);
                console.log(row.pid);
                const item = this.storageList[this.idx];
                this.form = {
                    pid: item.pid,
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
            newProduct() {
                
                this.form = {
                    pid: '',
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
                    pNote: ''
                }
                this.newVisible = true;
            },
            handleDelete(index, row) {
                this.idx = this.storageList.findIndex(x=>x.pid==row.pid);
                this.delVisible = true;
            },
            delAll() {
                console.log(this.multipleSelection);
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
                this.editData(this.form);
                this.$set(this.storageList, this.idx, this.form);
                //console.log(this.storageList[this.idx]);
                this.editVisible = false;
                this.$message.success(`修改成功`);
            },
            saveNewProduct() {
                this.insertData(this.form);
                this.storageList.push(this.form);
                //console.log(this.storageList[this.idx]);
                this.newVisible = false;
                this.$message.success(`新增成功`);
            },
            // 确定删除
            deleteRow(){
                this.delData(this.storageList[this.idx].pid);
                this.storageList.splice(this.idx, 1);
                this.$message.success('刪除成功');
                this.delVisible = false;
            },

            sortChange:function(column,prop,order){
                this.isSort = true;
                this.sortOrder = column.order;
                this.sortKey = column.prop;
                console.log(column);
                console.log(column.prop);
                console.log(column.order);
                this.getData();
            },

            // handleAvatarSuccess(res, file) {
            //     this.imageUrl = URL.createObjectURL(file.raw);
            // },

            // upload product Img
            // beforeAvatarUpload(file) {
            //     const isJPG = file.type === 'image/jpeg';
            //     const isLt2M = file.size / 1024 / 1024 < 2;

            //     if (!isJPG) {
            //       this.$message.error('上传头像图片只能是 JPG 格式!');
            //     }
            //     if (!isLt2M) {
            //       this.$message.error('上传头像图片大小不能超过 2MB!');
            //     }
            //     return isJPG && isLt2M;
            // }
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
