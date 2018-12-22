<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-row>
                    <el-col>
                        <el-card shadow="hover" class="mgb20">
                            <div class="user-info">
                                <img src="static/img/img.jpg" class="user-avator" alt="">
                                <div class="user-info-cont">
                                    <div class="user-info-name">{{name}}</div>
                                </div>
                            </div>
                            <div class="user-info-list">美國剩餘金額：<span>{{USDollar}}</span></div>
                            <div class="user-info-list">台灣剩餘金額：<span>{{TWDollar}}</span></div>
                            <el-button size="small" type="primary" @click="showEditDollar">修改金額</el-button>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-dialog title="修改金額" :visible.sync="editDollarVisible" width="30%">
            <el-form ref="form" :model="form" label-width="50px">

                <el-form-item label="美金">
                    <el-input v-model="form.USDollar"></el-input>
                </el-form-item>
                <el-form-item label="台幣">
                    <el-input v-model="form.TWDollar"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDollarVisible = false">取消</el-button>
                <el-button type="primary" @click="saveEditDollar">確定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'dashboard',
        data() {
            return {
                name: localStorage.getItem('ms_username'),
                USDollar: 0,
                TWDollar: 0,
                editDollarVisible: false,

                form: {
                    USDollar: 0,
                    TWDollar: 0
                }
            }
        },
        created (){
            this.getDollar();
        },
        computed: {

        },
        methods: {
/************************************************************************************************/
/*ajax*/
            getDollar(){
                this.url = '/server/getDollar';
                this.$axios.post(this.url, {
                }).then((res) => {
                    this.USDollar = res.data.USDollar;
                    this.TWDollar = res.data.TWDollar;
                });
            },

            updateDollar(form){
                this.url = '/server/updateDollar';
                this.$axios.post(this.url, form).then((res) => {
                    if(res.data.errCode === 0) {
                        this.getDollar();
                        this.$message.success(`更新成功`);
                    }
                });
            },
/****************************************************************************************************/
/*show dialog*/

            showEditDollar(){
                this.form = {
                    USDollar: this.USDollar,
                    TWDollar: this.TWDollar
                }
                this.editDollarVisible = true;
            },
/****************************************************************************************************/

            saveEditDollar(){
                if(this.checkEditDollar()){
                    this.updateDollar(this.form);
                    this.editDollarVisible = false;
                    //this.$message.success(`新增成功`);
                }
            },

            checkEditDollar(){
                if(isNaN(this.form.USDollar) || this.form.USDollar === '') {
                    this.$message.error(`請填入美金`);
                    return false;
                }
                if(isNaN(this.form.TWDollar) || this.form.TWDollar === ''){
                     this.$message.error(`請填入台幣`);
                     return false;
                }
                return true;
            },

        }
    }

</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 12px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

</style>
