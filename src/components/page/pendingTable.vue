<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 轉倉單列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="selectStatus" placeholder="狀態選擇" class="handle-select mr10">
                    <el-option key="1" label="全部表單" value=""></el-option>
                    <el-option key="2" label="運送中" value="運送中"></el-option>
                    <el-option key="3" label="已抵達" value="已抵達"></el-option>
                </el-select>
            </div>
            <el-table :data="data" border style="width: 100%" ref="multipleTable" @sort-change='sortChange'>
                <el-table-column prop="trackingNo" label="Tracking" min-width="50">
                </el-table-column>
                <el-table-column prop="tax" label="稅金" min-width="50">
                </el-table-column>
                <el-table-column prop="freight" label="運費" min-width="50">
                </el-table-column>
                <el-table-column prop="date" label="日期" min-width="50">
                </el-table-column>
                <el-table-column prop="origin" label="起始點" min-width="50">
                </el-table-column>
                <el-table-column prop="destination" label="終點" min-width="50">
                </el-table-column>
                <el-table-column label="商品列表" min-width="70">
                    <template slot-scope="scope">
                        <el-button size="small" @click="showProduct(scope.$index, scope.row)">檢視商品列表</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="商品列表" min-width="70">
                    <template slot-scope="scope">
                        <el-button size="small" @click="showDeclareForm(scope.$index, scope.row)">檢視申報單</el-button>
                    </template>
                </el-table-column>

                <el-table-column prop="status" label="狀態" min-width="50">
                </el-table-column>
                <el-table-column label="操作" min-width="180">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="handleArrive(scope.$index, scope.row)">確認抵達</el-button>
                        <el-button size="small" type="primary" @click="handleCancel(scope.$index, scope.row)">取消轉倉</el-button>
                        <el-button size="small" type="danger" @click="handlePendingDelete(scope.$index, scope.row)">刪除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="tableLength">
                </el-pagination>
            </div>
        </div>

        <!-- show product list -->
        <el-dialog title="商品列表" :visible.sync="showProductVisible" width="30%">
            <el-table :data="productList" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="name" label="品名" min-width="50">
                </el-table-column>
                <el-table-column prop="shipmentCnt" label="出貨數量" min-width="50">
                </el-table-column>
                <el-table-column prop="size" label="尺寸" min-width="50">
                </el-table-column>
                <el-table-column prop="color" label="顏色" min-width="50">
                </el-table-column>
            </el-table>            
            <span slot="footer" class="dialog-footer">
                <el-button @click="showProductVisible = false">關閉</el-button>
            </span>
        </el-dialog>

        <el-dialog title="申報單" :visible.sync="showDeclareVisible" width="30%">
            <el-table :data="declareForm.itemList" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="name" label="品名" min-width="50">
                </el-table-column>
                <el-table-column prop="quantity" label="數量" min-width="50">
                </el-table-column>
                <el-table-column prop="price" label="單價" min-width="50">
                </el-table-column>
                <el-table-column prop="total" label="總額" min-width="50">
                </el-table-column>
            </el-table>
            <h3>Total : {{declareForm.amount}}</h3>            
            <span slot="footer" class="dialog-footer">
                <el-button @click="showDeclareVisible = false">關閉</el-button>
            </span>
        </el-dialog>



        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delPendingVisible" width="300px" center>
            <div class="del-dialog-cnt">刪除不可恢復,確定是否刪除</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delPendingVisible = false">取消</el-button>
                <el-button type="primary" @click="deletePendingRow">確定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="提示" :visible.sync="confirmPendingVisible" width="300px" center>
            <div class="del-dialog-cnt">確定物品已抵達</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="confirmPendingVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmPendingRow">確定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="提示" :visible.sync="cancelPendingVisible" width="300px" center>
            <div class="del-dialog-cnt">取消轉倉</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelPendingVisible = false">取消</el-button>
                <el-button type="primary" @click="cancelPendingRow">確定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'basetable',
        data() {
            return {
                debugMode: true,
                url: '/server/getPendingList',
                pendingList: [],
                tableData: [],
                cur_page: 1,

                selectStatus: '',
        
                curPendingID: -1,
                idx: -1,
                tableLength: -1,

                sortKey: '',
                sortOrder: '',
                isSort: false,
                pageSize: 10,

                showProductVisible: false,
                showDeclareVisible: false,
                confirmPendingVisible: false,
                delPendingVisible: false,
                cancelPendingVisible: false,

                productList: [],
                declareForm:{
                    itemList: [],
                    amount: 0
                },

            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                this.tableData = this.pendingList.filter((d) => {
                    if(this.selectStatus == ''){
                        return d;
                    }else{
                        if(this.selectStatus == d.status) return d;
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
            getData() {    
                this.url = '/server/getPendingList';
                this.$axios.post(this.url, {
                    isSort: this.isSort,
                    sortKey: this.sortKey,
                    sortOrder: this.sortOrder
                }).then((res) => {
                    this.pendingList = res.data;
                    if(this.debugMode) console.log(this.pendingList);
                });
            },

            confirmArrive(pendingID){
                this.url = '/server/confirmArrive';
                this.$axios.post(this.url, {
                    pendingID: pendingID,
                }).then((res) => {
                    
                });
            },

            cancelPending(pendingID){
                this.url = '/server/cancelPending';
                this.$axios.post(this.url, {
                    pendingID: pendingID,
                }).then((res) => {
                    
                });
            },

            delPendingForm(pendingID){
                this.url = '/server/delPendingForm';
                this.$axios.post(this.url, {
                    pendingID: pendingID,
                }).then((res) => {
                    
                });
            },

            showProduct(index,row){

                this.idx = this.pendingList.findIndex(x=>x.pendingID==row.pendingID);
                console.log(this.idx);
                this.productList = this.pendingList[this.idx].productList;
                this.showProductVisible = true;
            },

            showDeclareForm(index,row){
                this.idx = this.pendingList.findIndex(x=>x.pendingID==row.pendingID);
                this.declareForm = this.pendingList[this.idx].declareForm;
                console.log(this.declareForm);
                this.showDeclareVisible = true;
            },

            handlePendingDelete(index, row) {
                this.curPendingID = row.pendingID;
                this.idx = this.pendingList.findIndex(x=>x.pendingID==row.pendingID);
                this.delPendingVisible = true;
            },

            deletePendingRow(){
                this.delPendingForm(this.curPendingID);
                this.pendingList.splice(this.idx, 1);
                this.$message.success('刪除成功');
                this.delPendingVisible = false;
            },

            handleArrive(index,row){
                this.curPendingID = row.pendingID;
                this.idx = this.pendingList.findIndex(x=>x.pendingID==row.pendingID);
                if(this.pendingList[this.idx].status == "已抵達") this.$message.error('已運送成功');
                else this.confirmPendingVisible = true;
            },

            handleCancel(index,row){
                this.curPendingID = row.pendingID;
                this.idx = this.pendingList.findIndex(x=>x.pendingID==row.pendingID);
                if(this.pendingList[this.idx].status == "已抵達") this.$message.error('已運送成功');
                else this.cancelPendingVisible = true;
            },

            confirmPendingRow(){
                this.confirmArrive(this.curPendingID);
                this.pendingList[this.idx].status = "已抵達"; 
                this.confirmPendingVisible = false;
                this.$message.success('物品以抵達');
            },

            cancelPendingRow(){
                this.cancelPending(this.curPendingID);
                this.pendingList.splice(this.idx, 1);
                this.$message.success('取消成功');
                this.cancelPendingVisible = false;
            },

            sortChange:function(column,prop,order){
                this.isSort = true;
                this.sortOrder = column.order;
                this.sortKey = column.prop;
                if(this.debugMode){
                    console.log(column);
                    console.log(column.prop);
                    console.log(column.order);
                }
                this.getData();
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
