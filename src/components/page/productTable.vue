<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 目前庫存</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" class="handle-del mr10" @click="newPending">多筆商品轉倉</el-button>
                <el-button type="primary" class="handle-del mr10" @click="newProduct">新增商品</el-button>
                <el-select v-model="selectLocation" placeholder="倉庫選擇" class="handle-select mr10">
                    <el-option key="1" label="全部倉庫" value=""></el-option>
                    <el-option key="2" label="美國" value="美國"></el-option>
                    <el-option key="3" label="台灣" value="台灣"></el-option>
                </el-select>
                <el-select v-model="selectType" placeholder="種類選擇" class="handle-select mr10">
                    <el-option key="1" label="全部種類" value=""></el-option>
                    <el-option key="2" label="春夏" value="春夏"></el-option>
                    <el-option key="3" label="秋冬" value="秋冬"></el-option>
                    <el-option key="4" label="包款" value="包款"></el-option>
                    <el-option key="5" label="配件" value="配件"></el-option>
                    <el-option key="6" label="鞋子" value="鞋子"></el-option>
                
                </el-select>

                <el-select v-model="selectCurrency" placeholder="貨幣選擇" class="handle-select mr10">
                    <el-option key="1" label="美金" value="美金"></el-option>
                    <el-option key="2" label="台幣" value="台幣"></el-option>
                </el-select>
                <el-input v-model="selectName" placeholder="品名查詢" class="handle-input mr10"></el-input>
                <h3>1美元 = <el-input v-model="exchange" placeholder="幣值" class="handle-exchange mr10" size="mini"></el-input>台幣</h3>
            </div>
            <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange" @sort-change='sortChange'>
                <el-table-column type="selection" min-width="55"></el-table-column>
                <el-table-column prop="pName" label="品名" min-width="50">
                </el-table-column>
                <el-table-column prop="pLocation" label="所在地" min-width="50">
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
                <el-table-column prop="pImg" label="產品圖片" min-width="80">
                    <template slot-scope="scope">
                        <el-button size="small" @click="showImg(scope.$index, scope.row)">檢視商品圖片</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="pNote" label="產品介紹" min-width="80">
                    <template slot-scope="scope">
                        <el-button size="small" @click="showNote(scope.$index, scope.row)">檢視商品介紹</el-button>
                    </template>
                </el-table-column>

                <el-table-column label="操作" min-width="150">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleProductEdit(scope.$index, scope.row)">編輯</el-button>
                        <el-button size="small" type="danger" @click="handleProductDelete(scope.$index, scope.row)">刪除</el-button>
                    </template>
                </el-table-column>
            </el-table>
             <a href="https://www.findrate.tw/bank/35/" class="el-button el-button--primary" clase target="_blank" >查詢匯率</a>
        </div>

        <el-dialog title="編輯" :visible.sync="editProductVisible" width="30%">
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
                <el-form-item label="種類">
                    <el-select v-model="form.pType">
                        <el-option key="1" label="春夏" value="春夏"></el-option>
                        <el-option key="2" label="秋冬" value="秋冬"></el-option>
                        <el-option key="3" label="包款" value="包款"></el-option>
                        <el-option key="4" label="配件" value="配件"></el-option>
                        <el-option key="5" label="鞋子" value="鞋子"></el-option>
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
                <el-form-item label="備註">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="請輸入內容" v-model="form.pNote">
                    </el-input>
                </el-form-item>
            </el-form>
            <div><template>
                <el-carousel :autoplay="false">
                    <el-carousel-item v-for="img in showImgUrl" :key="img">
                        <el-button type="danger" icon="el-icon-delete" circle  @click="handleDelImg(img)" class="delImg"></el-button>
                        <img :src="img" alt="沒有照片" width="100%" height="100%">  
                    </el-carousel-item>
                </el-carousel>
            </template></div>
           
            <el-upload
                action="/server/uploadImg"
                list-type="picture-card"
                :on-remove="handleRemove"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :file-list="[]">
                <i class="el-icon-plus"></i>
            </el-upload>
             
            <span slot="footer" class="dialog-footer">
                <el-button @click="editProductVisible = false">取消</el-button>
                <el-button type="primary" @click="saveProductEdit">確定</el-button>
            </span>
        </el-dialog>

         <el-dialog title="編輯" :visible.sync="editPendingVisible" width="30%">
            <el-form ref="form" :model="pendingItemForm" label-width="50px">
                <el-form-item label="出貨數量">
                    <el-input v-model="pendingItemForm.shipmentCnt"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editPendingVisible = false">取消</el-button>
                <el-button type="primary" @click="savePendingEdit">確定</el-button>
            </span>
        </el-dialog>

         <el-dialog title="編輯" :visible.sync="editDeclareVisible" width="30%">
            <el-form ref="form" :model="declareItemForm" label-width="50px">
                <el-form-item label="品名">
                    <el-input v-model="declareItemForm.name"></el-input>
                </el-form-item>
                <el-form-item label="數量">
                    <el-input v-model="declareItemForm.quantity"></el-input>
                </el-form-item>
                <el-form-item label="單價">
                    <el-input v-model="declareItemForm.price"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDeclareVisible = false">取消</el-button>
                <el-button type="primary" @click="saveDeclareEdit">確定</el-button>
            </span>
        </el-dialog>

        <!-- Build form for new product -->
        <el-dialog title="建立新商品" :visible.sync="newProductVisible" width="30%">
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
                
                <el-form-item label="種類">
                    <el-select v-model="form.pType">
                        <el-option key="1" label="春夏" value="春夏"></el-option>
                        <el-option key="2" label="秋冬" value="秋冬"></el-option>
                        <el-option key="3" label="包款" value="包款"></el-option>
                        <el-option key="4" label="配件" value="配件"></el-option>
                        <el-option key="5" label="鞋子" value="鞋子"></el-option>
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
                <el-form-item label="備註">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="請輸入內容" v-model="form.pNote">
                    </el-input>
                </el-form-item>
            </el-form>
            <el-upload
                action="/server/uploadImg"
                list-type="picture-card"
                :on-remove="handleRemove"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :file-list="[]">
                <i class="el-icon-plus"></i>
            </el-upload>
            <span slot="footer" class="dialog-footer">
                <el-button @click="newProductVisible = false">取消</el-button>
                <el-button type="primary" @click="saveNewProduct">確定</el-button>
            </span>
        </el-dialog>

        <!-- Build pending list form -->
        <el-dialog title="建立新轉運單" :visible.sync="newPendingVisible" width="30%">
            <h3> {{pendingForm.origin}} -> {{pendingForm.destination}} </h3>
            <el-form ref="form" :model="form" label-width="50px">
                <el-form-item label="tracking">
                    <el-input v-model="pendingForm.trackingNo"></el-input>
                </el-form-item>
                <el-form-item label="稅金">
                    <el-input v-model="pendingForm.tax"></el-input>
                </el-form-item>
                <el-form-item label="運費">
                    <el-input v-model="pendingForm.freight"></el-input>
                </el-form-item>
                <el-form-item label="日期">
                    <el-col :span="11">
                        <el-date-picker type="date" placeholder="選擇日期" v-model="pendingForm.date" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
            </el-form>
            <el-table :data="pendingForm.productList" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="name" label="品名" min-width="50">
                </el-table-column>
                <el-table-column prop="shipmentCnt" label="出貨數量" min-width="50">
                </el-table-column>
                <el-table-column prop="size" label="尺寸" min-width="50">
                </el-table-column>
                <el-table-column prop="color" label="顏色" min-width="50">
                </el-table-column>
                <el-table-column label="操作" min-width="100">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handlePendingEdit(scope.$index, scope.row)">編輯</el-button>
                        <el-button size="small" type="danger" @click="handlePendingDelete(scope.$index, scope.row)">刪除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="primary" class="handle-del mr10" @click="newDeclare">建立申報單</el-button>
            <span slot="footer" class="dialog-footer">
                <el-button @click="newPendingVisible = false">取消</el-button>
                <el-button type="primary" @click="saveNewPending">確定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="建立申報單" :visible.sync="newDeclareVisible" width="30%">
            <el-button type="primary" class="handle-del mr10" @click="newDeclareItem">新增項目</el-button>
            <el-table :data="declareForm.itemList" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="name" label="品名" min-width="50">
                </el-table-column>
                <el-table-column prop="quantity" label="數量" min-width="50">
                </el-table-column>
                <el-table-column prop="price" label="單價" min-width="50">
                </el-table-column>
                <el-table-column prop="total" label="總額" min-width="50">
                </el-table-column>
                <el-table-column label="操作" min-width="100">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleDeclareEdit(scope.$index, scope.row)">編輯</el-button>
                        <el-button size="small" type="danger" @click="handleDeclareDelete(scope.$index, scope.row)">刪除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <h3>Total : {{declareForm.amount}}</h3>
            <span slot="footer" class="dialog-footer">
                <el-button @click="newDeclareVisible = false">取消</el-button>
                <el-button type="primary" @click="saveNewDeclare">確定</el-button>
            </span>
        </el-dialog>


        <el-dialog title="新增項目" :visible.sync="newDeclareItemVisible" width="30%">
            <el-form ref="form" :model="decalreItem" label-width="50px">
                <el-form-item label="品名">
                    <el-input v-model="decalreItem.name"></el-input>
                </el-form-item>
        
                <el-form-item label="數量">
                    <el-input v-model="decalreItem.quantity"></el-input>
                </el-form-item>
                <el-form-item label="售價">
                    <el-input v-model="decalreItem.price"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="newDeclareItemVisible = false">取消</el-button>
                <el-button type="primary" @click="saveNewDeclareItem">確定</el-button>
            </span>
        </el-dialog>


        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delProductVisible" width="300px" center>
            <div class="del-dialog-cnt">刪除不可恢復,確定是否刪除</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delProductVisible = false">取消</el-button>
                <el-button type="primary" @click="deleteProductRow">確定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="提示" :visible.sync="delPendingVisible" width="300px" center>
            <div class="del-dialog-cnt">刪除不可恢復,確定是否刪除</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delPendingVisible = false">取消</el-button>
                <el-button type="primary" @click="deletePendingRow">確定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="提示" :visible.sync="delDeclareVisible" width="300px" center>
            <div class="del-dialog-cnt">刪除不可恢復,確定是否刪除</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delDeclareVisible = false">取消</el-button>
                <el-button type="primary" @click="deleteDeclareRow">確定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="提示" :visible.sync="delImgVisible" width="300px" center>
            <div class="del-dialog-cnt">刪除不可恢復,確定是否刪除</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delImgVisible = false">取消</el-button>
                <el-button type="primary" @click="deleteImgRow">確定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="商品介紹" :visible.sync="showNoteVisible" width="40%" center>
            <div><el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="沒有內容" :disabled="true" v-model="note">
            </el-input></div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showNoteVisible = false">關閉</el-button>
            </span>

        </el-dialog>

        <el-dialog title="商品照片" :visible.sync="showImgVisible" width="40%" center>
            <div><template>
                <div>
                    <el-carousel :autoplay="false">
                        <el-carousel-item v-for="img in showImgUrl" :key="img">
                            <img :src="img" alt="沒有照片" width="100%" height="100%">
                        </el-carousel-item>
                    </el-carousel>
                </div>
                
            </template></div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showImgVisible = false">關閉</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'basetable',
        data() {
            return {
                debugMode: false,
                url: '/server/getStorageList',
                storageList: [],
                tableData: [],
                multipleSelection: [],
                selectLocation: '',
                selectType: '',
                selectName: '',
                selectCurrency: '美金',
                exchange: 30,

                editProductVisible: false,
                delProductVisible: false,
                editPendingVisible: false,
                delPendingVisible: false,
                editDeclareVisible: false,
                delDeclareVisible: false,
                newProductVisible: false,
                newPendingVisible: false,
                newDeclareVisible: false,
                newDeclareItemVisible: false,
                showNoteVisible: false,
                showImgVisible: false,
                delImgVisible: false,

                form: {
                    pid: '',
                    pName: '',
                    pLocation: '',
                    pType: '',
                    pCost: 0,
                    pPrice: 0,
                    pQuantity: 0,
                    pSize: '',
                    pColor: '',
                    pImg: {
                        list: []
                    },
                    pNote:''
                },
                idx: -1,
                tableLength: -1,

                sortKey: '',
                sortOrder: '',
                isSort: false,
                pageSize: 10,

                pendingForm: {
                    origin: '',
                    destination: '',
                    trackingNo: '',
                    tax: '',
                    freight: '',
                    date: '',
                    productList:[],
                    declareForm:{
                        itemList: [],
                        amount: 0
                    }
                },

                pendingItemForm: {
                    pid: '',
                    name: '',
                    shipmentCnt:'',
                    color: '',
                    size: '',
                    cost: '',
                    price: '',
                    type: '',
                    img: '',
                    note: ''
                },

                decalreItem:{
                    name:'',
                    quantity:'',
                    price:''
                },

                declareForm:{
                    itemList: [],
                    amount: 0
                },

                declareItemForm:{
                    name:'',
                    quantity:'',
                    price:''
                },

                note: '',
                imageUrl: [],
                showImgUrl: [],
                delImg: '',
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                // we need to parse again to avoid object reference
                this.tableData = JSON.parse(JSON.stringify(this.storageList)).filter((d) => {
                    if(this.selectLocation != '' && d.pName.indexOf(this.selectName) > -1){
                        if(this.selectType == '' && d.pName.indexOf(this.selectName) > -1){
                            if(this.selectLocation == d.pLocation && d.pName.indexOf(this.selectName) > -1) return d;
                        }else{
                            if((this.selectLocation == d.pLocation) && (this.selectType==d.pType) && d.pName.indexOf(this.selectName) > -1) return d;
                        }
                    }else{
                        if(this.selectType == '' && d.pName.indexOf(this.selectName) > -1){
                            return d;
                        }else{
                            if(this.selectType==d.pType && d.pName.indexOf(this.selectName) > -1) return d;
                        }
                    }
                });
                if(this.selectCurrency == '台幣'){
                    for(var i=0; i<this.tableData.length; i++){
                        this.tableData[i].pCost = this.storageList[i].pCost * this.exchange;
                        this.tableData[i].pPrice = this.storageList[i].pPrice * this.exchange;
                    }
                    console.log(this.storageList[0].pCost);
                }else{
                    for(var i=0; i<this.tableData.length; i++){
                        this.tableData[i].pCost = this.storageList[i].pCost;
                        this.tableData[i].pPrice = this.storageList[i].pPrice;
                    }
                }
                this.tableLength = this.tableData.length;
                return this.tableData;
            }
        },
        methods: {
            getData() {    
                this.url = '/server/getStorageList';
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
                if(this.debugMode) console.log(item.pid);
                this.url = '/server/updateStorageList';
                item.uploadList = this.imageUrl;
                this.$axios.post(this.url, item).then((res) => {
                    console.log(res);
                    if(res.data.errCode === 0) {
                        this.getData();
                    }
                });
            },
            delData(pid){
                this.url = '/server/delStorageList';
                this.$axios.post(this.url, {
                   pid:pid
                }).then((res) => {});
            },
            insertData(item){
                this.url = '/server/insertStorageList';
                if(this.debugMode) console.log(item);
                item.uploadList = this.imageUrl;
                this.$axios.post(this.url,item).then((res) => {});
                
            },

            addPendingForm(pendingForm){
                this.url = '/server/addPendingForm';
                if(this.debugMode) console.log(pendingForm);
                this.$axios.post(this.url,pendingForm).then((res) => {});
            },

            deleteImg(delImg , pid){
                this.url = '/server/delImg';
                delImg = delImg.replace("http://127.0.0.1:3000/",""),
                console.log(delImg);
                this.$axios.post(this.url,{
                    delImg: delImg,
                    pid: pid
                }).then((res) => {
                    if(res.data.errCode === 0) {
                        this.getData();
                    }
                });
            },

            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },

            calAmount(){
                this.pendingForm.declareForm.amount = 0;
                for(var i=0; i<this.declareForm.itemList.length; i++){
                    this.declareForm.amount += this.declareForm.itemList[i].total;
                }    
            },

            handleProductEdit(index, row) {
                this.idx = this.storageList.findIndex(x=>x.pid==row.pid);
                console.log(row.pid);
                const item = this.storageList[this.idx];
                this.imageUrl = [];
                this.showImgUrl = [];
                var imgList = JSON.parse(row.pImg).list;
                for(var i=0; i<imgList.length; i++){
                    this.showImgUrl.push("http://127.0.0.1:3000/"+imgList[i]);
                }
                this.form = {
                    pid: item.pid,
                    pName: item.pName,
                    pLocation: item.pLocation,
                    pType: item.pType,
                    pCost: item.pCost,
                    pPrice: item.pPrice,
                    pQuantity: item.pQuantity,
                    pSize: item.pSize,
                    pColor: item.pColor,
                    pImg: item.pImg,
                    pNote: item.pNote
                }
                this.editProductVisible = true;
            },

            handlePendingEdit(index, row) {
                this.idx = this.pendingForm.productList.findIndex(x=>x.pid==row.pid);
                const item = this.pendingForm.productList[this.idx];
                this.pendingItemForm = {
                    pid: item.pid,
                    name: item.name,
                    color: item.color,
                    size: item.size,
                    shipmentCnt: item.shipmentCnt,
                    cost: item.cost,
                    price: item.price,
                    type: item.type,
                    img: item.img,
                    note: item.note
                }
                this.editPendingVisible = true;
            },

            handleDeclareEdit(index, row) {
                this.idx = index;
                const item = this.declareForm.itemList[this.idx];
                this.declareItemForm = {
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                }
                this.editDeclareVisible = true;
            },
            newProduct() {
                this.imageUrl = [];
                this.form = {
                    pid: '',
                    pName: '',
                    pLocation: '',
                    pType: '',
                    pCost: 0,
                    pPrice: 0,
                    pQuantity: 0,
                    pSize: '',
                    pColor: '',
                    pImg: {
                        list: []
                    },
                    pNote: ''
                }
                this.newProductVisible = true;
            },

            newDeclare() {
                this.declareForm = {
                    itemList: [],
                    amount: 0
                }
                
                this.newDeclareVisible = true;
            },

            newDeclareItem() {
                this.decalreItem = {
                    name: '',
                    quantity: '',
                    price: ''
                }
                this.newDeclareItemVisible = true;
            },

            showNote(index , row){
                this.note = row.pNote;
                this.showNoteVisible = true;
            },

            showImg(index , row){
                this.showImgUrl = [];
                var imgList = JSON.parse(row.pImg).list;
                console.log(imgList);
                for(var i=0; i<imgList.length; i++){
                    this.showImgUrl.push("http://127.0.0.1:3000/"+imgList[i]);
                }
                this.showImgVisible = true;
            },

            handleProductDelete(index, row) {
                this.idx = this.storageList.findIndex(x=>x.pid==row.pid);
                this.delProductVisible = true;
            },
            handlePendingDelete(index, row) {
                this.idx = this.pendingForm.productList.findIndex(x=>x.pid==row.pid);
                this.delPendingVisible = true;
            },
            handleDeclareDelete(index, row) {
                this.idx = index;
                this.delDeclareVisible = true;
            },
            handleDelImg(img){
                this.delImg = img;
                this.delImgVisible = true;
            },
            newPending() {
                const length = this.multipleSelection.length;
                console.log(this.multipleSelection);
                //check location is the same
                if(length === 0) this.$message.error(`請選擇商品`);
                else{
                    var location = this.multipleSelection[0].pLocation;   
                    var sameLoc = true;
                    for(var i=0; i<length; i++){
                        if(this.multipleSelection[i].pLocation != location) sameLoc = false;
                    }
                    if(sameLoc == false) this.$message.error(`請選擇相同地點商品`);
                    else{
                        this.pendingForm = {
                            origin: '',
                            destination: '',
                            trackingNo: '',
                            tax: '',
                            freight: '',
                            date: '',
                            productList:[],
                            declareForm:{
                                itemList: [],
                                amount: 0
                            }  
                        }
                        // 先做單頁
                        this.newPendingVisible = true;
                        this.pendingForm.origin = this.multipleSelection[0].pLocation;
                        if(this.pendingForm.origin == "美國"){
                            this.pendingForm.destination = "台灣";
                        }else if(this.pendingForm.origin == "台灣"){
                            this.pendingForm.destination = "美國"
                        }
                        this.pendingForm.productList = [];
                        for(var i=0; i<length; i++){
                            this.pendingForm.productList.push(
                                {
                                    pid: this.multipleSelection[i].pid,
                                    name: this.multipleSelection[i].pName,
                                    type: this.multipleSelection[i].pType,
                                    shipmentCnt: 0,
                                    size: this.multipleSelection[i].pSize,
                                    color: this.multipleSelection[i].pColor,
                                    price: this.multipleSelection[i].pPrice,
                                    cost: this.multipleSelection[i].pCost,
                                    img: this.multipleSelection[i].pImg,
                                    note: this.multipleSelection[i].pNote
                                });
                        }
                        if(this.debugMode) console.log(this.pendingForm.productList);
                    }
                    
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveProductEdit() {
                if(this.checkNewProduct() == false) this.$message.error(`表單尚未填完或格式有誤`);
                else{
                    this.editData(this.form);
                    this.$set(this.storageList, this.idx, this.form);
                    if(this.debugMode) console.log(this.storageList[this.idx]);
                    this.editProductVisible = false;
                    this.$message.success(`修改成功`);
                }
            },

            savePendingEdit() {
                if(this.checkShipment()){
                    this.$set(this.pendingForm.productList, this.idx, this.pendingItemForm);
                    this.editPendingVisible = false;
                    this.$message.success(`修改成功`);
                }
            },

            saveDeclareEdit() {
        
                this.$set(this.declareForm.itemList, this.idx, {
                    name: this.declareItemForm.name,
                    quantity: this.declareItemForm.quantity,
                    price: this.declareItemForm.price,
                    total: this.declareItemForm.quantity*this.declareItemForm.price
                });
                this.calAmount();
                this.editDeclareVisible = false;
                this.$message.success(`修改成功`);
            },

            saveNewProduct() {
                //console.log(this.checkNewProduct().toString());
                if(this.checkNewProduct()){
                    this.insertData(this.form);
                    this.newProductVisible = false;
                    this.$message.success(`新增成功`);
                    this.getData();
                }
            },


            saveNewPending() {
                if(this.checkNewPending()){
                    this.addPendingForm(this.pendingForm);
                    for(var i=0; i<this.pendingForm.productList.length; i++){
                        var idx = this.storageList.findIndex(x=>x.pid==this.pendingForm.productList[i].pid);
                        this.storageList[idx].pQuantity -= this.pendingForm.productList[i].shipmentCnt;
                    }
                    this.newPendingVisible = false;
                    this.$message.success(`新增成功`);
                }
            },

            saveNewDeclare() {
                this.pendingForm.declareForm = this.declareForm;
                this.newDeclareVisible = false;
                this.$message.success(`新增成功`);
            },

            saveNewDeclareItem() {
                this.declareForm.itemList.push({
                    name: this.decalreItem.name,
                    quantity: this.decalreItem.quantity,
                    price: this.decalreItem.price,
                    total: this.decalreItem.quantity*this.decalreItem.price
                });
                this.calAmount();   
                this.newDeclareItemVisible = false;
                this.$message.success(`新增成功`);
            },

            deleteProductRow(){
                this.delData(this.storageList[this.idx].pid);
                this.storageList.splice(this.idx, 1);
                this.$message.success('刪除成功');
                this.delProductVisible = false;
            },

            deletePendingRow(){
                this.pendingForm.productList.splice(this.idx, 1);
                this.$message.success('刪除成功');
                this.delPendingVisible = false;
            },

            deleteDeclareRow(){
                this.declareForm.itemList.splice(this.idx, 1);
                this.calAmount();
                this.$message.success('刪除成功');
                this.delDeclareVisible = false;
            },

            deleteImgRow(){
                var index = this.showImgUrl.indexOf(this.delImg);
                if (index > -1) {
                    this.showImgUrl.splice(index, 1);
                }
                this.deleteImg(this.delImg,this.form.pid);
                this.$message.success('刪除成功');
                this.delImgVisible = false;
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
            },

            checkNewProduct(){
                if(this.form.pName == '') {
                    this.$message.error(`請填入品名`);
                    return false;
                }
                if(this.form.pLocation == ''){
                    this.$message.error(`請填入倉庫`);
                    return false;
                }
                if(this.form.pType == '') {
                    this.$message.error(`請填入種類`);
                    return false;
                }
                if(isNaN(this.form.pCost)) {
                    this.$message.error(`請填入成本`);
                    return false;
                }
                if(isNaN(this.form.pPrice)) {
                    this.$message.error(`請填入售價`);
                    return false;
                }
                if(isNaN(this.form.pQuantity)) {
                    this.$message.error(`請填入數量`);
                    return false;
                }
                if(this.form.pColor == ''){
                    this.$message.error(`請填入顏色`);
                    return false;
                }
                if(this.form.pSize == '') {
                    this.$message.error(`請填入尺寸`);
                    return false;
                }
                if(!isNaN(this.form.pCost) && this.form.pCost < 0){
                    this.$message.error(`成本不能小於0`);
                    return false;
                }
                if(!isNaN(this.form.pPrice) && this.form.pPrice < 0){
                    this.$message.error(`售價不能小於0`);
                    return false;
                }
                if(!isNaN(this.form.pQuantity) && this.form.pQuantity < 0){
                    this.$message.error(`數量不能小於0`);
                    return false;
                }
                return true;
            },

            checkNewPending(){
                if(this.pendingForm.trackingNo == '') {
                    this.$message.error(`請填入Track`);
                    return false;
                }
                if(this.pendingForm.date == '') {
                    this.$message.error(`請填入日期`);
                    return false;
                }
                if(isNaN(this.pendingForm.tax)) {
                    this.$message.error(`請填入稅金`);
                    return false;
                }
                if(isNaN(this.pendingForm.freight)) {
                    this.$message.error(`請填入運費`);
                    return false;
                }
                if(!isNaN(this.pendingForm.tax) && this.pendingForm.tax < 0){
                    this.$message.error(`稅金不能小於0`);
                    return false;
                }
                if(!isNaN(this.pendingForm.freight) && this.pendingForm.freight < 0){
                    this.$message.error(`運費不能小於0`);
                    return false;
                }
                return true;
            },

            checkShipment(){
                var idx = this.storageList.findIndex(x=>x.pid==this.pendingForm.productList[this.idx].pid);
                if(isNaN(this.pendingItemForm.shipmentCnt)) {
                    this.$message.error(`表單尚未填完或格式有誤`);
                    return false;
                }
                if(!isNaN(this.pendingItemForm.shipmentCnt) && this.storageList[idx].pQuantity - this.pendingItemForm.shipmentCnt < 0){
                     this.$message.error(`庫存不足`);
                     return false;
                }
                if(!isNaN(this.pendingItemForm.shipmentCnt) && this.pendingItemForm.shipmentCnt < 0){
                     this.$message.error(`出貨數量不能小於0`);
                     return false;
                }
                return true;
            },

            handleAvatarSuccess(res, file) {
                if(this.debugMode) console.log(file);

                this.imageUrl.push(file.response.img);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('請上傳.jpg照片');
                }
                if (!isLt2M) {
                    this.$message.error('上傳照片請不要超過2MB');
                }
                return isJPG && isLt2M;
            },

            handleRemove(file, fileList) {
                var index = this.imageUrl.indexOf(file.response.img);
                if (index > -1) {
                    this.imageUrl.splice(index, 1);
                }
                //if(this.debugMode) 
                console.log(this.imageUrl);
            },
            test(){
                console.log("fking awesome");
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
    .handle-exchange {
        width: 100px;
    }
    .delImg{
        position:absolute;
        right:10px;
        top: 10px;
    }

</style>
