<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 銷售單列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="selectStatus" placeholder="狀態選擇" class="handle-select mr10">
                    <el-option key="1" label="全部表單" value=""></el-option>
                    <el-option key="2" label="銷售中" value="銷售中"></el-option>
                    <el-option key="3" label="已銷售" value="已銷售"></el-option>
                </el-select>
            </div>
            <div>
                <el-input v-model="selectYear" placeholder="年份查詢" class="handle-input mr10"></el-input>
                <el-select v-model="selectMonth" placeholder="月份選擇" class="handle-select mr10">
                    <el-option key="1" label="全部月份" value=""></el-option>
                    <el-option key="2" label="1月" value="1"></el-option>
                    <el-option key="3" label="2月" value="2"></el-option>
                    <el-option key="4" label="3月" value="3"></el-option>
                    <el-option key="5" label="4月" value="4"></el-option>
                    <el-option key="6" label="5月" value="5"></el-option>
                    <el-option key="7" label="6月" value="6"></el-option>
                    <el-option key="8" label="7月" value="7"></el-option>
                    <el-option key="9" label="8月" value="8"></el-option>
                    <el-option key="10" label="9月" value="9"></el-option>
                    <el-option key="11" label="10月" value="10"></el-option>
                    <el-option key="12" label="11月" value="11"></el-option>
                    <el-option key="13" label="12月" value="12"></el-option>
                </el-select>
            </div>
            <el-table :data="data" border style="width: 100%" ref="multipleTable" @sort-change='sortChange'>

                <el-table-column prop="date" label="日期" min-width="50">
                </el-table-column>

                <el-table-column label="商品列表" min-width="70">
                    <template slot-scope="scope">
                        <el-button size="small" @click="showProduct(scope.$index, scope.row)">檢視商品列表</el-button>
                    </template>
                </el-table-column>

                <el-table-column prop="totalProfit" label="總利潤" min-width="50">
                </el-table-column>

                <el-table-column prop="totalCost" label="總成本" min-width="50">
                </el-table-column>

                <el-table-column prop="status" label="狀態" min-width="50">
                </el-table-column>
                <el-table-column label="操作" min-width="180">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="handleSale(scope.$index, scope.row)">確認銷售</el-button>
                        <el-button size="small" type="success" @click="handleCancel(scope.$index, scope.row)">取消銷售</el-button>
                        <el-button size="small" type="danger" @click="handleSaleDelete(scope.$index, scope.row)">刪除</el-button>
                    </template>
                </el-table-column>

                <el-table-column prop="note" label="備註" min-width="80">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleShowNote(scope.$index, scope.row)">檢視備註</el-button>
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
                <el-table-column prop="location" label="倉庫" min-width="50">
                </el-table-column>
                <el-table-column prop="cost" label="成本" min-width="50">
                </el-table-column>
                <el-table-column prop="price" label="售價" min-width="50">
                </el-table-column>
                <el-table-column prop="quantity" label="銷售數量" min-width="50">
                </el-table-column>
                <el-table-column prop="size" label="尺寸" min-width="50">
                </el-table-column>
                <el-table-column prop="color" label="顏色" min-width="50">
                </el-table-column>
                <el-table-column prop="profit" label="利潤" min-width="50">
                </el-table-column>
            </el-table>            
            <span slot="footer" class="dialog-footer">
                <el-button @click="showProductVisible = false">關閉</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delSaleVisible" width="300px" center>
            <div class="del-dialog-cnt">刪除不可恢復,確定是否刪除</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delSaleVisible = false">取消</el-button>
                <el-button type="primary" @click="deleteSaleRow">確定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="提示" :visible.sync="confirmSaleVisible" width="300px" center>
            <div class="del-dialog-cnt">確定物品已銷售</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="confirmSaleVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmSaleRow">確定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="提示" :visible.sync="cancelSaleVisible" width="300px" center>
            <div class="del-dialog-cnt">取消銷售</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelSaleVisible = false">取消</el-button>
                <el-button type="primary" @click="cancelSaleRow">確定</el-button>
            </span>
        </el-dialog>

         <el-dialog title="備註" :visible.sync="showNoteVisible" width="40%" center>
            <div><el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="沒有內容" :disabled="true" v-model="note">
            </el-input></div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showNoteVisible = false">關閉</el-button>
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
                url: '/server/getSaleList',
                saleList: [],
                tableData: [],
                cur_page: 1,

                selectStatus: '',
                selectYear : '',
                selectMonth : '',
        
                curSaleId: -1,
                idx: -1,
                tableLength: -1,

                sortKey: '',
                sortOrder: '',
                isSort: false,
                pageSize: 10,

                showProductVisible: false,
                showDeclareVisible: false,
                confirmSaleVisible: false,
                delSaleVisible: false,
                cancelSaleVisible: false,
                editSaleVisible: false,
                showNoteVisible: false,

                productList: [],

                editForm: {
                    tax: 0,
                    freight: 0
                },

                note: '',

            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                this.tableData = this.saleList.filter((d) => {
                    var dateArr = d.date.split('/');
                    if(this.selectStatus === '' && dateArr[0].indexOf(this.selectYear) > -1 && dateArr[1].indexOf(this.selectMonth) > -1){
                        return d;
                    }else{
                        if(this.selectStatus === d.status && dateArr[0].indexOf(this.selectYear) > -1 && dateArr[1].indexOf(this.selectMonth) > -1) return d;
                    }
                });
                
                this.tableLength = this.tableData.length;
                return this.tableData.slice(this.pageSize*(this.cur_page-1), (this.pageSize*this.cur_page));
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.cur_page = val;
            },
/***********************************************************************************************/
/*ajax*/
            getData() {    
                this.url = '/server/getSaleList';
                this.$axios.post(this.url, {
                    isSort: this.isSort,
                    sortKey: this.sortKey,
                    sortOrder: this.sortOrder
                }).then((res) => {
                    this.saleList = res.data;
                    if(this.debugMode) console.log(this.saleList);
                });
            },

            confirmSale(id){
                this.url = '/server/confirmSale';
                this.$axios.post(this.url, {
                    id: id,
                }).then((res) => {
                    if(res.data.errCode === 0) {
                        this.getData();
                        this.$message.success(`物品銷售成功`);
                    }
                });
            },

            cancelSale(id){
                this.url = '/server/cancelSale';
                this.$axios.post(this.url, {
                    id: id,
                }).then((res) => {
                    if(res.data.errCode === 0) {
                        this.getData();
                        this.$message.success(`取消成功`);
                    }
                });
            },

            delSaleForm(id){
                this.url = '/server/delSaleForm';
                this.$axios.post(this.url, {
                    id: id,
                }).then((res) => {
                    if(res.data.errCode === 0) {
                        this.getData();
                        this.$message.success(`刪除成功`);
                    }
                });
            },

/***********************************************************************************************/
/*show dialog*/
            handleShowNote(index , row){
                this.note = row.note;
                this.showNoteVisible = true;
            },

            showProduct(index,row){
                this.productList = row.productList;
                this.showProductVisible = true;
            },

            handleSaleDelete(index, row) {
                this.curSaleId = row.saleId;
                this.idx = this.saleList.findIndex(x=>x.saleId === row.saleId);
                this.delSaleVisible = true;
            },

            handleSale(index,row){
                this.curSaleId = row.saleId;
                this.idx = this.saleList.findIndex(x=>x.saleId===row.saleId);
                if(this.saleList[this.idx].status === "已銷售") this.$message.error('已銷售成功');
                else this.confirmSaleVisible = true;
            },

            handleCancel(index,row){
                this.curSaleId = row.saleId;
                this.idx = this.saleList.findIndex(x=>x.saleId===row.saleId);
                if(this.saleList[this.idx].status === "已銷售") this.$message.error('已銷售成功');
                else this.cancelSaleVisible = true;
            },

            // showEditSale(index, row){
            //     this.curSaleId = row.saleId;
            //     this.editForm = {
            //         origin: row.origin,
            //         destination: row.destination,
            //         trackingNo: row.trackingNo,
            //         tax: row.tax,
            //         freight: row.freight,
            //         date: row.date,
            //         productList: row.productList,
            //         declareForm: row.declareForm
            //     }
            //     this.editSaleVisible = true;
            // },
/***********************************************************************************************/

            deleteSaleRow(){
                this.delSaleForm(this.curSaleId);
                //this.$message.success('刪除成功');
                this.delSaleVisible = false;
            },

            confirmSaleRow(){
                this.confirmSale(this.curSaleId);
                this.confirmSaleVisible = false;
                //this.$message.success('物品已銷售');
            },

            cancelSaleRow(){
                this.cancelSale(this.curSaleId);
                //this.$message.success('取消成功');
                this.cancelSaleVisible = false;
            },

/************************************************************************************************/

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
            },

            // saveEditSale(){
            //     if(this.checkEditDollar()){
            //         this.updatesale(this.editForm);
            //         this.editSaleVisible = false;
            //         this.$message.success(`新增成功`);
            //     }
            // },

            // checkEditDollar(){
            //     if(isNaN(this.editForm.tax) || this.editForm.tax === '') {
            //         this.$message.error(`請填入稅金`);
            //         return false;
            //     }
            //     if(isNaN(this.editForm.freight) || this.editForm.freight === ''){
            //          this.$message.error(`請填入運費`);
            //          return false;
            //     }
            //     return true;
            // },
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
