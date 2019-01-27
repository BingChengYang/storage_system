<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 目前庫存</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" class="handle-del mr10" @click="handleNewPending">多筆商品轉倉</el-button>
                <el-button type="success" class="handle-del mr10" @click="handleSale">多筆商品銷售</el-button>
                <el-button type="warning" class="handle-del mr10" @click="handleNewProduct">新增商品</el-button>
                <el-button type="primary" class="handle-del mr10" @click="addPendingProductList">加入轉倉列表</el-button>
                <el-button type="danger" class="handle-del mr10" @click="clearPendingProductList">清除轉倉列表</el-button>
                <el-button type="primary" class="handle-del mr10" @click="addSaleProductList">加入銷售列表</el-button>
                <el-button type="danger" class="handle-del mr10" @click="clearSaleProductList">清除銷售列表</el-button>
            </div>
            <div>
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
                    <el-option key="6" label="鞋款" value="鞋款"></el-option>
                    <el-option key="7" label="帽款" value="帽款"></el-option>
                
                </el-select>

                <el-select v-model="selectCurrency" placeholder="貨幣選擇" class="handle-select mr10">
                    <el-option key="1" label="原本幣別" value=""></el-option>
                    <el-option key="2" label="美金" value="美金"></el-option>
                    <el-option key="3" label="台幣" value="台幣"></el-option>
                </el-select>
            </div>
            <div>
                <el-input v-model="selectName" placeholder="品名查詢" class="handle-input mr10"></el-input>
                <el-input v-model="selectColor" placeholder="顏色查詢" class="handle-input mr10"></el-input>
                <el-input v-model="selectSize" placeholder="尺寸查詢" class="handle-input mr10"></el-input>
                <h3>1美元 = <el-input v-model="exchange" placeholder="幣值" class="handle-exchange mr10" size="mini"></el-input>台幣</h3>
            </div>
            <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange" @sort-change='sortChange'>
                <el-table-column type="selection" min-width="55"></el-table-column>
                <el-table-column prop="pName" label="品名" min-width="100">
                </el-table-column>
                <el-table-column label="操作" min-width="120">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="handlePurchase(scope.$index, scope.row)">進貨</el-button>
                        <el-button size="small" @click="handleProductEdit(scope.$index, scope.row)">編輯</el-button>
                        <el-button size="small" type="danger" @click="handleProductDelete(scope.$index, scope.row)">刪除</el-button>
                    </template>
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
                        <el-button size="small" @click="handleShowImg(scope.$index, scope.row)">檢視商品圖片</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="pNote" label="產品介紹" min-width="80">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleShowNote(scope.$index, scope.row)">檢視商品介紹</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="tableLength">
                </el-pagination>
            </div>
             <a href="https://www.findrate.tw/bank/35/" class="el-button el-button--primary" clase target="_blank" >查詢匯率</a>
             <el-button type="warning" class="handle-del mr10" @click="handleNewProduct">新增商品</el-button>
        </div>
<!-- ==============================================編輯商品資訊================================================================ -->
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
                        <el-option key="5" label="鞋款" value="鞋款"></el-option>
                        <el-option key="6" label="帽款" value="帽款"></el-option>
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
                    <el-input v-model="form.pSize"></el-input>
                </el-form-item>
                <el-form-item label="顏色">
                    <el-input v-model="form.pColor"></el-input>
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

        <!-- ===================================Build form for new product=================================== -->
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
                        <el-option key="5" label="鞋款" value="鞋款"></el-option>
                        <el-option key="6" label="帽款" value="帽款"></el-option>
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
                    <el-input v-model="form.pSize"></el-input>
                </el-form-item>
                <el-form-item label="顏色">
                    <el-input v-model="form.pColor"></el-input>
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

        <!-- ===================================Build pending list form ===============================================================-->
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
                <el-form-item label="匯率">
                    <el-input v-model="pendingForm.exchange"></el-input>
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
            <el-button type="primary" class="handle-del mr10" @click="handleNewDeclare">建立申報單</el-button>
            <span slot="footer" class="dialog-footer">
                <el-button @click="newPendingVisible = false">取消</el-button>
                <el-button type="primary" @click="saveNewPending">確定</el-button>
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

        <el-dialog title="建立申報單" :visible.sync="newDeclareVisible" width="30%">
            <el-button type="primary" class="handle-del mr10" @click="handleNewDeclareItem">新增項目</el-button>
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


        <!--========================================== 删除提示框 =======================================================-->
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

        <el-dialog title="提示" :visible.sync="delSaleVisible" width="300px" center>
            <div class="del-dialog-cnt">刪除不可恢復,確定是否刪除</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delSaleVisible = false">取消</el-button>
                <el-button type="primary" @click="deleteSaleRow">確定</el-button>
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
        <!-- ============================================================================================================== -->

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
<!-- ==============================================進貨框=============================================== -->
        <el-dialog title="進貨" :visible.sync="showPurchaseVisible" width="30%">
            <el-form ref="form" :model="purchaseForm" label-width="50px">

                <el-form-item label="進貨數量">
                    <el-input v-model="purchaseForm.quantity"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showPurchaseVisible = false">取消</el-button>
                <el-button type="primary" @click="savePurchase">確定</el-button>
            </span>
        </el-dialog>
<!-- =================================================================================================== -->
<!-- 建立銷售表 -->
        <el-dialog title="建立銷售表" :visible.sync="newSaleVisible" width="50%">
            <el-form ref="form" :model="saleForm" label-width="50px">
                <el-form-item label="日期">
                    <el-col :span="11">
                        <el-date-picker type="date" placeholder="選擇日期" v-model="saleForm.date" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="備註">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="請輸入內容" v-model="saleForm.note">
                    </el-input>
                </el-form-item>
            </el-form>
            <el-table :data="saleForm.productList" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="name" label="品名" min-width="50">
                </el-table-column>
                <el-table-column prop="location" label="倉庫" min-width="50">
                </el-table-column>
                <el-table-column prop="price" label="售價" min-width="50">
                </el-table-column>
                <el-table-column prop="quantity" label="銷售數量" min-width="50">
                </el-table-column>
                <el-table-column prop="profit" label="利潤" min-width="50">
                </el-table-column>
                <el-table-column prop="size" label="尺寸" min-width="50">
                </el-table-column>
                <el-table-column prop="color" label="顏色" min-width="50">
                </el-table-column>
                <el-table-column label="操作" min-width="100">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleSaleEdit(scope.$index, scope.row)">編輯</el-button>
                        <el-button size="small" type="danger" @click="handleSaleDelete(scope.$index, scope.row)">刪除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="newSaleVisible = false">取消</el-button>
                <el-button type="primary" @click="saveNewSale">確定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="編輯" :visible.sync="editSaleVisible" width="30%">
            <el-form ref="form" :model="saleItemForm" label-width="50px">
                <el-form-item label="銷售數量">
                    <el-input v-model="saleItemForm.quantity"></el-input>
                </el-form-item>
                <el-form-item label="售價">
                    <el-input v-model="saleItemForm.price"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editSaleVisible = false">取消</el-button>
                <el-button type="primary" @click="saveSaleEdit">確定</el-button>
            </span>
        </el-dialog>

<!-- =================================================================================================== -->
    </div>
</template>

<script>
    export default {
        name: 'basetable',
        data() {
            return {
                cur_page: 1,
                debugMode: false,
                url: '/server/getStorageList',
                storageList: [],
                tableData: [],
                multipleSelection: [],
                selectLocation: '',
                selectType: '',
                selectName: '',
                selectCurrency: '',
                selectColor: '',
                selectSize: '',
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
                showPurchaseVisible: false,
                newSaleVisible: false,
                editSaleVisible: false,
                delSaleVisible: false,

                saleForm: {
                    date: '',
                    productList:[],
                    note: '',
                },

                saleItemForm: {
                    pid: '',
                    location: '',
                    name: '',
                    quantity: 0,
                    color: '',
                    size: '',
                    price: 0,
                    profit: 0
                },

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
                    tax: 0,
                    freight: 0,
                    date: '',
                    exchange: 1,
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

                purchaseForm: {
                    id: 0,
                    location: '',
                    cost: 0,
                    quantity: 0,
                    originQuantity: 0
                },
                waitPending: [],
                waitSale: []
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                // we need to parse again to avoid object reference
                this.tableData = JSON.parse(JSON.stringify(this.storageList)).filter((d) => {
                    if(this.selectLocation != '' && d.pName.indexOf(this.selectName) > -1 && d.pColor.indexOf(this.selectColor) > -1 && d.pSize.indexOf(this.selectSize) > -1){
                        if(this.selectType === '' && d.pName.indexOf(this.selectName) > -1 && d.pColor.indexOf(this.selectColor) > -1 && d.pSize.indexOf(this.selectSize) > -1){
                            if(this.selectLocation === d.pLocation && d.pName.indexOf(this.selectName) > -1 && d.pColor.indexOf(this.selectColor) > -1 && d.pSize.indexOf(this.selectSize) > -1) return d;
                        }else{
                            if((this.selectLocation === d.pLocation) && (this.selectType === d.pType) && d.pName.indexOf(this.selectName) > -1 && d.pColor.indexOf(this.selectColor) > -1 && d.pSize.indexOf(this.selectSize) > -1) return d;
                        }
                    }else{
                        if(this.selectType === '' && d.pName.indexOf(this.selectName) > -1 && d.pColor.indexOf(this.selectColor) > -1 && d.pSize.indexOf(this.selectSize) > -1){
                            return d;
                        }else{
                            if(this.selectType===d.pType && d.pName.indexOf(this.selectName) > -1 && d.pColor.indexOf(this.selectColor) > -1 && d.pSize.indexOf(this.selectSize) > -1) return d;
                        }
                    }
                });
                if(this.selectCurrency === '台幣'){
                    for(var i=0; i<this.tableData.length; i++){
                        if(this.tableData[i].pLocation === '美國'){
                            this.tableData[i].pCost = parseFloat((this.tableData[i].pCost * this.exchange).toFixed(2));
                            this.tableData[i].pPrice = parseFloat((this.tableData[i].pPrice * this.exchange).toFixed(2));
                        }
                    }
                   
                }else if(this.selectCurrency === '美金'){
                    for(var i=0; i<this.tableData.length; i++){
                        if(this.tableData[i].pLocation === '台灣'){
                            this.tableData[i].pCost = parseFloat((this.tableData[i].pCost / this.exchange).toFixed(2));
                            this.tableData[i].pPrice = parseFloat((this.tableData[i].pPrice / this.exchange).toFixed(2));
                        }
                    }
                }else{
                    for(var i=0; i<this.tableData.length; i++){
                        this.tableData[i].pCost = parseFloat(this.tableData[i].pCost.toFixed(2));
                        this.tableData[i].pPrice = parseFloat(this.tableData[i].pPrice.toFixed(2));
                    }
                }
                this.tableLength = this.tableData.length;
                console.log(this.tableLength);
                if(Math.ceil(this.tableLength / 10) < this.cur_page){
                    this.cur_page = 1;
                }
                console.log(this.cur_page);
                //console.log(this.tableData);
                return this.tableData.slice(this.pageSize*(this.cur_page-1), (this.pageSize*this.cur_page)-1);
                //return this.tableData;
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.cur_page = val;
            },
/***************************************************************************/
/*ajax*/
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
                        this.$message.success(`更改成功`);
                    }
                });
            },

            confirmPurchase(){
            
                this.url = '/server/confirmPurchase';
                this.$axios.post(this.url, this.purchaseForm).then((res) => {
                    if(res.data.errCode === 0) {
                        this.getData();
                        this.$message.success(`進貨成功`);
                    }
                });
            },

            delData(pid){
                this.url = '/server/delStorageList';
                this.$axios.post(this.url, {
                   pid:pid
                }).then((res) => {
                    if(res.data.errCode === 0) {
                        this.getData();
                        this.$message.success(`刪除成功`);
                    }
                });
            },
            insertData(item){
                this.url = '/server/insertStorageList';
                if(this.debugMode) console.log(item);
                item.uploadList = this.imageUrl;
                this.$axios.post(this.url,item).then((res) => {
                    if(res.data.errCode === 0) {
                        this.getData();
                        this.$message.success(`新增成功`);
                    }
                });
                
            },

            addPendingForm(pendingForm){
                this.url = '/server/addPendingForm';
                if(this.debugMode) console.log(pendingForm);
                this.$axios.post(this.url,pendingForm).then((res) => {
                    if(res.data.errCode === 0) {
                        this.getData();
                        this.$message.success(`新增成功`);
                    }
                });
            },

            addSaleForm(saleForm){
                this.url = '/server/addSaleForm';
                this.$axios.post(this.url,saleForm).then((res) => {
                    if(res.data.errCode === 0) {
                        this.getData();
                        this.$message.success(`新增成功`);
                    }
                });
            },

            deleteImg(delImg , pid){
                this.url = '/server/delImg';
                //delImg = delImg.replace("http://127.0.0.1:3000/","");
                delImg = delImg.replace("http://starryapi.us-east-1.elasticbeanstalk.com:3000/","");
                this.$axios.post(this.url,{
                    delImg: delImg,
                    pid: pid
                }).then((res) => {
                    if(res.data.errCode === 0) {
                        this.getData();
                        this.$message.success(`刪除成功`);
                    }
                });
            },
/***************************************************************************/
/*other function*/
            calAmount(){
                this.pendingForm.declareForm.amount = 0;
                for(var i=0; i<this.declareForm.itemList.length; i++){
                    this.declareForm.amount += this.declareForm.itemList[i].total;
                }    
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            clearSaleProductList() {
                this.waitSale = [];
                this.$message.success(`清除銷售列表成功`);
            },

            clearPendingProductList() {
                this.waitPending = [];
                this.$message.success(`清除轉倉列表成功`);
            },

            addSaleProductList() {
                if(this.multipleSelection.length === 0){
                    this.$message.error(`請選擇商品`);
                }else{
                    function arrayUnique(array) {
                        var a = array.concat();
                        for(var i=0; i<a.length; ++i) {
                            for(var j=i+1; j<a.length; ++j) {
                                if(a[i] === a[j])
                                    a.splice(j--, 1);
                            }
                        }

                        return a;
                    }
                    this.waitSale = arrayUnique(this.waitSale.concat(this.multipleSelection));
                    this.$message.success(`加入銷售列表成功`);
                }
                
            },

            addPendingProductList() {
                if(this.multipleSelection.length === 0){
                    this.$message.error(`請選擇商品`);
                }else{
                    var sameLoc = true;
                    var location = '';
                    if( this.waitPending.length > 0){
                        location = this.waitPending[0].pLocation;
                    }
                    else{
                        location = this.multipleSelection[0].pLocation
                    }
                    for(var i=0; i<this.multipleSelection.length; i++){
                        if(this.multipleSelection[i].pLocation != location){
                            sameLoc = false;
                        }
                    }
                    
                    function arrayUnique(array) {
                        var a = array.concat();
                        for(var i=0; i<a.length; ++i) {
                            for(var j=i+1; j<a.length; ++j) {
                                if(a[i] === a[j])
                                    a.splice(j--, 1);
                            }
                        }

                        return a;
                    }
                    if(sameLoc === false){
                        this.$message.error(`請選擇相同倉庫商品`);
                    }else{
                        this.waitPending = arrayUnique(this.waitPending.concat(this.multipleSelection));
                        this.$message.success(`加入轉倉列表成功`);
                    }
                }
                
            },

/***************************************************************************/
/*show dialog*/
            handleSale(){
                this.saleForm = {
                    date: '',
                    productList: [],
                    note: '',
                };
                if(this.waitSale.length === 0){
                    if(this.multipleSelection.length === 0){
                        this.$message.error(`請選擇商品`);
                    }else{
                        this.waitSale = this.multipleSelection;
                        for(var i=0; i<this.waitSale.length; i++){
                            this.saleForm.productList.push(
                                {
                                    pid: this.waitSale[i].pid,
                                    name: this.waitSale[i].pName,
                                    quantity: 0,
                                    size: this.waitSale[i].pSize,
                                    color: this.waitSale[i].pColor,
                                    price: this.waitSale[i].pPrice,
                                    location: this.waitSale[i].pLocation,
                                    cost: this.waitSale[i].pCost,
                                    profit: this.waitSale[i].pPrice - this.waitSale[i].pCost
                                });
                        }
                        this.newSaleVisible = true;

                    } 
                }else{
                    for(var i=0; i<this.waitSale.length; i++){
                        this.saleForm.productList.push(
                            {
                                pid: this.waitSale[i].pid,
                                name: this.waitSale[i].pName,
                                quantity: 0,
                                size: this.waitSale[i].pSize,
                                color: this.waitSale[i].pColor,
                                price: this.waitSale[i].pPrice,
                                location: this.waitSale[i].pLocation,
                                cost: this.waitSale[i].pCost,
                                profit: this.waitSale[i].pPrice - this.waitSale[i].pCost
                            });
                    }
                    this.newSaleVisible = true;
                } 
            },

            handleProductEdit(index, row) {
                this.idx = this.storageList.findIndex(x=>x.pid===row.pid);
                console.log(row.pid);
                const item = this.storageList[this.idx];
                this.imageUrl = [];
                this.showImgUrl = [];
                var imgList = JSON.parse(row.pImg).list;
                for(var i=0; i<imgList.length; i++){
                    //this.showImgUrl.push("http://127.0.0.1:3000/"+imgList[i]);
                    this.showImgUrl.push("http://starryapi.us-east-1.elasticbeanstalk.com:3000/"+imgList[i]);
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
                this.idx = this.pendingForm.productList.findIndex(x=>x.pid===row.pid);
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

            handleSaleEdit(index, row) {
                this.idx = this.saleForm.productList.findIndex(x=>x.pid===row.pid);
                this.saleItemForm = {
                    pid: row.pid,
                    location: row.location,
                    name: row.name,
                    color: row.color,
                    size: row.size,
                    quantity: row.quantity,
                    price: row.price,
                    cost: row.cost,
                    profit: row.price - row.cost
                }
                this.editSaleVisible = true;
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
            handleNewProduct() {
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

            handleNewDeclare() {
                this.declareForm = {
                    itemList: [],
                    amount: 0
                }
                
                this.newDeclareVisible = true;
            },

            handleNewDeclareItem() {
                this.decalreItem = {
                    name: '',
                    quantity: '',
                    price: ''
                }
                this.newDeclareItemVisible = true;
            },

            handleShowNote(index , row){
                this.note = row.pNote;
                this.showNoteVisible = true;
            },

            handleShowImg(index , row){
                this.showImgUrl = [];
                var imgList = JSON.parse(row.pImg).list;
                console.log(imgList);
                for(var i=0; i<imgList.length; i++){
                    //this.showImgUrl.push("http://127.0.0.1:3000/"+imgList[i]);
                    this.showImgUrl.push("http://starryapi.us-east-1.elasticbeanstalk.com:3000/"+imgList[i]);
                }
                this.showImgVisible = true;
            },

            handleProductDelete(index, row) {
                this.idx = this.storageList.findIndex(x=>x.pid===row.pid);
                this.delProductVisible = true;
            },

            handlePendingDelete(index, row) {
                this.idx = this.pendingForm.productList.findIndex(x=>x.pid===row.pid);
                this.delPendingVisible = true;
            },

            handleSaleDelete(index, row) {
                this.idx = this.saleForm.productList.findIndex(x=>x.pid===row.pid);
                this.delSaleVisible = true;
            },

            handleDeclareDelete(index, row) {
                this.idx = index;
                this.delDeclareVisible = true;
            },

            handleDelImg(img){
                this.delImg = img;
                this.delImgVisible = true;
            },

            handlePurchase(index, row){

                this.purchaseForm = {
                    id: row.pid,
                    originQuantity: row.pQuantity,
                    location: row.pLocation,
                    cost: row.pCost,
                    quantity: 0
                }
                this.showPurchaseVisible = true;

            },

            handleNewPending() {
                //check location is the same
                if(this.waitPending.length === 0){
                    if(this.multipleSelection.length === 0){
                        this.$message.error(`請選擇商品`);
                    }else{
                        var location = this.multipleSelection[0].pLocation;   
                        var sameLoc = true;
                        for(var i=0; i<this.multipleSelection.length;i++){
                            if(this.multipleSelection[i].pLocation != location){
                                sameLoc = false;
                            }
                        }
                        if(sameLoc){
                            this.waitPending = this.multipleSelection;
                            this.pendingForm = {
                                origin: '',
                                destination: '',
                                trackingNo: '',
                                tax: 0,
                                freight: 0,
                                date: '',
                                exchange: 1,
                                productList:[],
                                declareForm:{
                                    itemList: [],
                                    amount: 0
                                }  
                            }
                            // 先做單頁
                            this.newPendingVisible = true;
                            this.pendingForm.origin = this.waitPending[0].pLocation;
                            this.pendingForm.exchange = this.exchange;
                            if(this.pendingForm.origin === "美國"){
                                this.pendingForm.destination = "台灣";
                            }else if(this.pendingForm.origin === "台灣"){
                                this.pendingForm.destination = "美國"
                            }
                            this.pendingForm.productList = [];
                            for(var i=0; i<this.waitPending.length; i++){
                                this.pendingForm.productList.push(
                                    {
                                        pid: this.waitPending[i].pid,
                                        name: this.waitPending[i].pName,
                                        type: this.waitPending[i].pType,
                                        shipmentCnt: 0,
                                        size: this.waitPending[i].pSize,
                                        color: this.waitPending[i].pColor,
                                        price: this.waitPending[i].pPrice,
                                        cost: this.waitPending[i].pCost,
                                        img: this.waitPending[i].pImg,
                                        note: this.waitPending[i].pNote
                                    });
                            }
                        }else{
                            this.$message.error(`請選擇相同倉庫商品`);
                        }
                    } 
                }
                else{
                    var location = this.waitPending[0].pLocation;   
                    var sameLoc = true;
                    for(var i=0; i<this.waitPending.length;i++){
                        if(this.waitPending[i].pLocation != location){
                            sameLoc = false;
                        }
                    }
                    if(sameLoc){
                        this.pendingForm = {
                            origin: '',
                            destination: '',
                            trackingNo: '',
                            tax: 0,
                            freight: 0,
                            date: '',
                            exchange: 1,
                            productList:[],
                            declareForm:{
                                itemList: [],
                                amount: 0
                            }  
                        }
                        // 先做單頁
                        this.newPendingVisible = true;
                        this.pendingForm.origin = this.waitPending[0].pLocation;
                        this.pendingForm.exchange = this.exchange;
                        if(this.pendingForm.origin === "美國"){
                            this.pendingForm.destination = "台灣";
                        }else if(this.pendingForm.origin === "台灣"){
                            this.pendingForm.destination = "美國"
                        }
                        this.pendingForm.productList = [];
                        for(var i=0; i<this.waitPending.length; i++){
                            this.pendingForm.productList.push(
                                {
                                    pid: this.waitPending[i].pid,
                                    name: this.waitPending[i].pName,
                                    type: this.waitPending[i].pType,
                                    shipmentCnt: 0,
                                    size: this.waitPending[i].pSize,
                                    color: this.waitPending[i].pColor,
                                    price: this.waitPending[i].pPrice,
                                    cost: this.waitPending[i].pCost,
                                    img: this.waitPending[i].pImg,
                                    note: this.waitPending[i].pNote
                                });
                        }
                    }else{
                        this.$message.error(`請選擇相同倉庫商品`);
                    }
                }
            },
/***************************************************************************/
/*handle save*/
            saveProductEdit() {
                if(this.checkNewProduct()) {
                    this.editData(this.form);
                    //this.$set(this.storageList, this.idx, this.form);
                    if(this.debugMode) console.log(this.storageList[this.idx]);
                    this.editProductVisible = false;
                    //this.$message.success(`修改成功`);
                }
            },

            savePendingEdit() {
                if(this.checkShipment()){
                    this.$set(this.pendingForm.productList, this.idx, this.pendingItemForm);
                    this.editPendingVisible = false;
                    this.$message.success(`修改成功`);
                }
            },

            saveSaleEdit() {
                if(this.checkQuanitity()){
                    this.saleItemForm.profit = this.saleItemForm.price - this .saleItemForm.cost;
                    this.$set(this.saleForm.productList, this.idx, this.saleItemForm);
                    this.editSaleVisible = false;
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
                    //this.$message.success(`新增成功`);
                }
            },

            savePurchase() {
                if(this.checkPurchase()){
                    this.confirmPurchase();
                    this.showPurchaseVisible = false;
                }
            },


            saveNewPending() {
                if(this.checkNewPending()){
                    this.addPendingForm(this.pendingForm);
                    // for(var i=0; i<this.pendingForm.productList.length; i++){
                    //     var idx = this.storageList.findIndex(x=>x.pid===this.pendingForm.productList[i].pid);
                    //     this.storageList[idx].pQuantity -= this.pendingForm.productList[i].shipmentCnt;
                    // }
                    this.newPendingVisible = false;
                    this.waitPending = [];
                    //this.$message.success(`新增成功`);
                }
            },

            saveNewSale() {
                if(this.checkNewSale()){
                    this.addSaleForm(this.saleForm);
                    this.newSaleVisible = false;
                    this.waitSale = [];
                    //this.$message.success(`新增成功`);
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
/***************************************************************************/
/*handle delete*/
            deleteProductRow(){
                this.delData(this.storageList[this.idx].pid);
                // this.storageList.splice(this.idx, 1);
                // this.$message.success('刪除成功');
                this.delProductVisible = false;
            },

            deletePendingRow(){
                this.pendingForm.productList.splice(this.idx, 1);
                this.$message.success('刪除成功');
                this.delPendingVisible = false;
            },

            deleteSaleRow(){
                this.saleForm.productList.splice(this.idx, 1);
                this.$message.success('刪除成功');
                this.delSaleVisible = false;
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
                //this.$message.success('刪除成功');
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
/***************************************************************************/
/*check form value*/

            checkNewProduct(){
                if(this.form.pName === '') {
                    this.$message.error(`請填入品名`);
                    return false;
                }
                if(this.form.pLocation === ''){
                    this.$message.error(`請填入倉庫`);
                    return false;
                }
                if(this.form.pType === '') {
                    this.$message.error(`請填入種類`);
                    return false;
                }
                if(isNaN(this.form.pCost) || this.form.pCost === '') {
                    this.$message.error(`請填入成本`);
                    return false;
                }
                if(isNaN(this.form.pPrice) || this.form.pPrice === '') {
                    this.$message.error(`請填入售價`);
                    return false;
                }
                if(isNaN(this.form.pQuantity) || this.form.pQuantity === '') {
                    this.$message.error(`請填入數量`);
                    return false;
                }
                if(this.form.pColor === ''){
                    this.$message.error(`請填入顏色`);
                    return false;
                }
                if(this.form.pSize === '') {
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
                if(this.pendingForm.trackingNo === '') {
                    this.$message.error(`請填入Track`);
                    return false;
                }
                if(this.pendingForm.date === '') {
                    this.$message.error(`請填入日期`);
                    return false;
                }
                if(isNaN(this.pendingForm.tax)|| this.pendingForm.tax === '') {
                    this.$message.error(`請填入稅金,之後才填請填0`);
                    return false;
                }
                if(isNaN(this.pendingForm.freight)|| this.pendingForm.freight === '') {
                    this.$message.error(`請填入運費,之後才填請填0`);
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

            checkNewSale(){
                if(this.saleForm.date === '') {
                    this.$message.error(`請填入日期`);
                    return false;
                }
                return true;
            },

            checkQuanitity(){
                var idx = this.storageList.findIndex(x=>x.pid===this.saleForm.productList[this.idx].pid);
                if(isNaN(this.saleItemForm.quantity) || this.saleItemForm.quantity === '') {
                    this.$message.error(`表單尚未填完或格式有誤`);
                    return false;
                }
                if(!isNaN(this.saleItemForm.quantity) && this.storageList[idx].pQuantity - this.saleItemForm.quantity < 0){
                     this.$message.error(`庫存不足`);
                     return false;
                }
                if(!isNaN(this.saleItemForm.quantity) && this.saleItemForm.quantity < 0){
                     this.$message.error(`銷售數量不能小於0`);
                     return false;
                }
                return true;
            },

            checkShipment(){
                var idx = this.storageList.findIndex(x=>x.pid===this.pendingForm.productList[this.idx].pid);
                if(isNaN(this.pendingItemForm.shipmentCnt) || this.pendingItemForm.shipmentCnt==='') {
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

            checkPurchase(){
                if(isNaN(this.purchaseForm.quantity) || this.purchaseForm.quantity === ''){
                    this.$message.error(`請填入金額`);
                    return false;
                }
                if(!isNaN(this.purchaseForm.quantity) && this.purchaseForm.quantity < 0){
                     this.$message.error(`進貨數量不能小於0`);
                     return false;
                }
                return true;
            },

/***************************************************************************/
/*upload img*/

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
/***************************************************************************/
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
